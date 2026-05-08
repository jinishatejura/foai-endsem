import React from 'react';

export default function Header({ theme, toggleTheme, activeTab, setActiveTab }) {
  const tabs = [
    { id: 'iss', label: '🛰️ ISS Tracker', icon: '🛰️' },
    { id: 'news', label: '📰 News', icon: '📰' },
    { id: 'charts', label: '📊 Charts', icon: '📊' },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-logo">
            <span className="logo-icon">🌍</span>
            <div>
              <h1 className="logo-text">ISS Dashboard</h1>
              <span className="logo-tagline">Live Tracking & News</span>
            </div>
          </div>
        </div>

        <nav className="header-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              className={`nav-tab ${activeTab === tab.id ? 'nav-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="header-actions">
          <button
            id="theme-toggle"
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </div>

      <style>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--bg-glass);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-color);
          padding: 0 24px;
        }
        .header-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          gap: 20px;
        }
        .header-brand {
          flex-shrink: 0;
        }
        .header-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          font-size: 1.8rem;
          animation: float 3s ease-in-out infinite;
        }
        .logo-text {
          font-size: 1.15rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }
        .logo-tagline {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .header-nav {
          display: flex;
          gap: 4px;
          background: var(--bg-input);
          padding: 4px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
        }
        .nav-tab {
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: transparent;
          transition: all var(--transition-normal);
          white-space: nowrap;
        }
        .nav-tab:hover {
          color: var(--text-primary);
          background: rgba(108, 99, 255, 0.08);
        }
        .nav-tab-active {
          background: var(--gradient-primary) !important;
          color: white !important;
          box-shadow: 0 2px 10px rgba(108, 99, 255, 0.3);
        }
        .theme-toggle {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-md);
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-normal);
        }
        .theme-toggle:hover {
          border-color: var(--accent-primary);
          transform: rotate(15deg);
        }
        .theme-icon {
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .header { padding: 0 12px; }
          .header-inner { height: 56px; gap: 8px; }
          .nav-tab { padding: 6px 10px; font-size: 0.75rem; }
          .logo-text { font-size: 0.95rem; }
          .logo-tagline { display: none; }
        }
        @media (max-width: 480px) {
          .header-nav { gap: 2px; padding: 3px; }
          .nav-tab { padding: 5px 8px; font-size: 0.7rem; }
        }
      `}</style>
    </header>
  );
}
