import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardAPI.get();
        setDashboard(res.data.dashboard);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
      setLoading(false);
    };
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Welcome, {dashboard?.user?.name} 👋</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/resume')}>
            Analyze Resume
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/interview')}>
            Start Interview
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Plan Badge */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <span style={{
          background: dashboard?.user?.plan === 'premium' ? '#6c63ff' : '#333',
          padding: '0.3rem 0.8rem',
          borderRadius: '20px',
          fontSize: '0.85rem'
        }}>
          {dashboard?.user?.plan?.toUpperCase()} PLAN
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: '#6c63ff' }}>{dashboard?.stats?.totalResumeAnalyses}</h3>
          <p style={{ color: '#888' }}>Resume Analyses</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: '#6c63ff' }}>{dashboard?.stats?.avgAtsScore}%</h3>
          <p style={{ color: '#888' }}>Avg ATS Score</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: '#6c63ff' }}>{dashboard?.stats?.totalInterviews}</h3>
          <p style={{ color: '#888' }}>Interviews</p>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Recent Resume Analyses</h3>
        {dashboard?.recentResumeAnalyses?.length === 0
          ? <p style={{ color: '#888' }}>No analyses yet</p>
          : dashboard?.recentResumeAnalyses?.map(r => (
            <div key={r._id} style={{ borderBottom: '1px solid #2a2a2a', padding: '0.75rem 0' }}>
              <span style={{ color: '#6c63ff', fontWeight: 'bold' }}>ATS Score: {r.analysis.atsScore}%</span>
              <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>

      {/* Recent Interviews */}
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Recent Interviews</h3>
        {dashboard?.recentInterviews?.length === 0
          ? <p style={{ color: '#888' }}>No interviews yet</p>
          : dashboard?.recentInterviews?.map(i => (
            <div key={i._id} style={{ borderBottom: '1px solid #2a2a2a', padding: '0.75rem 0' }}>
              <span style={{ fontWeight: 'bold' }}>{i.jobRole}</span>
              <span style={{
                marginLeft: '1rem',
                background: i.status === 'completed' ? '#51cf6622' : '#ff6b6b22',
                color: i.status === 'completed' ? '#51cf66' : '#ff6b6b',
                padding: '0.2rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.8rem'
              }}>
                {i.status}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}