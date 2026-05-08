import React from 'react';

export default function CookiePolicy() {
  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Cookie Policy
          </h1>
          <p className="text-red-100 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0 text-[20px]">
            Content coming soon...
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 min-h-[40vh]">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center py-20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Under Construction</h2>
          <p className="text-gray-500">The content for this page will be added soon.</p>
        </div>
      </div>
    </main>
  );
}