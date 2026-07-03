import React from 'react';

export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-slate-100/80 rounded-3xl shadow-sm overflow-hidden
        ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform duration-150' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`p-4 pb-2 flex items-center justify-between ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-4 pt-2 text-sm text-text-main/90 leading-relaxed ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`p-4 pt-2 border-t border-slate-50 flex items-center justify-between ${className}`}>{children}</div>;
}
