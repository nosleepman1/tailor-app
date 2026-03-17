import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++_id
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')

  return {
    addToast:    ctx.addToast,
    removeToast: ctx.removeToast,
    success: (msg, duration) => ctx.addToast(msg, 'success', duration),
    error:   (msg, duration) => ctx.addToast(msg, 'error',   duration),
    warning: (msg, duration) => ctx.addToast(msg, 'warning', duration),
    info:    (msg, duration) => ctx.addToast(msg, 'info',    duration),
  }
}

// ── Internal UI ────────────────────────────────────────────────────────────────

const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' }

const COLORS = {
  success: { bg: '#22c55e', border: '#16a34a' },
  error:   { bg: '#ef4444', border: '#dc2626' },
  warning: { bg: '#f59e0b', border: '#d97706' },
  info:    { bg: '#3b82f6', border: '#2563eb' },
}

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div style={containerStyle}>
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function Toast({ toast, onDismiss }) {
  const { bg, border } = COLORS[toast.type] ?? COLORS.info
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 16px', borderRadius: '8px',
        background: bg, borderLeft: `4px solid ${border}`,
        color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        minWidth: '240px', maxWidth: '380px',
        fontSize: '14px', fontWeight: 500,
        animation: 'toastIn 0.25s ease',
        cursor: 'pointer', pointerEvents: 'auto',
      }}
      onClick={() => onDismiss(toast.id)}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>{ICONS[toast.type]}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  )
}

const containerStyle = {
  position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
  display: 'flex', flexDirection: 'column', gap: '10px',
  pointerEvents: 'none',
}

if (typeof document !== 'undefined' && !document.getElementById('toast-anim')) {
  const style = document.createElement('style')
  style.id = 'toast-anim'
  style.textContent = `@keyframes toastIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }`
  document.head.appendChild(style)
}
