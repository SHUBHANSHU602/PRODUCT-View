import { useState } from 'react';
import { resumeAPI } from '../services/api';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!file || !jobDescription) {
      setError('Please upload a resume and enter job description');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);
      const res = await resumeAPI.upload(formData);
      setAnalysis(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2 style={{ marginBottom: '1.5rem' }}>📄 Resume Analyzer</h2>

      {!analysis ? (
        <div className="card">
          {error && <p className="error">{error}</p>}
          <label style={{ color: '#888', display: 'block', marginBottom: '0.5rem' }}>
            Upload Resume (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={e => setFile(e.target.files[0])}
            style={{ marginBottom: '1rem' }}
          />
          <label style={{ color: '#888', display: 'block', marginBottom: '0.5rem' }}>
            Job Description
          </label>
          <textarea
            rows={5}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>
      ) : (
        <div>
          {/* ATS Score */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', color: analysis.atsScore >= 70 ? '#51cf66' : '#ff6b6b' }}>
              {analysis.atsScore}%
            </h2>
            <p style={{ color: '#888' }}>ATS Score</p>
          </div>

          {/* Missing Keywords */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Missing Keywords</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {analysis.missingKeywords.map((kw, i) => (
                <span key={i} style={{
                  background: '#ff6b6b22',
                  color: '#ff6b6b',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem'
                }}>
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Section Feedback */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Section Feedback</h3>
            {Object.entries(analysis.sectionFeedback).map(([section, feedback]) => (
              <div key={section} style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#6c63ff', fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {section}
                </p>
                <p style={{ color: '#ccc', fontSize: '0.9rem' }}>{feedback}</p>
              </div>
            ))}
          </div>

          {/* Improvements */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Top Improvements</h3>
            {analysis.improvements.map((imp, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ color: '#6c63ff', fontWeight: 'bold' }}>{i + 1}.</span>
                <p style={{ color: '#ccc' }}>{imp}</p>
              </div>
            ))}
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => setAnalysis(null)}
            style={{ width: '100%' }}
          >
            Analyze Another Resume
          </button>
        </div>
      )}
    </div>
  );
}