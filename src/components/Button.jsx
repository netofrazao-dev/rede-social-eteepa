import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'text'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  icon,
  className = '',
  ...props
}) {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 active:scale-95 select-none disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/10 border border-transparent",
    secondary: "bg-bg-sec text-text-main border border-slate-200 hover:bg-slate-100",
    outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary/5",
    text: "bg-transparent text-text-main hover:bg-slate-100",
  };

  const sizes = {
    sm: "px-4 py-2.5 text-xs h-10",
    md: "px-6 py-3 text-sm h-12",
    lg: "px-8 py-3.5 text-base h-14", // premium tall touch-targets
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Carregando...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {icon && <span className="w-5 h-5 flex items-center justify-center">{icon}</span>}
          {children}
        </span>
      )}
    </button>
  );
}
