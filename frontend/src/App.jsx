import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ResumeRewrite from './pages/ResumeRewrite';
import ResumeInsights from './pages/ResumeInsights.jsx'
import MatchJobsUI from './pages/MatchJobsUI.jsx'
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume-analysis" element={<ResumeRewrite />} />
        <Route path="/resume-insights" element={<ResumeInsights />} />
        <Route path="/match-jobs" element={<MatchJobsUI />} />
      </Routes>
    </Router>
  );
}