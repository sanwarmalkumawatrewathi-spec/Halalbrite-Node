"use client";

export default function SavedEvents() {
  const savedEvents: any[] = []; // empty state

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-semibold">Saved Events</h1>
        <p className="text-sm text-gray-500">
          Events you're interested in
        </p>
      </div>

      {/* Content Box */}
      <div className="bg-white border border-gray-200 rounded-xl p-10 flex items-center justify-center min-h-[200px]">
        {savedEvents.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            No saved events yet. Start exploring events and save your favorites!
          </p>
        ) : (
          <div>
            {/* future: map saved events here */}
          </div>
        )}
      </div>
    </div>
  );
}