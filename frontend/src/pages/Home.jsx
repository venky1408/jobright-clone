import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Resume Analyser',
      desc: 'Upload your resume and get job-specific rewriting suggestions.',
      route: '/resume-analysis',
      color: '#3b82f6',
    },
    {
      title: 'Match Jobs',
      desc: 'Find top job matches based on your resume content.',
      route: '/match-jobs',
      color: '#10b981',
    },
    {
      title: 'Ask Questions',
      desc: 'Interact with your resume and job descriptions via AI chat.',
      route: '/resume-insights',
      color: '#8b5cf6',
    },
  ];

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to right, #eef2ff, #fdf4ff)',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '2rem', color: '#1e293b' }}>
      Intelligent Resume Matcher and Job Finder
      </h1>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'center',
        maxWidth: '900px',
        width: '100%',
      }}>
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.route)}
            style={{
              background: '#fff',
              borderRadius: '1rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '2rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              flex: '1 1 260px',
              minWidth: '260px',
              border: `2px solid ${card.color}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
          >
            <h2 style={{ color: card.color, fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              {card.title}
            </h2>
            <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
