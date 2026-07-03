import React from 'react';

export default function Badge({ children, variant = 'primary', className = '' }) {
  const baseStyle = "inline-flex items-center px-2.5 py-0.5 rounded-full text-2xs font-bold select-none tracking-wider uppercase";
  
  const variants = {
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-slate-100 text-slate-600 border border-slate-200/50",
    success: "bg-emerald-50 text-emerald-600 border border-emerald-200/50",
    info: "bg-blue-50 text-blue-600 border border-blue-200/50",
    warning: "bg-amber-50 text-amber-600 border border-amber-200/50",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
