import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusSquare, User, Info } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function BottomNavigation() {
  const { user } = useAuth();

  return (
    <nav className="sticky bottom-0 z-40 w-full bg-white/95 backdrop-blur-md border-t border-slate-100/80 h-16 flex items-center shrink-0 pb-safe">
      <div className="w-full h-full px-2 flex justify-around items-center">
        <NavLink
          to="/feed"
          className={({ isActive }) => `
            flex flex-col items-center justify-center gap-1 flex-1 h-full text-2xs font-bold transition-all duration-200 select-none
            ${isActive ? 'text-primary scale-105' : 'text-text-muted hover:text-text-main'}
          `}
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
          <span>Início</span>
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) => `
            flex flex-col items-center justify-center gap-1 flex-1 h-full text-2xs font-bold transition-all duration-200 select-none
            ${isActive ? 'text-primary scale-105' : 'text-text-muted hover:text-text-main'}
          `}
        >
          <div className="bg-primary/5 p-1.5 rounded-xl text-primary hover:bg-primary/10 active:scale-90 transition-transform duration-100">
            <PlusSquare className="w-5 h-5 stroke-[2.2]" />
          </div>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `
            flex flex-col items-center justify-center gap-1 flex-1 h-full text-2xs font-bold transition-all duration-200 select-none
            ${isActive ? 'text-primary scale-105' : 'text-text-muted hover:text-text-main'}
          `}
        >
          <User className="w-5 h-5 stroke-[2.2]" />
          <span>Perfil</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) => `
            flex flex-col items-center justify-center gap-1 flex-1 h-full text-2xs font-bold transition-all duration-200 select-none
            ${isActive ? 'text-primary scale-105' : 'text-text-muted hover:text-text-main'}
          `}
        >
          <Info className="w-5 h-5 stroke-[2.2]" />
          <span>Sobre</span>
        </NavLink>
      </div>
    </nav>
  );
}
