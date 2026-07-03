import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { ToastContainer } from '../components/Toast';
import useAuth from '../hooks/useAuth';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-0 sm:p-4">
      {/* Centered Mobile Viewport Container */}
      <div className="relative w-full sm:max-w-[420px] sm:h-[840px] sm:rounded-[36px] sm:shadow-2xl border-4 sm:border-slate-800 bg-white flex flex-col overflow-hidden animate-fade-in transition-all duration-300">
        
        {/* Mock Status Bar for Desktop Native App feel */}
        <div className="hidden sm:flex justify-between items-center px-6 h-6 bg-slate-900 text-white/90 text-2xs select-none shrink-0 font-semibold tracking-wide">
          <span>17:00</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2.5 border border-white/80 rounded-2xs"></span>
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Global Notification Container */}
        <ToastContainer />

        {/* Scrollable Content Pane */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-bg-sec custom-scrollbar flex flex-col relative">
          <Outlet />
        </div>

        {/* Footer Navigation Tabs */}
        {isAuthenticated && !isLoginPage && <BottomNavigation />}
      </div>
    </div>
  );
}
