import React from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import useApp from '../hooks/useApp';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="absolute top-4 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    error: <AlertCircle className="w-5 h-5 text-primary" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border border-emerald-100 shadow-md shadow-emerald-500/5',
    error: 'bg-red-50 border border-red-100 shadow-md shadow-primary/5',
    warning: 'bg-amber-50 border border-amber-100 shadow-md shadow-amber-500/5',
    info: 'bg-blue-50 border border-blue-100 shadow-md shadow-blue-500/5',
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-3.5 rounded-2xl shadow-lg border text-sm text-text-main pointer-events-auto
        animate-slide-down ${bgColors[toast.type]}
      `}
      role="alert"
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="flex-1 font-semibold text-xs leading-relaxed">{toast.message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-text-muted hover:bg-black/5 active:scale-90 transition-all"
        aria-label="Fechar"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
export { ToastContainer };
