import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('dashboard_theme');
    return stored || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dashboard_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
