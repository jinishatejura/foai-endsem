import React from 'react';
import SpeedChart from './SpeedChart';
import NewsChart from './NewsChart';
import ISSMap from './ISSMap';

export default function Charts({ speeds, articles, currentPosition, positions, onCategoryClick }) {
  return (
    <div className="charts-section" id="charts-section">
      <div className="charts-head">
        <h2 className="section-title">📊 Data Visualization</h2>
        <p className="section-subtitle">Interactive charts and real-time data</p>
      </div>
      <div className="charts-grid">
        <div className="chart-item"><SpeedChart speeds={speeds} /></div>
        <div className="chart-item"><NewsChart articles={articles} onCategoryClick={onCategoryClick} /></div>
        <div className="chart-item chart-full">
          <div className="glass-card" style={{padding:'20px'}}>
            <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:16,color:'var(--text-primary)'}}>🗺️ ISS Live Map</h3>
            <ISSMap currentPosition={currentPosition} positions={positions} />
          </div>
        </div>
      </div>
      <style>{`
        .charts-section{animation:fadeIn .5s ease}
        .charts-head{margin-bottom:20px}
        .charts-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        .chart-item{min-width:0}
        .chart-full{grid-column:1/-1}
        @media(max-width:768px){.charts-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}
