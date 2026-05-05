"use client";

export default function EventType({ form, setForm, onlyToggle, onlyLocation }: { form: any, setForm: any, onlyToggle?: boolean, onlyLocation?: boolean }) {
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const renderToggle = () => (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-semibold text-gray-700 text-sm">Event Type</p>
        <p className="text-xs text-gray-400">Choose event mode</p>
      </div>

      <div className="flex items-center gap-4">
        <span className={`text-sm font-medium ${form.eventType === 'in-person' ? 'text-red-600' : 'text-gray-400'}`}>In Person</span>
        <button
          type="button"
          onClick={() => setForm((p: any) => ({ ...p, eventType: p.eventType === 'in-person' ? 'online' : 'in-person' }))}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.eventType === 'online' ? 'bg-red-600' : 'bg-gray-200'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.eventType === 'online' ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
        <span className={`text-sm font-medium ${form.eventType === 'online' ? 'text-red-600' : 'text-gray-400'}`}>Online</span>
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-[#991b1b] mb-1">
          Event Location
        </h3>
        <p className="text-sm text-gray-500">
          Where will your event take place?
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Venue Name</label>
        <input
          type="text"
          name="venue"
          value={form.venue}
          onChange={handleChange}
          placeholder="e.g., Community Center Hall"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Address</label>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="123 Main Street"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="London"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Postcode</label>
          <input
            type="text"
            name="postcode"
            value={form.postcode}
            onChange={handleChange}
            placeholder="SW1A 1AA"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="United Kingdom"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );

  const renderOnline = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-[#991b1b] mb-1">
          Online Event Details
        </h3>
        <p className="text-sm text-gray-500">
          Provide the meeting link or platform details
        </p>
      </div>

      {/* Info Box */}
      <div className="border border-blue-100 bg-blue-50/50 rounded-2xl p-4 flex gap-3">
        <div className="text-blue-500 mt-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        </div>
        <div>
          <p className="text-sm font-bold text-blue-700">Online Event</p>
          <p className="text-xs text-blue-600 mt-0.5">This event will be hosted online. Provide the meeting link below.</p>
        </div>
      </div>

      {/* Meeting Link */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700">Meeting Link / Streaming URL</label>
        <input
          type="text"
          name="meetingLink"
          value={form.meetingLink}
          onChange={handleChange}
          placeholder="https://zoom.us/... or youtube live..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
        />
      </div>

      {/* Notes */}
      <div className="border border-amber-100 bg-amber-50/50 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-bold text-amber-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          Important Notes
        </p>
        <ul className="text-xs text-amber-700 list-disc pl-5 space-y-1">
          <li>Link will be shared after ticket purchase</li>
          <li>Ensure link is active on event date</li>
          <li>Use waiting room for security</li>
        </ul>
      </div>
    </div>
  );

  if (onlyToggle) return renderToggle();
  if (onlyLocation) return form.eventType === "in-person" ? renderLocation() : renderOnline();

  return (
    <div className="space-y-8">
      {renderToggle()}
      {form.eventType === "in-person" ? renderLocation() : renderOnline()}
    </div>
  );
}