from llama_cpp import Llama
import os
import time
from tools.resume_parser import extract_text_from_pdf

model_path = os.path.join(
    os.path.dirname(__file__),
    "../../model/Meta-Llama-3-8B-Instruct.Q4_K_M.gguf"
)

llm = Llama(
    model_path=model_path,
    n_ctx=4096,
    n_gpu_layers=20
)

def rewrite_resume_with_llm(resume_text: str, job_description: str):
    prompt = f"""
As a skilled Application Tracking System (ATS) with expertise in software engineering, cloud platforms (AWS, GCP, Azure), DevOps, ML/AI, LLMs, QA, test automation, and data science, evaluate the following resume against the given job description.

Your task:
1. Analyze the resume for relevant skills and experiences.
2. Identify how well it matches the job.
3. Provide suggestions to improve alignment.

resume={resume_text}
jd={job_description}

Respond in the format below:

Evaluation Output:
1. Percentage of match between the resume and the job description: [number]% - [brief explanation].
2. Key keywords missing from the resume.
3. Tips to enhance the resume and improve its alignment with the job requirements.
4. Overall assessment of the candidate's suitability for the position.
5. Additional insights or suggestions.
Do not include any extra text outside this format.
"""
    output = llm(prompt, max_tokens=4096)
    return output["choices"][0]["text"].strip()

