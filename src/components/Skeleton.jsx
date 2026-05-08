import React from 'react';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image" />
      <div className="skeleton-body">
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text short" />
        <div className="skeleton-row">
          <div className="skeleton skeleton-badge" />
          <div className="skeleton skeleton-badge" />
        </div>
      </div>

      <style>{`
        .skeleton-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .skeleton-image {
          width: 100%;
          height: 180px;
        }
        .skeleton-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .skeleton-title {
          height: 20px;
          width: 80%;
        }
        .skeleton-text {
          height: 14px;
          width: 100%;
        }
        .skeleton-text.short {
          width: 60%;
        }
        .skeleton-row {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .skeleton-badge {
          height: 24px;
          width: 60px;
          border-radius: var(--radius-full);
        }
      `}</style>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="skeleton-stat-card glass-card" style={{ padding: '16px' }}>
      <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 28, width: '70%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 12, width: '40%' }} />
    </div>
  );
}
