from fastapi import UploadFile, Form, File
from llama_cpp import Llama
import os, io, pdfplumber
import chromadb
from sentence_transformers import SentenceTransformer
import hashlib

# Load local LLaMA model
llm = Llama(
    model_path=os.path.join(
        os.path.dirname(__file__),
        "../model/Meta-Llama-3-8B-Instruct.Q4_K_M.gguf"
    ),
    n_ctx=4096,
    n_gpu_layers=20
)

# Setup vector DB and embedder
chroma = chromadb.Client()
collection = chroma.get_or_create_collection("rag_resume")
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Track hashes of embedded content to avoid duplication
seen_hashes = set()

# Utility: Compute SHA-256 hash
def compute_hash(text: str):
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

# Utility: Extract text from PDF
async def extract_text(file):
    content = await file.read()
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        return "\n".join([page.extract_text() or "" for page in pdf.pages])

# Utility: Chunk + embed + store if not already done
def store_text(text: str, source: str):
    text_hash = compute_hash(text)
    if text_hash in seen_hashes:
        print(f"[{source}] Duplicate detected. Skipping embedding.")
        return

    seen_hashes.add(text_hash)

    chunks = [text[i:i+700] for i in range(0, len(text), 700)]
    embeds = embedder.encode(chunks).tolist()
    ids = [f"{source}_{i}_{text_hash[:8]}" for i in range(len(chunks))]  # use hash in IDs to avoid collision
    metadatas = [{"source": source}] * len(chunks)

    collection.add(documents=chunks, embeddings=embeds, metadatas=metadatas, ids=ids)
    print(f"[{source}] Embedded {len(chunks)} chunks with hash {text_hash[:8]}")

# Utility: Retrieve top-K chunks as context
def retrieve_context(question: str, k=6):
    qvec = embedder.encode([question]).tolist()[0]
    results = collection.query(query_embeddings=[qvec], n_results=k)
    return "\n".join(results["documents"][0])

# API: RAG-based Q&A
async def ask_resume_question(resume: UploadFile = File(...), job_description: str = Form(...), question: str = Form(...)):
    resume_text = await extract_text(resume)
    store_text(resume_text, source="resume")

    if job_description.strip():
        store_text(job_description, source="jd")

    context = retrieve_context(question)
    prompt = f"""
You are a helpful AI assistant. Based on the user's resume and job description, answer their question clearly.

Context:
{context}

Question:
{question}

Answer:
"""
    out = llm(prompt, max_tokens=1024)
    return {"answer": out["choices"][0]["text"].strip()}
