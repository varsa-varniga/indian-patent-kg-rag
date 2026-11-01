
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from patent_rag.pipeline import ask_patent_question

app = FastAPI(
    title="Indian Patent KG-RAG API",
    description="Knowledge-Graph-Enhanced RAG System for Indian Patent Search",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str


@app.get("/")
def home():
    return {"message": "Indian Patent KG-RAG API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/ask")
def ask(request: SearchRequest):
    query = request.query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Please enter a patent-related query.",
        )

    try:
        return ask_patent_question(query)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Patent search failed: {type(exc).__name__}",
        ) from exc
