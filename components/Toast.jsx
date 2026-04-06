'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

/* ─── Toast Context ─────────────────────────────────── */
import { createContext, useContext } from 'react';
const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, opts) => addToast({ message: msg, type: 'success', ...opts }),
    error:   (msg, opts) => addToast({ message: msg, type: 'error',   ...opts }),
    info:    (msg, opts) => addToast({ message: msg, type: 'info',    ...opts }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}

const TOAST_STYLES = {
  success: { border: '#27ae60', icon: CheckCircle,    iconColor: '#27ae60' },
  error:   { border: '#c0392b', icon: AlertTriangle,  iconColor: '#c0392b' },
  info:    { border: '#C8A96E', icon: Info,            iconColor: '#C8A96E' },
};

function ToastItem({ toast, onRemove }) {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;
  const Icon  = style.icon;

  return (
    <motion.div
      layout
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0,   opacity: 1 }}
      exit={{ x: 120, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        width: '300px',
        background: 'rgba(20,20,20,0.95)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: `2px solid ${style.border}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '2px',
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
    >
      <Icon size={14} style={{ color: style.iconColor, flexShrink: 0, marginTop: '1px' }} />
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', color: '#F0EDE8', flex: 1, lineHeight: 1.4 }}>
        {toast.message}
      </p>
      <button onClick={() => onRemove(toast.id)} style={{ color: '#888', flexShrink: 0 }}>
        <X size={12} />
      </button>
    </motion.div>
  );
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '72px',
        right: '20px',
        zIndex: 99998,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <ToastItem toast={t} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
