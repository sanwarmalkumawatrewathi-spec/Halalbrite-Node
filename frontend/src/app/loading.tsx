import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 bg-[blur(4px)] ">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-red-600 font-semibold tracking-wide animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
