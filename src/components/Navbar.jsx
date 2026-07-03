import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Navbar({ title, showBack = false, rightElement }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100/80 h-14 flex items-center shrink-0">
      <div className="w-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-xl text-text-main hover:bg-slate-100 active:scale-90 transition-all duration-100"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className="font-bold text-base text-text-main tracking-tight select-none">
            {title || "EETEPA Social"}
          </h1>
        </div>

        {rightElement && (
          <div className="flex items-center gap-2">
            {rightElement}
          </div>
        )}
      </div>
    </header>
  );
}
