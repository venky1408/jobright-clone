import React, { useState } from 'react';

export default function LinkedInGenerator() {
  const [form, setForm] = useState({
    role: '',
    experience: '',
    keywords: '',
    skills: '',
    achievements: '',
    interests: ''
  });
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:8000/generate_linkedin_summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setOutput(data.summary);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '700px', margin: 'auto' }}>
      <h2>LinkedIn Summary Generator</h2>
      {[
        { label: 'Your Role / Profession', name: 'role' },
        { label: 'Years of Experience', name: 'experience' },
        { label: 'Keywords (e.g. LLMs, Web Dev)', name: 'keywords' },
        { label: 'Skills (comma separated)', name: 'skills' },
        { label: 'Achievements', name: 'achievements' },
        { label: 'Personal Interests', name: 'interests' }
      ].map(({ label, name }) => (
        <div key={name} style={{ marginBottom: '1rem' }}>
          <label>{label}</label>
          <input
            name={name}
            value={form[name]}
            onChange={handleChange}
            style={{ width: '100%' }}
          />
        </div>
      ))}
      <button onClick={handleGenerate} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
        {loading ? 'Generating...' : 'Generate Summary'}
      </button>
      {output && (
  <div style={{
    marginTop: '2rem',
    backgroundColor: '#f3f4f6',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    fontSize: '1rem',
    color: '#111827',
    lineHeight: '1.6',
    fontWeight: '500'
  }}>
    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.125rem', color: '#374151' }}>
      Generated Summary:
    </h3>
    <div style={{ whiteSpace: 'pre-wrap' }}>{output}</div>
  </div>
)}
    </div>
  );
}
