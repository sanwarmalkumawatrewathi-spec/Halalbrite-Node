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
            How we use cookies and browser storage to power Halalbrite.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
          <div className="mx-auto max-w-3xl space-y-6">
            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">1. Storage categories we use</h2>
                  <div>
                    <div className="space-y-3 text-muted-foreground">
                      <p>Keeps Halalbrite functioning by remembering your consent choice, keeping you signed in, securing account and invitation flows, and preventing duplicate purchase tracking. This runs on every visit.</p>
                      <p>Lets event organisers understand how people find their events using Meta Pixel. After you opt in, Meta tooling may load; we only initialise organiser pixels and send tracking events on public event and checkout pages.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">2. Our first-party cookie</h2>
                  <div>
                    <ul className="space-y-4">
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">ht_consent</p>
                        <p className="text-sm text-muted-foreground">Remembers whether you opted into marketing storage so optional scripts stay on/off across visits in this browser. For signed-in users, we also sync consent to your account preferences.</p>
                        <p className="text-xs text-muted-foreground mt-1">Retention: 180 days</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">3. Essential browser storage (non-cookie)</h2>
                  <div>
                    <ul className="space-y-4">
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">localStorage — sb-{'{'}project-ref{'}'}-auth-token</p>
                        <p className="text-sm text-muted-foreground">Stores your Supabase session payload so social login callbacks and session refresh can complete.</p>
                        <p className="text-xs text-muted-foreground mt-1">Until sign-out, session expiry, or manual browser-storage clearing.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">localStorage — halalbrite-access-token</p>
                        <p className="text-sm text-muted-foreground">Stores your Halalbrite API token so you remain signed in without needing cookies.</p>
                        <p className="text-xs text-muted-foreground mt-1">Cleared when you sign out or manually clear browser storage.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">localStorage — halalbrite-refresh-token</p>
                        <p className="text-sm text-muted-foreground">Renews your sign-in session when access tokens expire, so you stay signed in without interruptions.</p>
                        <p className="text-xs text-muted-foreground mt-1">Cleared when you sign out or manually clear browser storage.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">localStorage — halalbrite:last-organizer-id</p>
                        <p className="text-sm text-muted-foreground">Remembers the organiser workspace you last selected so dashboards open to the right team.</p>
                        <p className="text-xs text-muted-foreground mt-1">Until you switch organisers or clear browser storage.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">localStorage — halalbrite:exchange-rates</p>
                        <p className="text-sm text-muted-foreground">Caches exchange rates for up to 30 minutes to avoid unnecessary API calls.</p>
                        <p className="text-xs text-muted-foreground mt-1">Automatically refreshed every 30 minutes or when you clear browser storage.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">localStorage — auth:last_used</p>
                        <p className="text-sm text-muted-foreground">Remembers the last sign-in method (password or Google) to streamline future sign-in flows.</p>
                        <p className="text-xs text-muted-foreground mt-1">Until replaced with a new value or cleared from browser storage.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">localStorage — halalbrite:pending-invite</p>
                        <p className="text-sm text-muted-foreground">Temporarily stores invitation context so account creation/sign-in can continue into invitation acceptance.</p>
                        <p className="text-xs text-muted-foreground mt-1">Automatically removed after use or expiry (up to 7 days).</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">localStorage — halalbrite:pending-organizer-avatar</p>
                        <p className="text-sm text-muted-foreground">Temporarily stores a draft organizer avatar during registration until upload completes.</p>
                        <p className="text-xs text-muted-foreground mt-1">Removed after upload attempt or manual browser-storage clearing.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">sessionStorage — halalbrite:pending-draft</p>
                        <p className="text-sm text-muted-foreground">Temporarily holds a drafted event while you move between creation screens in the same tab.</p>
                        <p className="text-xs text-muted-foreground mt-1">Removed when you close the tab or finish the draft.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">sessionStorage — halalbrite:event-edit-recovery:{'{'}eventId{'}'}</p>
                        <p className="text-sm text-muted-foreground">Temporarily stores unsaved event edits in the current browser tab so organisers can recover work after refreshes, route reloads, or tab visibility changes.</p>
                        <p className="text-xs text-muted-foreground mt-1">Removed when you close the tab, discard the recovered edits, or save/publish the event.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">sessionStorage — checkout_draft_{'{'}eventId{'}'}</p>
                        <p className="text-sm text-muted-foreground">Temporarily stores in-progress public checkout form details per event to support tab refresh recovery.</p>
                        <p className="text-xs text-muted-foreground mt-1">Expires after 30 minutes in-tab or when checkout completes.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">sessionStorage — ht_embed_consent</p>
                        <p className="text-sm text-muted-foreground">Stores consent preference for embedded checkout/event experiences in the current tab session.</p>
                        <p className="text-xs text-muted-foreground mt-1">Removed when the embed tab is closed.</p>
                      </li>
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">localStorage — ht_purchase_tracked:{'{'}orderId{'}'}</p>
                        <p className="text-sm text-muted-foreground">Stops duplicate Meta Pixel “Purchase” events by remembering which orders already fired.</p>
                        <p className="text-xs text-muted-foreground mt-1">One flag per order that stays until you clear browser storage.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">4. Optional marketing technology</h2>
                  <div>
                    <ul className="space-y-4">
                      <li className="rounded-lg border p-4">
                        <p className="font-medium">Meta Pixel</p>
                        <p className="text-sm text-muted-foreground">Allows organisers to attribute their ad spend by measuring page views, checkout starts, and purchases.</p>
                        <p className="text-xs text-muted-foreground mt-1">Provider: Event organisers via Meta · Host: https://connect.facebook.net</p>
                        <p className="text-xs text-muted-foreground mt-1">Cookies placed: _fbp, _fbc · Loaded after you enable marketing storage; we only initialise a pixel and send Meta events on public event and checkout pages where an organiser has configured a Meta Pixel ID.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">5. Your choices</h2>
                  <div>
                    <div className="space-y-3 text-muted-foreground">
                      <p>You can change marketing storage at any time using the “Manage cookies” control in our site footer. In embedded event/checkout views, the same controls are available in the cookie banner.</p>
                      <p>Choosing “Reject optional” (or turning marketing storage off in settings) keeps Halalbrite running but stops Meta Pixel tracking. Clearing cookies or browser storage in your browser settings will also sign you out and reset cached data described above.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">6. Legal basis</h2>
                  <div>
                    <div className="space-y-3 text-muted-foreground">
                      <p>For EEA users, optional cookies and similar technologies are managed under the ePrivacy rules and GDPR consent standards. Essential storage is always on because it is necessary to provide requested services and secure key account flows.</p>
                      <p>If you are in regions such as California where ad-related identifiers can be treated as data-sharing for advertising, you can keep optional marketing storage disabled at any time through our cookie controls.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">7. Updates &amp; contact</h2>
                  <div>
                    <div className="space-y-3 text-muted-foreground">
                      <p>We update this policy whenever our storage inventory changes and will note the new effective date.</p>
                      <p>Questions? Email us at contact@halalbrite.com or <a className="text-primary underline" href="/contact">contact support</a>.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}