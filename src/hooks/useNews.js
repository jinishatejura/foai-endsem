import { useState, useEffect, useCallback } from 'react';

const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsdata.io/api/1/latest';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

const CATEGORIES = ['technology', 'science'];

function getCacheKey(category, query) {
  return `news_cache_${category}_${query || 'default'}`;
}

function getFromCache(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveToCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

export function useNews() {
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'source'
  const [activeCategory, setActiveCategory] = useState('all');

  const fetchNewsByCategory = useCallback(async (category, forceRefresh = false) => {
    const cacheKey = getCacheKey(category, '');

    if (!forceRefresh) {
      const cached = getFromCache(cacheKey);
      if (cached) return cached;
    }

    try {
      const url = `${BASE_URL}?apikey=${NEWS_API_KEY}&category=${category}&language=en&size=5`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success' && data.results) {
        const articlesWithCategory = data.results.map((a) => ({
          ...a,
          categoryTag: category,
        }));
        saveToCache(cacheKey, articlesWithCategory);
        return articlesWithCategory;
      }

      return [];
    } catch (err) {
      console.error(`Error fetching ${category} news:`, err);
      throw err;
    }
  }, []);

  const fetchAllNews = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled(
        CATEGORIES.map((cat) => fetchNewsByCategory(cat, forceRefresh))
      );

      const allNews = results
        .filter((r) => r.status === 'fulfilled')
        .flatMap((r) => r.value);

      if (allNews.length === 0) {
        // Check if all failed
        const errors = results
          .filter((r) => r.status === 'rejected')
          .map((r) => r.reason.message);
        if (errors.length > 0) {
          throw new Error(errors[0]);
        }
      }

      setAllArticles(allNews);
      setArticles(allNews);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchNewsByCategory]);

  const searchNews = useCallback(async (query) => {
    if (!query.trim()) {
      setArticles(allArticles);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cacheKey = getCacheKey('search', query);
      const cached = getFromCache(cacheKey);

      if (cached) {
        setArticles(cached);
        setLoading(false);
        return;
      }

      const url = `${BASE_URL}?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(query)}&language=en&size=10`;
      const response = await fetch(url);

      if (!response.ok) throw new Error(`Search failed: ${response.status}`);

      const data = await response.json();

      if (data.status === 'success' && data.results) {
        const searchResults = data.results.map((a) => ({
          ...a,
          categoryTag: a.category?.[0] || 'general',
        }));
        saveToCache(cacheKey, searchResults);
        setArticles(searchResults);
      } else {
        setArticles([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [allArticles]);

  const refreshCategory = useCallback(async (category) => {
    if (category === 'all') {
      await fetchAllNews(true);
    } else {
      setLoading(true);
      try {
        const newArticles = await fetchNewsByCategory(category, true);
        setAllArticles((prev) => {
          const filtered = prev.filter((a) => a.categoryTag !== category);
          return [...filtered, ...newArticles];
        });
        setArticles((prev) => {
          const filtered = prev.filter((a) => a.categoryTag !== category);
          return [...filtered, ...newArticles];
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [fetchAllNews, fetchNewsByCategory]);

  const filterByCategory = useCallback((category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setArticles(allArticles);
    } else {
      setArticles(allArticles.filter((a) => a.categoryTag === category));
    }
  }, [allArticles]);

  // Sort articles
  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
    }
    return (a.source_name || '').localeCompare(b.source_name || '');
  });

  useEffect(() => {
    fetchAllNews();
  }, [fetchAllNews]);

  return {
    articles: sortedArticles,
    allArticles,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    searchNews,
    sortBy,
    setSortBy,
    activeCategory,
    filterByCategory,
    refreshCategory,
    categories: ['all', ...CATEGORIES],
    retry: () => fetchAllNews(true),
  };
}
