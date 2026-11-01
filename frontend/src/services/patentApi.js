
const API_BASE_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.detail || `Request failed (${response.status})`
    );
  }

  return data;
}

// Search patents using our KG-RAG backend
export async function searchPatents(query) {
  const cleanedQuery = query?.trim();

  if (!cleanedQuery) {
    throw new Error("Please enter a patent search query.");
  }

  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: cleanedQuery }),
  });

  return handleResponse(response);
}

// Get the available fields for a patent record
export function getPatentDetails(patent) {
  if (!patent || typeof patent !== "object") {
    throw new Error("Patent record is unavailable.");
  }

  return {
    ...patent,
    application_number:
      patent.application_number ??
      patent["Application Number"] ??
      "",
    title: patent.title ?? patent["Title"] ?? "",
    abstract:
      patent.abstract ??
      patent["Abstract"] ??
      patent["Abstract Text"] ??
      "",
    pdf_url:
      patent.pdf_url ??
      patent["PDF URL"] ??
      patent["Document URL"] ??
      patent["Patent PDF URL"] ??
      "",
  };
}

// Open the original patent PDF when a valid URL is available
export function getPatentPdfUrl(patent) {
  const details = getPatentDetails(patent);
  const url = details.pdf_url;

  if (!url) return null;

  try {
    const parsedUrl = new URL(url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return null;
    }

    return parsedUrl.href;
  } catch {
    return null;
  }
}
