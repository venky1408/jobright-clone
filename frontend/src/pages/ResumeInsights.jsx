import React, { useState } from 'react';

export default function ResumeInsights() {
  const [resume, setResume] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setMessages(prev => [...prev, { type: 'user', text: question }]);

    const formData = new FormData();
    if (resume) formData.append('resume', resume);
    formData.append('job_description', jobDesc);
    formData.append('question', question);

    try {
      const res = await fetch('http://localhost:8000/ask_resume_question', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setMessages(prev => [...prev, { type: 'ai', text: data.answer }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { type: 'ai', text: 'Something went wrong.' }]);
    } finally {
      setQuestion('');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(to right, #f0f4ff, #fef3ff)',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>

      {/* Upload Header */}
      <div style={{
        padding: '2rem',
        background: '#fff',
        borderRadius: '0 0 1rem 1rem',
        boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        marginBottom: '1rem'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '1rem' }}>
          Upload Resume & Job Description
        </h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setResume(e.target.files[0])}
              style={{
                background: '#f9fafb',
                border: '1px solid #d1d5db',
                padding: '0.5rem',
                borderRadius: '0.5rem'
              }}
            />
            {resume && <div style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>📄 {resume.name}</div>}
          </div>
          <textarea
            placeholder="Paste job description..."
            rows={3}
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            style={{
              flex: 1,
              border: '1px solid #d1d5db',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              background: '#f9fafb',
              color: '#111827',
              width: '100%',
              minWidth: '300px'
            }}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div style={{
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              background: msg.type === 'user' ? '#3b82f6' : '#e5e7eb',
              color: msg.type === 'user' ? '#fff' : '#111827',
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              maxWidth: '75%',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
              whiteSpace: 'pre-wrap'
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div style={{ color: '#6b7280', fontStyle: 'italic' }}>Thinking...</div>}
      </div>

      {/* Input Bar */}
      <div style={{
        padding: '1rem 2rem',
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center'
      }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about your resume or job..."
          onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          Send
        </button>
      </div>

    </div>
  );
}
