"use client";

export default function EventType({ form, setForm }: { form: any, setForm: any }) {
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="  flex items-center justify-center ">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow  space-y-6">

        {/* Event Type */}
        <div className="flex items-center justify-between border border-gray-300 rounded-xl p-4">
          <div>
            <p className="font-medium text-sm">Event Type</p>
            <p className="text-xs text-gray-500">Choose event mode</p>
          </div>

          <div className="flex bg-white rounded-full p-1 text-sm shadow-md">
            <button
              type="button"
              onClick={() =>
                setForm((p: any) => ({ ...p, eventType: "in-person" }))
              }
              className={`px-4 py-1 rounded-full ${
                form.eventType === "in-person"
                  ? "bg-white shadow"
                  : "text-red-700"
              }`}
            >
              In-Person
            </button>

            <button
              type="button"
              onClick={() =>
                setForm((p: any) => ({ ...p, eventType: "online" }))
              }
              className={`px-4 py-1 rounded-full ${
                form.eventType === "online"
                  ? "bg-white shadow"
                  : "text-blue-500"
              }`}
            >
              Online
            </button>
          </div>
        </div>

        {/* ================= IN PERSON ================= */}
        {form.eventType === "in-person" && (
          <div className="bg-gray-50 border border-gray-300 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-red-500">
                Event Location
              </h3>
              <p className="text-sm text-gray-500">
                Where will your event take place?
              </p>
            </div>

            <div>
              <label className="text-sm font-medium">Venue Name</label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                placeholder="e.g., Community Center Hall"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="123 Main Street"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="postcode"
                value={form.postcode}
                onChange={handleChange}
                placeholder="Postcode"
                className="border rounded-lg px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                placeholder="Country"
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {/* ================= ONLINE ================= */}
        {form.eventType === "online" && (
          <div className="bg-gray-50 border border-gray-300 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-red-500">
                Online Event Details
              </h3>
              <p className="text-sm text-gray-500">
                Provide the meeting link or platform details
              </p>
            </div>

            {/* Info Box */}
            <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
              <p className="text-sm font-medium text-blue-700">
                🌐 Online Event
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This event will be hosted online. Provide the meeting link below.
              </p>
            </div>

            {/* Meeting Link */}
            <div>
              <label className="text-sm font-medium">
                Meeting Link / Streaming URL
              </label>
              <input
                type="text"
                name="meetingLink"
                value={form.meetingLink}
                onChange={handleChange}
                placeholder="https://zoom.us/... or youtube live..."
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* Notes */}
            <div className="border border-yellow-300 bg-yellow-50 rounded-xl p-4">
              <p className="text-sm font-medium text-yellow-700 mb-2">
                📝 Important Notes
              </p>
              <ul className="text-xs text-yellow-700 list-disc pl-4 space-y-1">
                <li>Link will be shared after ticket purchase</li>
                <li>Ensure link is active on event date</li>
                <li>Use waiting room for security</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}