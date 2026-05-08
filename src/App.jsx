import React, { useState } from 'react';
import Header from './components/Header';
import ISSTracker from './components/ISSTracker';
import NewsDashboard from './components/NewsDashboard';
import Charts from './components/Charts';
import Chatbot from './components/Chatbot';
import { ToastProvider } from './components/Toast';
import { useISS } from './hooks/useISS';
import { useNews } from './hooks/useNews';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const issData = useISS();
  const newsData = useNews();
  const [activeTab, setActiveTab] = useState('iss');

  const handleCategoryClick = (category) => {
    setActiveTab('news');
    newsData.filterByCategory(category);
  };

  return (
    <ToastProvider>
      <div className="app">
        <Header
          theme={theme}
          toggleTheme={toggleTheme}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <main className="main-content">
          {activeTab === 'iss' && <ISSTracker issData={issData} />}
          {activeTab === 'news' && <NewsDashboard newsData={newsData} />}
          {activeTab === 'charts' && (
            <Charts
              speeds={issData.speeds}
              articles={newsData.allArticles}
              currentPosition={issData.currentPosition}
              positions={issData.positions}
              onCategoryClick={handleCategoryClick}
            />
          )}
        </main>
        <Chatbot issData={issData} newsArticles={newsData.allArticles} />
      </div>

      <style>{`
        .app {
          min-height: 100vh;
          background: var(--bg-primary);
        }
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }
        @media (max-width: 768px) {
          .main-content { padding: 16px; }
        }
      `}</style>
    </ToastProvider>
  );
}
