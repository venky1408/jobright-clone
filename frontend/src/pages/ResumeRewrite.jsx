import React, { useState } from 'react';

export default function ResumeRewrite() {
  const [resume, setResume] = useState(null);
  const [job, setJob] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    const form = new FormData();
    form.append('resume', resume);
    form.append('job_description', job);

    try {
      const res = await fetch('http://localhost:8000/rewrite_resume', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      setOutput(data.rewritten_resume);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100vw', display: 'flex', minHeight: '100vh', background: 'linear-gradient(to right, #f0f4ff, #f8f0ff)', padding: '2rem', gap: '2rem', flexWrap: 'wrap' }}>

      {/* Left Side: Input Section */}
      <div style={{ flex: '1', minWidth: '300px', background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '1.5rem' }}>Upload & Job Description</h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="resume-upload" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Upload Resume (PDF)</label>
          <input
            id="resume-upload"
            type="file"
            accept="application/pdf"
            onChange={(e) => setResume(e.target.files[0])}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
          />
          {resume && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#4b5563' }}>Selected file: {resume.name}</p>
          )}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="job-description" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>Job Description</label>
          <textarea
            id="job-description"
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder="Paste Job Description here..."
            style={{ width: '100%', height: '10rem', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', color: '#fff', fontWeight: '600', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', opacity: isLoading ? 0.6 : 1 }}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Analyze Resume'}
        </button>
      </div>

      {/* Right Side: Output Section */}
      <div style={{ flex: '1', minWidth: '300px', background: '#fff', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '2rem', overflowY: 'auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '1.5rem' }}>Analysis Result</h2>
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#6b7280' }}>Analyzing your resume...</div>
        ) : output ? (
          <div style={{ whiteSpace: 'pre-wrap', color: '#1f2937', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            {output}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#6b7280' }}>Your rewritten resume and suggestions will appear here.</div>
        )}
      </div>

    </div>
  );
}

