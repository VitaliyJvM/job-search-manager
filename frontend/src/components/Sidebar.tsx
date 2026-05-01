import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/companies', label: 'Companies', icon: '🏢' },
  { to: '/applications', label: 'Applications', icon: '📋' },
  { to: '/contacts', label: 'Contacts', icon: '👥' },
  { to: '/conversations', label: 'Conversations', icon: '💬' },
  { to: '/prompts', label: 'Prompt Library', icon: '📝' },
  { to: '/resume-tailoring', label: 'Resume Tailoring', icon: '✨' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          Job Search Manager
          <span>Your AI-powered career hub</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Overview</div>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>

        <div className="nav-section-label">Job Search</div>
        <NavLink
          to="/companies"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">🏢</span>
          Companies
        </NavLink>
        <NavLink
          to="/applications"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">📋</span>
          Applications
        </NavLink>
        <NavLink
          to="/contacts"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">👥</span>
          Contacts
        </NavLink>
        <NavLink
          to="/conversations"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">💬</span>
          Conversations
        </NavLink>

        <div className="nav-section-label">AI Tools</div>
        <NavLink
          to="/prompts"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">📝</span>
          Prompt Library
        </NavLink>
        <NavLink
          to="/resume-tailoring"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
        >
          <span className="nav-icon">✨</span>
          Resume Tailoring
        </NavLink>
      </nav>
    </aside>
  );
}

export { NAV_ITEMS };
