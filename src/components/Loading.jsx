import React from 'react';

export default function Loading({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/85 backdrop-blur-sm animate-fade-in">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-100 border-t-primary"></div>
          <span className="text-2xs font-bold text-text-muted tracking-wider uppercase">Carregando</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-6 w-full">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-100 border-t-primary"></div>
    </div>
  );
}
