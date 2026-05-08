import React, { useState, useCallback } from 'react';
import NewsCard from './NewsCard';
import { SkeletonCard } from './Skeleton';
import { useToast } from './Toast';

export default function NewsDashboard({ newsData }) {
  const { articles, loading, error, searchQuery, setSearchQuery, searchNews, sortBy, setSortBy, activeCategory, filterByCategory, refreshCategory, categories, retry } = newsData;
  const { addToast } = useToast();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    searchNews(searchInput);
    if (searchInput.trim()) addToast(`Searching for "${searchInput}"...`, 'info');
  }, [searchInput, setSearchQuery, searchNews, addToast]);

  const handleRefresh = useCallback((cat) => {
    refreshCategory(cat);
    addToast(`Refreshing ${cat} news...`, 'info');
  }, [refreshCategory, addToast]);

  return (
    <div className="news-dashboard" id="news-dashboard">
      <div className="nd-head"><div><h2 className="section-title">📰 News Dashboard</h2><p className="section-subtitle">Latest articles from around the world</p></div></div>
      <div className="nd-toolbar">
        <form className="nd-search" onSubmit={handleSearch}>
          <input type="text" id="news-search-input" placeholder="Search articles..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="nd-input" />
          <button type="submit" className="btn btn-primary" id="news-search-btn">🔍</button>
          {searchInput && <button type="button" className="btn btn-secondary" onClick={() => { setSearchInput(''); setSearchQuery(''); searchNews(''); }}>✕</button>}
        </form>
        <div className="nd-sort"><label>Sort:</label><select id="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)} className="nd-sel"><option value="date">Date</option><option value="source">Source</option></select></div>
      </div>
      <div className="nd-cats">{categories.map(cat => (
        <div key={cat} className="nd-cat-wrap">
          <button className={`nd-cat ${activeCategory === cat ? 'nd-cat-active' : ''}`} onClick={() => filterByCategory(cat)} id={`category-${cat}`}>{cat === 'all' ? '🌐 ' : cat === 'technology' ? '💻 ' : '🔬 '}{cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
          {cat !== 'all' && <button className="nd-ref" onClick={() => handleRefresh(cat)} title={`Refresh ${cat}`}>🔄</button>}
        </div>
      ))}</div>
      {error && <div className="nd-err"><span>❌ {error}</span><button className="btn btn-secondary" onClick={retry}>Retry</button></div>}
      <div className="nd-grid">{loading ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />) : articles.length > 0 ? articles.map((a, i) => <NewsCard key={`${a.article_id || a.title}-${i}`} article={a} />) : <div className="nd-empty"><span style={{fontSize:'3rem'}}>📭</span><p>No articles found.</p></div>}</div>
      <style>{`
        .news-dashboard{animation:fadeIn .5s ease}.nd-head{display:flex;justify-content:space-between;margin-bottom:20px}.nd-toolbar{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;align-items:center}.nd-search{display:flex;gap:8px;flex:1;min-width:250px}.nd-input{flex:1;padding:10px 16px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--bg-input);color:var(--text-primary);font-size:.875rem;transition:border-color .15s}.nd-input:focus{border-color:var(--accent-primary);box-shadow:0 0 0 3px rgba(108,99,255,.1)}.nd-input::placeholder{color:var(--text-muted)}.nd-sort{display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--text-secondary)}.nd-sel{padding:10px 14px;border-radius:var(--radius-md);border:1px solid var(--border-color);background:var(--bg-input);color:var(--text-primary);font-size:.85rem}.nd-cats{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}.nd-cat-wrap{display:flex;align-items:center;gap:2px}.nd-cat{padding:8px 16px;border-radius:var(--radius-md);font-size:.82rem;font-weight:600;color:var(--text-secondary);background:var(--bg-input);border:1px solid var(--border-color);transition:all .3s}.nd-cat:hover{color:var(--text-primary);border-color:var(--accent-primary)}.nd-cat-active{background:var(--gradient-primary)!important;color:#fff!important;border-color:transparent!important}.nd-ref{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:var(--bg-input);border:1px solid var(--border-color);border-radius:var(--radius-sm);font-size:.75rem;transition:all .15s}.nd-ref:hover{border-color:var(--accent-primary);transform:rotate(180deg)}.nd-err{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 18px;background:rgba(255,71,87,.1);border:1px solid rgba(255,71,87,.3);border-radius:var(--radius-md);margin-bottom:20px;color:var(--accent-danger);font-size:.875rem}.nd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}.nd-empty{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;padding:60px 20px;color:var(--text-secondary);text-align:center;gap:12px}@media(max-width:640px){.nd-grid{grid-template-columns:1fr}.nd-search{min-width:100%}}
      `}</style>
    </div>
  );
}
