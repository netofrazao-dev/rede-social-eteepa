import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useApp from '../hooks/useApp';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const { addToast } = useApp();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
      addToast('Acesso negado: Alunos não podem criar publicações.', 'error');
    }
  }, [isAuthenticated, allowedRoles, user, addToast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-100 border-t-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/feed" replace />;
  }

  return children;
}
