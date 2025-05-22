import React, { useState } from "react";
import axios from "axios";

const MatchJobsUI = () => {
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [matchPercents, setMatchPercents] = useState({});

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/match_jobs", formData);
      setJobs(response.data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setLoading(false);
  };

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleLLMMatch = async (index, job) => {
    const jobText = [
      job.title,
      job.company_name,
      job.location,
      job.description,
      ...(job.job_highlights || []).flatMap(hl => [hl.title, ...hl.items])
    ].join("\n");

    const formData = new FormData();
    formData.append("job_description", jobText);
    formData.append("core_score", job.score || 0);

    try {
      const response = await axios.post("http://localhost:8000/generate_match_score", formData);
      const { match_score, summary } = response.data;
      setMatchPercents((prev) => ({
        ...prev,
        [index]: { score: match_score, explanation: summary },
      }));
    } catch (err) {
      console.error("Error getting LLM match %:", err);
    }
  };

  const getMatchLabel = (score) => {
    const percent = score * 100;
    if (percent >= 90) return "Strong Match";
    if (percent >= 65) return "Good Match";
    if (percent >= 50) return "Moderate Match";
    return "Low Match";
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(to right, #eef2ff, #fdf4ff)',
      fontFamily: 'Segoe UI, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
          Find Top Matching Jobs
        </h2>

        {/* Upload */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            style={{
              padding: '0.5rem',
              border: '1px solid #cbd5e0',
              borderRadius: '0.5rem',
              backgroundColor: '#fff',
              minWidth: '200px',
              flexGrow: 1
            }}
          />
          {file && (
                <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.25rem' }}>
                    Selected: {file.name}
                </p>
           )}
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Matching..." : "Upload Resume"}
          </button>
        </div>

        {/* Job List - Stack View */}
        {[...jobs].sort((a, b) => b.score - a.score).map((job, idx) => (
          <div key={idx} style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: '1rem',
            background: '#fff',
            borderRadius: '1rem',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            alignItems: 'flex-start'
          }}>

            {/* Left: Job Info */}
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.25rem', color: '#1e293b' }}>{job.title}</h3>
                <p style={{ color: '#475569', fontSize: '0.95rem' }}>
                  {job.company_name} / {job.location}
                </p>
              </div>

              {expanded[idx] && (
                <div style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem' }}>
                  <p style={{ fontWeight: '600' }}>Job Description:</p>
                  <p style={{ whiteSpace: 'pre-line' }}>{job.description}</p>

                  {job.job_highlights?.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ fontWeight: '600' }}>Highlights:</p>
                      {job.job_highlights.map((hl, i) => (
                        <div key={i} style={{ marginBottom: '0.5rem' }}>
                          <p style={{ fontWeight: '500' }}>{hl.title}</p>
                          <ul style={{ marginLeft: '1rem' }}>
                            {hl.items.map((item, j) => (
                              <li key={j}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => toggleExpand(idx)}
                  style={{
                    fontSize: '0.85rem',
                    color: '#3b82f6',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  {expanded[idx] ? "Hide Details ▲" : "Show Details ▼"}
                </button>

                <a
                  href={job.share_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.85rem',
                    color: '#fff',
                    background: '#10b981',
                    borderRadius: '0.5rem',
                    padding: '0.4rem 0.9rem',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Apply Now
                </a>

                <button
                  onClick={() => handleLLMMatch(idx, job)}
                  style={{
                    fontSize: '0.85rem',
                    color: '#10b981',
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Generate LLM Match %
                </button>
              </div>

              {matchPercents[idx] && (
                <div style={{
                  background: 'rgb(34, 42, 137)',
                  color: '#fff',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  marginTop: '0.75rem'
                }}>
                  <p><strong>LLM Match %:</strong> {Math.round(
    0.6 * (parseFloat(job.score || 0) * 100) +
    0.4 * parseFloat(matchPercents[idx].score || 0)
  )}%</p>
                  <p><strong>Why:</strong> {matchPercents[idx].explanation}</p>
                </div>
              )}
            </div>

            {/* Right: Match Badge */}
            <div style={{
              minWidth: '90px',
              minHeight: '90px',
              background: 'linear-gradient(to bottom, #1e3a8a, #0f766e)',
              borderRadius: '1rem',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              fontWeight: 'bold',
              fontSize: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                {job.score ? getMatchLabel(job.score) : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchJobsUI;
