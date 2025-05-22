import json
import faiss
from sentence_transformers import SentenceTransformer
from pathlib import Path
from tools.resume_parser import extract_resume_sections

# Ensure we use absolute paths relative to the root of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent
VECTOR_STORE_PATH = BASE_DIR / "vectorstore" / "job_index.faiss"
METADATA_STORE_PATH = BASE_DIR / "vectorstore" / "job_metadata.json"

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

def match_resume_to_jobs(resume_text: str, top_k: int =50):
    # Load FAISS index and job metadata
    index = faiss.read_index(str(VECTOR_STORE_PATH))
    with open(METADATA_STORE_PATH, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    # Extract and weight important resume sections
    resume_sections = extract_resume_sections(resume_text)
    important_text = (
        (resume_sections.get("skills", "") + "\n") * 2 +
        (resume_sections.get("experience", "") + "\n") * 2 +
        resume_sections.get("education", "")
    )

    # Embed the resume
    resume_vector = model.encode([important_text])

    if resume_vector.shape[1] != index.d:
        raise ValueError(f"Resume embedding dimension {resume_vector.shape[1]} does not match index dimension {index.d}")

    # Search across all jobs
    search_k = index.ntotal  # 320 if you have 320 jobs
    D, I = index.search(resume_vector, search_k)

    # Normalize distances to [0, 1] similarity scores
    max_dist = max(D[0]) + 1e-5
    min_dist = min(D[0])

    def normalize(d):
        return 1 - ((d - min_dist) / (max_dist - min_dist))

    # Deduplicate and collect top_k
    seen_jobs = set()
    top_jobs = []

    for rank, i in enumerate(I[0]):
        job = metadata[i]
        unique_key = f"{job.get('title', '').strip()}::{job.get('company_name', '').strip()}"
        if unique_key in seen_jobs:
            continue
        seen_jobs.add(unique_key)

        combined_text = "\n".join(
            [
                job.get("description", ""),
                *[f"{hl.get('title', '')}\n" + "\n".join(hl.get("items", [])) for hl in job.get("job_highlights", [])]
            ]
        )

        top_jobs.append({
            **job,
            "score": float(normalize(D[0][rank])),  # Score now in [0,1], higher = better
            "description": job.get("description", ""),
            "job_highlights": job.get("job_highlights", []),
            "matched_on": combined_text[:300]
        })

        if len(top_jobs) >= top_k:
            break

    # Ensure sorted by score descending
    top_jobs.sort(key=lambda x: x["score"], reverse=True)
    return top_jobs