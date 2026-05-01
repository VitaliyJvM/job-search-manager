import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard.ts';
import type { DashboardStats } from '../types/index.ts';
import LoadingSpinner from '../components/LoadingSpinner.tsx';

const STATUS_COLORS: Record<string, string> = {
  INTERESTED: '#60a5fa', APPLIED: '#c084fc', HR_SCREEN: '#fbbf24',
  TECH_INTERVIEW: '#fb923c', OFFER: '#4ade80', REJECTED: '#f87171', FOLLOW_UP_NEEDED: '#2dd4bf',
};

const STATUS_LABELS: Record<string, string> = {
  INTERESTED: 'Interested', APPLIED: 'Applied', HR_SCREEN: 'HR Screen',
  TECH_INTERVIEW: 'Tech Interview', OFFER: 'Offer', REJECTED: 'Rejected', FOLLOW_UP_NEEDED: 'Follow-Up',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardApi.getStats()
      .then(setStats)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <div className="error-banner">⚠️ {error}</div>;
  if (!stats) return null;

  const mainStats = [
    { label: 'Active Applications', value: stats.activeApplications, icon: '📋', color: 'var(--accent)' },
    { label: 'Follow-Ups Due', value: stats.followUpsDue, icon: '⏰', color: 'var(--warning)' },
    { label: 'Total Contacts', value: stats.totalContacts, icon: '👥', color: 'var(--teal)' },
    { label: 'Generated Resumes', value: stats.generatedResumes, icon: '✨', color: 'var(--purple)' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your job search at a glance</p>
        </div>
        <Link to="/resume-tailoring" className="btn btn-primary">
          ✨ Tailor Resume
        </Link>
      </div>

      {/* Main stats */}
      <div className="stat-grid">
        {mainStats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: `rgba(${hexToRgb(s.color)}, 0.15)`, color: s.color }}>
              {s.icon}
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Applications by status */}
      <div className="card">
        <div className="card-header">
          <h2>Applications by Status</h2>
          <Link to="/applications" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
          {Object.entries(stats.applicationsByStatus)
            .filter(([, count]) => count > 0)
            .sort(([, a], [, b]) => b - a)
            .map(([status, count]) => (
              <div key={status} style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${STATUS_COLORS[status] ?? 'var(--border)'}30`,
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: STATUS_COLORS[status] ?? 'var(--text-primary)' }}>
                  {count}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>
                  {STATUS_LABELS[status] ?? status}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link to="/applications" className="btn btn-secondary">📋 New Application</Link>
          <Link to="/companies" className="btn btn-secondary">🏢 Add Company</Link>
          <Link to="/contacts" className="btn btn-secondary">👥 Add Contact</Link>
          <Link to="/conversations" className="btn btn-secondary">💬 Log Conversation</Link>
          <Link to="/prompts" className="btn btn-secondary">📝 Manage Prompts</Link>
        </div>
      </div>
    </>
  );
}

function hexToRgb(color: string): string {
  if (color.startsWith('var(')) return '108, 99, 255';
  const hex = color.replace('#', '');
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }
  return '108, 99, 255';
}
