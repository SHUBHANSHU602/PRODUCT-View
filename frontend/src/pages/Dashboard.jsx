import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import s from './Dashboard.module.css';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Helper: score badge color class
  const getScoreClass = (score) => {
    if (score >= 75) return s.scoreHigh;
    if (score >= 50) return s.scoreMid;
    return s.scoreLow;
  };

  // Helper: interview status chip class
  const getStatusClass = (status) => {
    if (status === 'completed') return s.statusCompleted;
    if (status === 'in-progress') return s.statusInProgress;
    return s.statusAbandoned;
  };

  const plan = dashboard?.user?.plan || 'free';
  const isPro = plan === 'premium' || plan === 'pro';

  /* ── Loading Screen ── */
  if (loading) {
    return (
      <div className={s.loadingScreen}>
        <div className={s.spinner} />
      </div>
    );
  }

  /* ── Sidebar nav items ── */
  const navItems = [
    { icon: '📊', label: 'Dashboard',         path: '/dashboard',       active: true },
    { icon: '📄', label: 'Resume Analyzer',    path: '/resume',          active: false },
    { icon: '✨', label: 'Resume Generator',   path: '/resume-generator', active: false },
    { icon: '🎙️', label: 'Mock Interview',     path: '/interview',       active: false },
    { icon: '⚙️', label: 'Settings',           path: '/settings',        active: false },
  ];

  return (
    <div className={s.layout}>
      {/* ── Sidebar Overlay (mobile) ── */}
      <div
        className={`${s.sidebarOverlay} ${sidebarOpen ? s.sidebarOverlayVisible : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ''}`}>
        <button className={s.mobileClose} onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">✕</button>
        <div className={s.sidebarLogo} onClick={() => navigate('/')}>MockMate</div>

        <nav className={s.sidebarNav}>
          {navItems.map(item => (
            <button
              key={item.label}
              className={`${s.sidebarLink} ${item.active ? s.sidebarLinkActive : ''}`}
              onClick={() => { setSidebarOpen(false); navigate(item.path); }}
            >
              <span className={s.sidebarIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className={s.sidebarBottom}>
          <button className={s.sidebarLogout} onClick={handleLogout}>
            <span className={s.sidebarIcon}>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className={s.main}>
        {/* Mobile top bar */}
        <div className={s.mobileTopbar}>
          <button className={s.hamburger} onClick={() => setSidebarOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>
          <div className={s.mobileLogo}>MockMate</div>
        </div>

        {/* ── Top Bar ── */}
        <header className={s.topbar}>
          <div>
            <div className={s.greeting}>Welcome back, {dashboard?.user?.name} 👋</div>
            <div className={s.greetingSub}>Here's what's happening with your prep today.</div>
          </div>
          <div className={s.topbarRight}>
            <span className={`${s.planBadge} ${isPro ? s.planPro : s.planFree}`}>
              {isPro ? 'PRO' : 'FREE'}
            </span>
            {!isPro && (
              <button className={s.btnUpgrade} onClick={() => navigate('/pricing')}>
                Upgrade to Pro
              </button>
            )}
          </div>
        </header>

        {/* ── Content ── */}
        <div className={s.content}>
          {/* Stats Row */}
          <div className={s.statsRow}>
            <div className={s.statCard}>
              <div className={s.statIcon}>📄</div>
              <div className={s.statInfo}>
                <div className={s.statNumber}>{dashboard?.stats?.totalResumeAnalyses ?? 0}</div>
                <div className={s.statLabel}>Total Analyses</div>
              </div>
            </div>

            <div className={s.statCard}>
              <div className={s.statIcon}>🎯</div>
              <div className={s.statInfo}>
                <div className={s.statNumber}>{dashboard?.stats?.avgAtsScore ?? 0}%</div>
                <div className={s.statLabel}>Avg ATS Score</div>
              </div>
            </div>

            <div className={s.statCard}>
              <div className={s.statIcon}>🎙️</div>
              <div className={s.statInfo}>
                <div className={s.statNumber}>{dashboard?.stats?.totalInterviews ?? 0}</div>
                <div className={s.statLabel}>Total Interviews</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className={s.sectionTitle}>Quick Actions</h2>
          <div className={s.quickActions}>
            <div className={s.actionCard} onClick={() => navigate('/resume')}>
              <div className={s.actionIcon}>📄</div>
              <div className={s.actionTitle}>Analyze Resume</div>
              <div className={s.actionDesc}>Upload your resume and get an instant ATS compatibility score with actionable feedback.</div>
              <div className={s.actionArrow}>→</div>
            </div>

            <div className={s.actionCard} onClick={() => navigate('/resume-generator')}>
              <div className={s.actionIcon}>✨</div>
              <div className={s.actionTitle}>Generate Resume</div>
              <div className={s.actionDesc}>Build a professional, ATS-optimized resume from scratch with AI-powered templates.</div>
              <div className={s.actionArrow}>→</div>
            </div>

            <div className={s.actionCard} onClick={() => navigate('/interview')}>
              <div className={s.actionIcon}>🎙️</div>
              <div className={s.actionTitle}>Start Interview</div>
              <div className={s.actionDesc}>Practice realistic mock interviews tailored to your target role and company.</div>
              <div className={s.actionArrow}>→</div>
            </div>
          </div>

          {/* Recent Activity */}
          <h2 className={s.sectionTitle}>Recent Activity</h2>
          <div className={s.activityGrid}>
            {/* Left: Recent Resume Analyses */}
            <div className={s.activityCard}>
              <div className={s.activityHeader}>
                <div className={s.activityTitle}>Resume Analyses</div>
                <span className={s.activityCount}>
                  {dashboard?.recentResumeAnalyses?.length ?? 0} recent
                </span>
              </div>

              {(!dashboard?.recentResumeAnalyses || dashboard.recentResumeAnalyses.length === 0) ? (
                <div className={s.emptyState}>
                  <div className={s.emptyIcon}>📄</div>
                  <div className={s.emptyText}>No resume analyses yet</div>
                  <button className={s.emptyCta} onClick={() => navigate('/resume')}>
                    Analyze Your First Resume
                  </button>
                </div>
              ) : (
                dashboard.recentResumeAnalyses.map(r => (
                  <div key={r._id} className={s.activityItem}>
                    <div className={s.activityItemLeft}>
                      <span className={s.itemLabel}>Resume Analysis</span>
                      <span className={s.itemDate}>
                        {new Date(r.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </div>
                    <span className={`${s.scoreBadge} ${getScoreClass(r.analysis?.atsScore)}`}>
                      {r.analysis?.atsScore}%
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Right: Recent Interviews */}
            <div className={s.activityCard}>
              <div className={s.activityHeader}>
                <div className={s.activityTitle}>Mock Interviews</div>
                <span className={s.activityCount}>
                  {dashboard?.recentInterviews?.length ?? 0} recent
                </span>
              </div>

              {(!dashboard?.recentInterviews || dashboard.recentInterviews.length === 0) ? (
                <div className={s.emptyState}>
                  <div className={s.emptyIcon}>🎙️</div>
                  <div className={s.emptyText}>No interviews yet</div>
                  <button className={s.emptyCta} onClick={() => navigate('/interview')}>
                    Start Your First Interview
                  </button>
                </div>
              ) : (
                dashboard.recentInterviews.map(i => (
                  <div key={i._id} className={s.activityItem}>
                    <div className={s.activityItemLeft}>
                      <span className={s.itemLabel}>{i.jobRole}</span>
                      <span className={s.itemDate}>
                        {i.createdAt ? new Date(i.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        }) : ''}
                      </span>
                    </div>
                    <div className={s.interviewMeta}>
                      {i.score != null && (
                        <span className={`${s.scoreBadge} ${getScoreClass(i.score)}`}>
                          {i.score}%
                        </span>
                      )}
                      <span className={`${s.statusChip} ${getStatusClass(i.status)}`}>
                        {i.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}