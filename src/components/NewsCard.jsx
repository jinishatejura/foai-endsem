import React from 'react';

export default function NewsCard({ article }) {
  const {
    title,
    description,
    image_url,
    link,
    source_name,
    source_icon,
    creator,
    pubDate,
    categoryTag,
  } = article;

  const formattedDate = pubDate
    ? new Date(pubDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Unknown date';

  const authorName = creator ? (Array.isArray(creator) ? creator[0] : creator) : 'Unknown';

  return (
    <div className="news-card glass-card" id={`news-card-${title?.slice(0, 20)?.replace(/\s/g, '-')}`}>
      <div className="news-card-image">
        {image_url ? (
          <img
            src={image_url}
            alt={title || 'News image'}
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d4c?w=400&h=250&fit=crop';
            }}
          />
        ) : (
          <div className="news-card-placeholder">
            <span>📰</span>
          </div>
        )}
        {categoryTag && (
          <span className="news-card-category">{categoryTag}</span>
        )}
      </div>

      <div className="news-card-body">
        <h3 className="news-card-title">{title || 'Untitled'}</h3>
        <p className="news-card-desc">{description || 'No description available.'}</p>

        <div className="news-card-meta">
          <div className="news-card-source">
            {source_icon && (
              <img src={source_icon} alt="" className="source-favicon" onError={(e) => e.target.style.display = 'none'} />
            )}
            <span>{source_name || 'Unknown Source'}</span>
          </div>
          <span className="news-card-author">✍️ {authorName}</span>
          <span className="news-card-date">📅 {formattedDate}</span>
        </div>

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary news-read-more"
            id="news-read-more"
          >
            Read More →
          </a>
        )}
      </div>

      <style>{`
        .news-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.5s ease;
        }
        .news-card-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }
        .news-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .news-card:hover .news-card-image img {
          transform: scale(1.05);
        }
        .news-card-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-input);
          font-size: 3rem;
        }
        .news-card-category {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 4px 10px;
          background: var(--gradient-primary);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          border-radius: var(--radius-full);
          letter-spacing: 0.5px;
        }
        .news-card-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 10px;
        }
        .news-card-title {
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.4;
          color: var(--text-primary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .news-card-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        .news-card-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 0.72rem;
          color: var(--text-muted);
        }
        .news-card-source {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          color: var(--accent-primary);
        }
        .source-favicon {
          width: 14px;
          height: 14px;
          border-radius: 2px;
        }
        .news-card-author, .news-card-date {
          white-space: nowrap;
        }
        .news-read-more {
          align-self: flex-start;
          margin-top: 6px;
          font-size: 0.8rem;
          padding: 8px 16px;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
