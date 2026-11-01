
from pathlib import Path
import os
import pickle

import faiss
import networkx as nx
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from groq import Groq
from sentence_transformers import SentenceTransformer


# --------------------------------------------------
# Project paths
# --------------------------------------------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
PROCESSED_DIR = DATA_DIR / "processed"
RAW_FILE = DATA_DIR / "raw" / "2011.xlsx"

INDEX_FILE = PROCESSED_DIR / "patent_faiss.index"
GRAPH_FILE = PROCESSED_DIR / "patent_knowledge_graph.gpickle"

load_dotenv(PROJECT_ROOT / ".env")

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


# --------------------------------------------------
# Load model, FAISS index, and knowledge graph
# --------------------------------------------------
model = SentenceTransformer(MODEL_NAME)
index = faiss.read_index(str(INDEX_FILE))

try:
    graph = nx.read_gpickle(GRAPH_FILE)
except (AttributeError, ImportError):
    with open(GRAPH_FILE, "rb") as file:
        graph = pickle.load(file)


# --------------------------------------------------
# Load patent dataset
# IMPORTANT: row order must match the FAISS index
# --------------------------------------------------
df = pd.read_excel(RAW_FILE)
df = df.fillna("")
df = df.drop_duplicates().copy()

if "Application Number" in df.columns:
    df = df.drop_duplicates(
        subset=["Application Number"], keep="first"
    )

df = df.reset_index(drop=True)

print("Dataset rows:", len(df))
print("FAISS vectors:", index.ntotal)

if len(df) != index.ntotal:
    print(
        "WARNING: Dataset and FAISS index sizes differ. "
        "Verify the original embedding row mapping before "
        "trusting patent-to-result associations."
    )


# --------------------------------------------------
# Initialize Groq
# --------------------------------------------------
api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key) if api_key else None


# --------------------------------------------------
# Helpers
# --------------------------------------------------
def json_safe(value):
    """Convert Excel/Pandas values into JSON-safe values."""
    if value is None:
        return None

    if isinstance(value, dict):
        return {str(k): json_safe(v) for k, v in value.items()}

    if isinstance(value, (list, tuple)):
        return [json_safe(v) for v in value]

    if isinstance(value, np.ndarray):
        return value.tolist()

    if isinstance(value, (np.integer,)):
        return int(value)

    if isinstance(value, (np.floating,)):
        return float(value) if np.isfinite(value) else None

    if isinstance(value, (np.bool_,)):
        return bool(value)

    if isinstance(value, (pd.Timestamp,)):
        return value.isoformat()

    if pd.isna(value):
        return None

    if isinstance(value, (str, int, float, bool)):
        return value

    return str(value)


def get_patent_record(row):
    """Return every field available in the original Excel record."""
    patent = {
        str(column): json_safe(value)
        for column, value in row.items()
    }

    # Keep normalized names used by the current frontend.
    patent["application_number"] = str(
        row.get("Application Number", "") or ""
    )
    patent["title"] = str(row.get("Title", "") or "")

    return patent


# --------------------------------------------------
# Semantic patent search
# --------------------------------------------------
def search_patents(query: str, top_k: int = 5):
    """Find similar patents and return their available metadata."""
    query = query.strip()

    if not query:
        return []

    query_vector = model.encode(
        [query],
        convert_to_numpy=True,
        normalize_embeddings=True,
    ).astype("float32")

    scores, indices = index.search(query_vector, top_k)
    results = []

    for score, idx in zip(scores[0], indices[0]):
        if idx < 0:
            continue

        if idx >= len(df):
            continue

        row = df.iloc[int(idx)]
        patent = get_patent_record(row)
        patent["score"] = round(float(score), 4)
        results.append(patent)

    return results


# --------------------------------------------------
# RAG question answering
# --------------------------------------------------
def ask_patent_question(query: str):
    """Search patents and generate an evidence-based answer."""
    query = query.strip()

    if not query:
        return {
            "query": query,
            "results": [],
            "answer": "Please enter a patent-related query.",
        }

    results = search_patents(query)

    if not results:
        return {
            "query": query,
            "results": [],
            "answer": "No matching indexed patent records were found.",
        }

    if client is None:
        return {
            "query": query,
            "results": results,
            "answer": (
                "Groq API key is missing. Check your root .env file."
            ),
        }

    # Provide available record fields as evidence, not just title/score.
    evidence_records = []

    for patent in results:
        evidence_records.append(
            {
                key: value
                for key, value in patent.items()
                if value not in (None, "")
                and key != "score"
            }
        )

    evidence = str(evidence_records)

    prompt = f"""
You are an assistant for searching Indian patent records.

Use only the supplied patent record data.
The data may contain metadata, abstracts, or document text,
but it may not contain every field of a complete patent document.

Do not invent missing inventor names, applicants, claims,
descriptions, dates, or legal status.
Clearly state when the available records do not contain
enough evidence to answer.
Similarity scores do not prove that a patent is prior art.

User question:
{query}

Retrieved patent records:
{evidence}
"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Answer accurately using only the supplied "
                        "patent records. Never invent missing facts."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            max_completion_tokens=700,
        )

        answer = response.choices[0].message.content or (
            "The model returned an empty answer."
        )

    except Exception as exc:
        print(f"Groq answer generation failed: {type(exc).__name__}")
        answer = (
            "Patent search completed, but AI answer generation failed. "
            "Review the backend terminal for details."
        )

    return {
        "query": query,
        "results": results,
        "answer": answer,
    }
