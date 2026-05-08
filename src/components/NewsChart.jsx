import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = {
  technology: { bg: 'rgba(108, 99, 255, 0.8)', border: '#6c63ff' },
  science: { bg: 'rgba(0, 212, 170, 0.8)', border: '#00d4aa' },
  general: { bg: 'rgba(255, 107, 157, 0.8)', border: '#ff6b9d' },
  business: { bg: 'rgba(255, 179, 71, 0.8)', border: '#ffb347' },
  health: { bg: 'rgba(69, 183, 209, 0.8)', border: '#45b7d1' },
  sports: { bg: 'rgba(255, 71, 87, 0.8)', border: '#ff4757' },
  entertainment: { bg: 'rgba(162, 155, 254, 0.8)', border: '#a29bfe' },
};

function getColor(cat) {
  return COLORS[cat] || { bg: 'rgba(153, 153, 187, 0.8)', border: '#9999bb' };
}

export default function NewsChart({ articles, onCategoryClick }) {
  const categoryCounts = {};
  articles.forEach(a => {
    const cat = a.categoryTag || 'general';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const labels = Object.keys(categoryCounts);
  const counts = Object.values(categoryCounts);

  if (labels.length === 0) {
    return (
      <div className="chart-empty glass-card" style={{padding:'40px',textAlign:'center'}}>
        <p style={{color:'var(--text-secondary)',fontSize:'0.9rem'}}>📭 No news data to display</p>
      </div>
    );
  }

  const data = {
    labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [{
      data: counts,
      backgroundColor: labels.map(l => getColor(l).bg),
      borderColor: labels.map(l => getColor(l).border),
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#9999bb', font: { family: 'Inter', size: 12 }, padding: 16, usePointStyle: true, pointStyleWidth: 10 },
      },
      tooltip: {
        backgroundColor: 'rgba(22, 22, 58, 0.95)',
        titleColor: '#e8e8f0',
        bodyColor: '#9999bb',
        borderColor: 'rgba(108, 99, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} articles` },
      },
    },
    onClick: (evt, elements) => {
      if (elements.length > 0 && onCategoryClick) {
        const idx = elements[0].index;
        onCategoryClick(labels[idx]);
      }
    },
  };

  return (
    <div className="news-chart glass-card" style={{padding:'20px'}}>
      <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:16,color:'var(--text-primary)'}}>📊 News Distribution</h3>
      <div style={{height:'280px',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Doughnut data={data} options={options} />
      </div>
      <p style={{textAlign:'center',fontSize:'0.72rem',color:'var(--text-muted)',marginTop:8}}>Click a slice to filter articles</p>
    </div>
  );
}
