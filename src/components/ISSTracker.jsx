import React from 'react';
import ISSMap from './ISSMap';
import PeopleInSpace from './PeopleInSpace';
import { SkeletonStat } from './Skeleton';

export default function ISSTracker({ issData }) {
  const {
    currentPosition,
    positions,
    currentSpeed,
    locationName,
    astronauts,
    astronautCount,
    loading,
    error,
    refresh,
  } = issData;

  const stats = [
    {
      label: 'Latitude',
      value: currentPosition ? `${currentPosition.latitude.toFixed(4)}°` : '—',
      icon: '📍',
      color: 'var(--accent-primary)',
    },
    {
      label: 'Longitude',
      value: currentPosition ? `${currentPosition.longitude.toFixed(4)}°` : '—',
      icon: '🧭',
      color: 'var(--accent-secondary)',
    },
    {
      label: 'Speed',
      value: currentSpeed > 0 ? `${currentSpeed.toFixed(0)} km/h` : 'Calculating...',
      icon: '⚡',
      color: 'var(--accent-warning)',
    },
    {
      label: 'Location',
      value: locationName || 'Locating...',
      icon: '🌍',
      color: 'var(--accent-tertiary)',
    },
    {
      label: 'Positions Tracked',
      value: positions.length.toString(),
      icon: '📊',
      color: 'var(--accent-info)',
    },
  ];

  return (
    <div className="iss-tracker" id="iss-tracker">
      <div className="iss-header">
        <div>
          <h2 className="section-title">🛰️ ISS Live Tracker</h2>
          <p className="section-subtitle">
            Real-time International Space Station tracking • Updates every 15s
          </p>
        </div>
        <button className="btn btn-primary" onClick={refresh} id="iss-refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>❌ {error}</span>
          <button className="btn btn-secondary" onClick={refresh}>Retry</button>
        </div>
      )}

      <div className="iss-stats-grid">
        {loading && !currentPosition
          ? Array(5).fill(0).map((_, i) => <SkeletonStat key={i} />)
          : stats.map((stat) => (
              <div key={stat.label} className="stat-card glass-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value" style={{ color: stat.color }}>{stat.value}</span>
                </div>
              </div>
            ))
        }
      </div>

      <div className="iss-content-grid">
        <div className="iss-map-section">
          <ISSMap currentPosition={currentPosition} positions={positions} />
        </div>
        <div className="iss-sidebar">
          <PeopleInSpace astronauts={astronauts} count={astronautCount} />
        </div>
      </div>

      <style>{`
        .iss-tracker {
          animation: fadeIn 0.5s ease;
        }
        .iss-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .error-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 18px;
          background: rgba(255, 71, 87, 0.1);
          border: 1px solid rgba(255, 71, 87, 0.3);
          border-radius: var(--radius-md);
          margin-bottom: 20px;
          color: var(--accent-danger);
          font-size: 0.875rem;
        }
        .iss-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }
        .stat-card {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stat-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .stat-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          font-weight: 600;
        }
        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .iss-content-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
        }
        .iss-map-section { min-width: 0; }
        .iss-sidebar {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        @media (max-width: 1024px) {
          .iss-content-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .iss-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .stat-card { padding: 12px; }
          .stat-value { font-size: 0.85rem; }
        }
      `}</style>
    </div>
  );
}
