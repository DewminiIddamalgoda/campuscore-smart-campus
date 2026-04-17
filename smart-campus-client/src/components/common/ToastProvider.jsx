import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import './toast.css';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, timeout = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, timeout);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="sc-toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`sc-toast sc-toast-${t.type || 'info'}`}>
            <div className="sc-toast-message">{t.message}</div>
            <button className="sc-toast-close" onClick={() => removeToast(t.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
