import os
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from pathlib import Path

from typing import List, Dict

# === 1. CONFIG ===
BASE_DIR = Path(__file__).resolve().parent.parent.parent
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # You can switch to 'e5-base-v2' for better quality
JOBS_JSON_PATH = BASE_DIR / "scraper" / "jobs.json"
VECTOR_STORE_PATH = BASE_DIR / "vectorstore" / "job_index.faiss"
METADATA_STORE_PATH = BASE_DIR / "vectorstore" / "job_metadata.json"

# === 2. LOAD JOB DATA ===
def load_jobs(path: Path) -> List[Dict]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# === 3. FORMAT JOB TEXT FOR EMBEDDING ===
def job_to_text(job: Dict) -> str:
    text_parts = [
        job.get("title", ""),
        job.get("company_name", ""),
        job.get("location", ""),
        job.get("description", "")
    ]

    # Flatten job_highlights
    highlights = job.get("job_highlights", [])
    for section in highlights:
        text_parts.append(section.get("title", ""))
        text_parts.extend(section.get("items", []))

    return "\n".join(text_parts)

# === 4. EMBED AND INDEX ===
def embed_jobs(jobs: List[Dict]):
    model = SentenceTransformer(EMBEDDING_MODEL)
    texts = [job_to_text(job) for job in jobs]
    embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)

    # FAISS index
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)

    # Save index and metadata
    VECTOR_STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(VECTOR_STORE_PATH))

    with open(METADATA_STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(jobs, f, indent=2)

    print(f"✅ Embedded {len(jobs)} jobs and stored to FAISS.")

# === 5. MAIN ===
if __name__ == "__main__":
    if not JOBS_JSON_PATH.exists():
        print(f"❌ File not found: {JOBS_JSON_PATH}")
    else:
        jobs = load_jobs(JOBS_JSON_PATH)
        embed_jobs(jobs)