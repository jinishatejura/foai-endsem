import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            <span className="toast-icon">
              {toast.type === 'success' && '✅'}
              {toast.type === 'error' && '❌'}
              {toast.type === 'info' && 'ℹ️'}
              {toast.type === 'warning' && '⚠️'}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        ))}
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          top: 76px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-width: 360px;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 18px;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(10px);
          cursor: pointer;
          animation: slideInRight 0.3s ease;
          font-size: 0.875rem;
          color: var(--text-primary);
        }
        .toast-success { border-left: 3px solid var(--accent-secondary); }
        .toast-error { border-left: 3px solid var(--accent-danger); }
        .toast-info { border-left: 3px solid var(--accent-info); }
        .toast-warning { border-left: 3px solid var(--accent-warning); }
        .toast-icon { font-size: 1rem; flex-shrink: 0; }
        .toast-message { flex: 1; }
        @media (max-width: 480px) {
          .toast-container { left: 12px; right: 12px; max-width: none; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
