import React from 'react';

export default function Skeleton({ type = 'post', count = 1 }) {
  const elements = Array.from({ length: count });

  if (type === 'post') {
    return (
      <div className="flex flex-col gap-4 w-full">
        {elements.map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-100/80 rounded-3xl p-4 flex flex-col gap-4 animate-pulse"
          >
            {/* Header Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200"></div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 w-28 bg-slate-200 rounded-lg"></div>
                <div className="h-3 w-20 bg-slate-100 rounded-lg"></div>
              </div>
            </div>
            
            {/* Body Skeleton */}
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-11/12 bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-2/3 bg-slate-150 rounded-lg"></div>
            </div>

            {/* Footer Skeleton */}
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
              <div className="h-8 w-16 bg-slate-100 rounded-xl"></div>
              <div className="h-8 w-12 bg-slate-100 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-100 rounded-lg animate-pulse h-10"></div>
  );
}
export { Skeleton };
