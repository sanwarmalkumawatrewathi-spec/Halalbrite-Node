import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-[80px] bottom-0 z-[9999] flex items-center justify-center bg-transparent pointer-events-none">
      <div className="flex flex-col items-center justify-center bg-white px-8 py-6 rounded-3xl shadow-xl shadow-red-100/40 border border-red-50/50 max-w-[180px] w-full text-center pointer-events-auto animate-in fade-in zoom-in-95 duration-250">
        <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-red-500 text-sm font-bold tracking-wide animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
