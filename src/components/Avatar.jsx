import React from 'react';

const COLORS = [
  'bg-red-500 text-white',
  'bg-blue-500 text-white',
  'bg-emerald-500 text-white',
  'bg-indigo-500 text-white',
  'bg-pink-500 text-white',
  'bg-amber-500 text-white',
  'bg-teal-500 text-white',
];

const getInitialsColor = (name) => {
  if (!name) return COLORS[0];
  const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
  return COLORS[charCode % COLORS.length];
};

export default function Avatar({ src, name = '', size = 'md', className = '', ringColor }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizes = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base font-semibold',
    lg: 'w-16 h-16 text-lg font-bold',
    xl: 'w-20 h-20 text-2xl font-bold',
  };

  const colorClass = getInitialsColor(name);

  return (
    <div
      className={`
        relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none
        ${sizes[size]}
        ${ringColor ? `ring-2 ring-offset-2 ${ringColor}` : ''}
        ${className}
      `}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Clear src to force initials fallback
            e.target.style.display = 'none';
            e.target.parentNode.querySelector('.avatar-initials').style.display = 'flex';
          }}
        />
      ) : null}
      <div 
        className={`avatar-initials w-full h-full flex items-center justify-center uppercase ${colorClass}`}
        style={{ display: src ? 'none' : 'flex' }}
      >
        {initials}
      </div>
    </div>
  );
}
