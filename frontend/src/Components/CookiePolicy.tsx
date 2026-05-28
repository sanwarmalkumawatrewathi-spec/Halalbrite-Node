import React from 'react';
import {
  LuFileText
} from 'react-icons/lu';

export default function CookiePolicy() {
  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <LuFileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Legal Information</span>
          </div>
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Cookie Policy</h1>
          <p className="text-base sm:text-lg md:text-xl text-red-100 mb-3 sm:mb-4 leading-relaxed px-2 sm:px-0">How we use cookies and browser storage to power Halalbrite</p>
          <p className="text-red-100 text-sm sm:text-base">Last Updated: November 27, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 flex-1">

        {/* Section 1 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">1. Storage categories we use</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>Keeps Halalbrite functioning by remembering your consent choice, keeping you signed in, securing account and invitation flows, and preventing duplicate purchase tracking. This runs on every visit.</p>
              <p>Lets event organisers understand how people find their events using Meta Pixel. After you opt in, Meta tooling may load; we only initialise organiser pixels and send tracking events on public event and checkout pages.</p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">2. Our first-party cookie</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="font-semibold text-gray-900 mb-1">ht_consent</p>
                <p className="text-sm sm:text-base mb-2">Remembers whether you opted into marketing storage so optional scripts stay on/off across visits in this browser. For signed-in users, we also sync consent to your account preferences.</p>
                <p className="text-xs font-medium text-red-600 bg-red-50 inline-block px-2 py-0.5 rounded">Retention: 180 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">3. Essential browser storage (non-cookie)</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <div className="grid gap-4">
                {[
                  { name: "localStorage — token", desc: "Stores your Halalbrite API authentication token so you remain signed in securely across page reloads.", retention: "Cleared when you sign out or manually clear browser storage." },
                  { name: "localStorage — Halalbrite_user", desc: "Stores your logged-in user profile data to personalize your experience and avoid repeated server requests.", retention: "Cleared when you sign out or manually clear browser storage." },
                  { name: "sessionStorage — checkout_draft_{eventId}", desc: "Temporarily stores in-progress public checkout form details per event to support tab refresh recovery.", retention: "Expires after 30 minutes in-tab or when checkout completes." },
                  { name: "localStorage — ht_purchase_tracked:{orderId}", desc: "Stops duplicate tracking events by remembering which orders already fired.", retention: "One flag per order that stays until you clear browser storage." },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg border border-gray-100 p-4 hover:border-red-100 transition-colors">
                    <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                    <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                    <p className="text-xs text-gray-500 italic">{item.retention}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">4. Optional marketing technology</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <div className="rounded-lg border border-gray-100 p-4">
                <p className="font-semibold text-gray-900 mb-1">Meta Pixel</p>
                <p className="text-sm mb-2">Allows organisers to attribute their ad spend by measuring page views, checkout starts, and purchases.</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500"><strong>Provider:</strong> Event organisers via Meta · <strong>Host:</strong> https://connect.facebook.net</p>
                  <p className="text-xs text-gray-500"><strong>Cookies placed:</strong> _fbp, _fbc</p>
                  <p className="text-xs text-gray-500 italic">Loaded after you enable marketing storage; we only initialise a pixel and send Meta events on public event and checkout pages where an organiser has configured a Meta Pixel ID.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">5. Your choices</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>You can change marketing storage at any time using the “Manage cookies” control in our site footer. In embedded event/checkout views, the same controls are available in the cookie banner.</p>
              <p>Choosing “Reject optional” (or turning marketing storage off in settings) keeps Halalbrite running but stops Meta Pixel tracking. Clearing cookies or browser storage in your browser settings will also sign you out and reset cached data described above.</p>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">6. Legal basis</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>For EEA users, optional cookies and similar technologies are managed under the ePrivacy rules and GDPR consent standards. Essential storage is always on because it is necessary to provide requested services and secure key account flows.</p>
              <p>If you are in regions such as California where ad-related identifiers can be treated as data-sharing for advertising, you can keep optional marketing storage disabled at any time through our cookie controls.</p>
            </div>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-red-100 bg-gradient-to-r from-red-50 to-red-100">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl">Updates & Contact</h2>
            <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">We update this policy whenever our storage inventory changes and will note the new effective date.</p>
            <p className="text-gray-700 text-sm sm:text-base break-words"><strong>Email:</strong> <a href="mailto:contact@halalbrite.com" className="text-red-600 hover:text-red-700 break-all">contact@halalbrite.com</a></p>
            <p className="text-gray-700 mt-1.5 sm:mt-2 text-sm sm:text-base"><strong>Support:</strong> <a href="/contact" className="text-red-600 hover:text-red-700 underline">Contact Support</a></p>
          </div>
        </div>

      </div>
    </main>
  );
}