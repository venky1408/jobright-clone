from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from tools.resume_parser import extract_text_from_pdf
from tools.resume_rewriter import rewrite_resume_with_llm
from typing import Optional
from rag_engine import ask_resume_question
from pydantic import BaseModel
from tools.job_matcher import match_resume_to_jobs
from tools.llm_matcher import get_llm_match_percentage
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Global Cache to Hold Parsed Resume ===
parsed_resume_text_cache = {"resume": ""}

class SummaryRequest(BaseModel):
    role: str
    experience: str
    keywords: str
    skills: str
    achievements: str
    interests: str

@app.post("/rewrite_resume")
async def rewrite_resume(resume: UploadFile = File(...), job_description: str = Form(...)):
    resume_text = await extract_text_from_pdf(resume)
    rewritten = rewrite_resume_with_llm(resume_text, job_description)
    return {"rewritten_resume": rewritten}

@app.post("/ask_resume_question")
async def handle_ask_question(resume: UploadFile = File(...), job_description: str = Form(...), question: str = Form(...)):
    return await ask_resume_question(resume, job_description, question)



@app.post("/match_jobs")
async def match_jobs(resume: UploadFile = File(...)):
    resume_text = await extract_text_from_pdf(resume)
    parsed_resume_text_cache["resume"] = resume_text 
    top_jobs = match_resume_to_jobs(resume_text, top_k=50)
    return top_jobs


# === LLM-Based Match % Evaluation Using Stored Resume ===
@app.post("/generate_match_score")
async def generate_match_score(job_description: str = Form(...), core_score: float = Form(...)):
    try:
        resume_text = parsed_resume_text_cache.get("resume", "")
        if not resume_text:
            return {"error": "No resume uploaded yet. Please upload resume first."}

        result = get_llm_match_percentage(resume_text, job_description, core_score)
        return {
            "match_score": result["match_score"],
            "summary": result["summary"]
        }
    except Exception as e:
        print("[LLM MATCH ERROR]", str(e))
        return {"error": str(e)}

