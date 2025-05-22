from llama_cpp import Llama
import os
import re

model_path = os.path.join(
    os.path.dirname(__file__),
    "../../model/Meta-Llama-3-8B-Instruct.Q4_K_M.gguf"
)

llm = Llama(
    model_path=model_path,
    n_ctx=8192,
    n_gpu_layers=0
)

def get_llm_match_percentage(resume_text: str, job_text: str, core_score: float):
    print(f"[DEBUG] FAISS core_similarity_score received: {core_score}")

    prompt = f"""
    ### As a skilled Application Tracking System (ATS) with advanced knowledge in software engineering, full-stack development, backend/frontend systems, cloud platforms (AWS, GCP, Azure), DevOps, machine learning (ML), AI, LLMs, QA, test automation, SRE, cybersecurity and data science.
your role is to meticulously evaluate a candidate's resume based on the provided job description.

### Your evaluation will involve analyzing the resume for relevant skills, experiences, and qualifications that align with the job requirements. Look for key buzzwords and specific criteria outlined in the job description to determine the candidate's suitability for the position.

### Provide a detailed assessment of how well the resume matches the job requirements, highlighting strengths, weaknesses, and any potential areas of concern. Offer constructive feedback on how the candidate can enhance their resume to better align with the job description and improve their chances of securing the position.

### Your evaluation should be thorough, precise, and objective, ensuring that the most qualified candidates are accurately identified based on their resume content in relation to the job criteria.

### Remember to utilize your expertise in software engineering, full-stack development, backend/frontend systems, cloud platforms (AWS, GCP, Azure), DevOps, machine learning (ML), AI, LLMs, QA, test automation, SRE, cybersecurity and data science, to conduct a comprehensive evaluation that optimizes the recruitment process for the hiring company. Your insights will play a crucial role in determining the candidate's compatibility with the job role.

resume={resume_text}
jd={job_text}

### Please provide the evaluation results in the following format:

Evaluation Output:
-Percentage of match between the resume and the job description: [number]% - [brief explanation].
### Important: Do not include any additional explanations, or bold formatting outside of the specified output format.

"""

    result = llm(prompt=prompt, max_tokens=400)
    output = result["choices"][0]["text"].strip()

    print(f"\n[LLM RAW OUTPUT START]\n{output}\n[LLM RAW OUTPUT END]\n")

    # Match: Percentage of match between the resume and the job description
    match = re.search(
        r"Percentage of match between the resume and the job description:\s*(\d{1,3})%\s*[-:]\s*(.+)",
        output,
        re.IGNORECASE | re.DOTALL
    )

    if match:
        return {
            "match_score": match.group(1),
            "summary": match.group(2).strip()
        }
    else:
        print("[REGEX ERROR] Could not extract match % or explanation.")
        return {
            "match_score": "N/A",
            "summary": "Explanation not available. LLM response may have deviated from the expected format."
        }