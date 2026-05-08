import React from 'react';

export default function PeopleInSpace({ astronauts, count }) {
  if (!astronauts || astronauts.length === 0) {
    return null;
  }

  // Group by craft
  const byCraft = astronauts.reduce((acc, a) => {
    if (!acc[a.craft]) acc[a.craft] = [];
    acc[a.craft].push(a.name);
    return acc;
  }, {});

  return (
    <div className="people-space glass-card">
      <div className="people-header">
        <h3>👨‍🚀 People in Space</h3>
        <span className="people-count">{count}</span>
      </div>

      <div className="craft-list">
        {Object.entries(byCraft).map(([craft, names]) => (
          <div key={craft} className="craft-group">
            <div className="craft-name">
              <span className="craft-icon">{craft === 'ISS' ? '🛰️' : '🚀'}</span>
              <span>{craft}</span>
              <span className="craft-badge">{names.length}</span>
            </div>
            <div className="astronaut-names">
              {names.map((name) => (
                <span key={name} className="astronaut-chip">
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .people-space {
          padding: 20px;
          animation: fadeIn 0.5s ease;
        }
        .people-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .people-header h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .people-count {
          background: var(--gradient-primary);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .craft-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .craft-group { }
        .craft-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        .craft-icon { font-size: 1rem; }
        .craft-badge {
          background: rgba(108, 99, 255, 0.15);
          color: var(--accent-primary);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
        }
        .astronaut-names {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .astronaut-chip {
          padding: 4px 10px;
          background: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          color: var(--text-primary);
          transition: all var(--transition-fast);
        }
        .astronaut-chip:hover {
          border-color: var(--accent-primary);
          background: rgba(108, 99, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
