from serpapi import GoogleSearch
import json
import time

API_KEY = "a1105037b2d6ac063783792fa79dba9f5580e6dd77834b91689d6c13929f5175"  # Replace this with your actual key

# Define roles and employment types
roles = [
    "AI Engineer", "Software Engineer", "Full Stack Developer",
    "Data Analyst", "QA Engineer", "DevOps Engineer",
    "LLM Engineer", "Product Manager", 
]

employment_types = ["Intern", "Full Time", "Part Time", "Contract", "Co-op"]

def fetch_jobs(query, location="United States", max_jobs=20):
    search = GoogleSearch({
        "engine": "google_jobs",
        "q": query,
        "location": location,
        "hl": "en",
        "api_key": API_KEY
    })

    results = search.get_dict()
    jobs = results.get("jobs_results", [])[:max_jobs]
    return jobs

def run_scraper():
    all_jobs = []

    for role in roles:
        for emp_type in employment_types:
            query = f"{role} {emp_type}"
            print(f"🔍 Fetching: {query}")
            jobs = fetch_jobs(query)
            for job in jobs:
                job["search_query"] = query
            all_jobs.extend(jobs)
            time.sleep(2)  # polite delay to avoid hitting rate limit

    # Save to jobs.json
    with open("jobs.json", "w") as f:
        json.dump(all_jobs, f, indent=2)

    print(f"✅ Saved {len(all_jobs)} jobs to jobs.json")

if __name__ == "__main__":
    run_scraper()
