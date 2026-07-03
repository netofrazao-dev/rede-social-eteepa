import React from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  value,
  onChange,
  icon,
  name,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-text-main/90 uppercase tracking-wider select-none px-1">
          {label}
        </label>
      )}
      
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-4 text-text-muted pointer-events-none select-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full h-12 px-4 rounded-2xl bg-bg-sec border text-sm text-text-main transition-all duration-200
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-primary focus:ring-4 focus:ring-primary/10' : 'border-slate-200 focus:border-primary/80 focus:ring-4 focus:ring-primary/10'}
            focus:outline-none focus:bg-white
          `}
          {...props}
        />
      </div>

      {error ? (
        <span className="text-xs font-medium text-primary px-1 select-none animate-fade-in">
          {error}
        </span>
      ) : helperText ? (
        <span className="text-xs text-text-muted px-1 select-none">
          {helperText}
        </span>
      ) : null}
    </div>
  );
}
