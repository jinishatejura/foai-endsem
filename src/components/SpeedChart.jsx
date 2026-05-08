import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function SpeedChart({ speeds }) {
  const chartRef = useRef(null);

  const data = {
    labels: speeds.map(s => s.time),
    datasets: [{
      label: 'ISS Speed (km/h)',
      data: speeds.map(s => s.speed),
      borderColor: '#6c63ff',
      backgroundColor: 'rgba(108, 99, 255, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: '#6c63ff',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 3,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top', labels: { color: '#9999bb', font: { family: 'Inter', size: 12 }, boxWidth: 12, padding: 16 } },
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
        callbacks: { label: (ctx) => `Speed: ${ctx.parsed.y.toFixed(0)} km/h` },
      },
    },
    scales: {
      x: { ticks: { color: '#666688', font: { family: 'Inter', size: 10 }, maxRotation: 45 }, grid: { color: 'rgba(108, 99, 255, 0.06)' } },
      y: { ticks: { color: '#666688', font: { family: 'Inter', size: 10 }, callback: v => `${(v/1000).toFixed(0)}k` }, grid: { color: 'rgba(108, 99, 255, 0.06)' } },
    },
    interaction: { intersect: false, mode: 'index' },
  };

  if (speeds.length === 0) {
    return (
      <div className="chart-empty glass-card" style={{padding:'40px',textAlign:'center'}}>
        <p style={{color:'var(--text-secondary)',fontSize:'0.9rem'}}>⏳ Collecting speed data... (updates every 15s)</p>
      </div>
    );
  }

  return (
    <div className="speed-chart glass-card" style={{padding:'20px'}}>
      <h3 style={{fontSize:'1rem',fontWeight:700,marginBottom:16,color:'var(--text-primary)'}}>⚡ ISS Speed Over Time</h3>
      <div style={{height:'280px'}}>
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}
