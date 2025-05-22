#!/bin/bash
#update your path 
cd /Users/likhitmonavarthi/Desktop/ai-resume

echo "🕒 Running job scraper..."
python3 scraper/google_jobs_scraper.py

echo "🔄 Vectorizing job postings..."
python3 tools/job_vectorize.py

echo "✅ Job scraping and vectorization completed at $(date)"
