import pdfplumber
import io

async def extract_text_from_pdf(file):
    contents = await file.read()
    all_text = ""
    with pdfplumber.open(io.BytesIO(contents)) as pdf:
        for page in pdf.pages:
            all_text += page.extract_text() or ""
    return all_text

def extract_resume_sections(resume_text: str) -> dict:
    # Simple section splitter (you can customize this)
    sections = {
        "experience": "",
        "skills": ""
    }

    if "experience" in resume_text.lower():
        sections["experience"] = resume_text
    if "skills" in resume_text.lower():
        sections["skills"] = resume_text

    return sections