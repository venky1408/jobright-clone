🔍 About the Project
This application is an intelligent job recommender and resume analyzer built using:

Vector Search with FAISS for semantic job matching

Local LLM (LLaMA 3 or DeepSeek) for resume-job match evaluation

Chatbot for personalized career Q&A and resume advice

Main Features:

Upload a resume and retrieve the top 50 jobs from a pre-indexed job database

Get a match percentage and reasoning using a local LLM

Ask job/career-related questions through a chatbot interface

Analyze your resume in detail against a job description with keyword gaps and improvement suggestions

📁 Project Structure

bash
Copy
Edit
.
├── backend/               # FastAPI server and resume analysis logic
│   ├── main.py
│   └── tools/             # Resume parsing, LLM scoring, vector matching
├── frontend/              # React UI
├── model/                 # GGUF LLMs (LLaMA3, DeepSeek etc.)
├── scraper/               # SerpAPI job crawler
├── vectorstore/           # FAISS job index and metadata
├── README.txt             # This file
└── requirements.txt       # Python packages
⚙️ Setup Instructions

1. Clone the repo

bash
Copy
Edit
git clone https://github.com/your-username/ai-resume-matcher.git
cd ai-resume-matcher
2. Create virtual environment

bash
Copy
Edit
python3 -m venv venv
source venv/bin/activate
3. Install dependencies

bash
Copy
Edit
pip install -r requirements.txt
4. Download and place models
Download .gguf models (e.g., LLaMA 3, DeepSeek) and place them in the model/ directory.

Example:

Copy
Edit
model/Meta-Llama-3-8B-Instruct.Q4_K_M.gguf
5. Start frontend (React)

bash
Copy
Edit
cd frontend
npm install
npm run dev
6. Start backend (FastAPI)

bash
Copy
Edit
cd backend
uvicorn main:app --reload --port 8000
App URL:
Visit http://localhost:5173

🔁 Automating Job Index Refresh

You can schedule job scraping and vectorization to run every 24 hours using a cron job:

bash
Copy
Edit
crontab -e
Then add:

swift
Copy
Edit
0 3 * * * cd /Users/yourname/Desktop/ai-resume && /path/to/venv/bin/python scraper/google_jobs_scraper.py && /path/to/venv/bin/python backend/tools/job_vectorize.py
🧠 Supported Local LLMs

Meta LLaMA 3 (8B instruct)

DeepSeek Coder 6.7B

Mistral 7B (optional)

📌 Notes

Resume must be in PDF format

Embedding model: all-MiniLM-L6-v2

LLM match percentage logic uses a prompt-guided evaluator

No external API (e.g., OpenAI) is used — runs 100% locally

