import React from 'react';

export default function PrivacyPolicy() {
  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-red-100 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0 text-[20px]">
            Your privacy is our priority. Learn how we handle your personal information.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
          <div className="mx-auto max-w-3xl space-y-6">
            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">Halalbrite respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit or use our platform.</p>
                </div>
              </div>
            </div>
            
            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">2. Who We Are</h2>
                  <p className="text-muted-foreground leading-relaxed">Halalbrite is a trading name of ATMS Limited, incorporated in Ireland. In this policy, “Halalbrite”, “we”, “us”, and “our” refer to ATMS Limited acting as the data controller. Event organisers and certain third parties (e.g., Stripe or PayPal) may also process data under their own privacy terms and are independently responsible for that processing.</p>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">3. Information We Collect</h2>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>Identity and contact data (name, email, address, phone number).</li>
                    <li>Event registration details provided during checkout or RSVP.</li>
                    <li>Technical data (e.g., IP address, browser type, device information) collected automatically by hosting, analytics, or payment providers for security and functionality. Halalbrite does not collect this directly.</li>
                    <li>Marketing preferences and consent status.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">4. How We Use Your Data</h2>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>Facilitate ticket purchases and event registrations.</li>
                    <li>Operate, maintain, and improve the platform.</li>
                    <li>Meet legal or regulatory obligations.</li>
                    <li>Provide customer support.</li>
                    <li>Send marketing communications (only with your consent).</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">5. Legal Basis for Processing</h2>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>Contractual necessity (e.g., fulfilling ticket sales).</li>
                    <li>Legitimate interests (security, fraud prevention, product improvement).</li>
                    <li>Consent (marketing communications or optional features).</li>
                    <li>Legal compliance (responding to lawful requests).</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">6. Sharing Your Data</h2>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>Event organisers (to manage registrations and attendees).</li>
                    <li>Payment processors such as Stripe for secure transactions.</li>
                    <li>IT and infrastructure providers (hosting, support tools).</li>
                    <li>Regulators or authorities where required by law.</li>
                  </ul>
                  <p className="text-sm text-muted-foreground italic">Event organisers act as independent data controllers when using attendee data outside Halalbrite’s scope.</p>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">7. Data Retention</h2>
                  <p className="text-muted-foreground leading-relaxed">We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or to satisfy legal, tax, or regulatory requirements.</p>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">8. Your Rights</h2>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>Access the personal data we hold about you.</li>
                    <li>Correct inaccurate or incomplete data.</li>
                    <li>Request deletion of your data.</li>
                    <li>Object to or restrict certain processing.</li>
                    <li>Withdraw consent where processing relies on consent.</li>
                    <li>Request data portability to another service.</li>
                  </ul>
                  <p className="text-sm text-muted-foreground italic">Submit requests by contacting us at contact@halalbrite.com.</p>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">9. Cookies</h2>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>We directly set a single first-party cookie (ht_consent) to remember whether you opted into marketing storage. It expires after 180 days.</li>
                    <li>We also use 13 essential browser-storage keys in localStorage/sessionStorage for secure login, invitation handling, draft recovery, organiser setup, and purchase deduplication. We do not store auth cookies.</li>
                    <li>Meta Pixel: Loaded after you enable marketing storage; we only initialise a pixel and send Meta events on public event and checkout pages where an organiser has configured a Meta Pixel ID. You can change this any time via “Manage cookies” in the site footer (or via cookie controls in embedded event/checkout views). See our Cookie Policy for the full inventory.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">10. Children’s Data</h2>
                  <p className="text-muted-foreground leading-relaxed">Our services are not intended for children under 13, and we do not knowingly collect personal data from children.</p>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">11. Security</h2>
                  <p className="text-muted-foreground leading-relaxed">We implement appropriate technical and organisational safeguards to protect your data. However, no online system is completely secure, and we cannot guarantee absolute protection.</p>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">12. Changes to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">We may update this Privacy Policy periodically. Significant changes will be communicated via the platform or email and noted with a revised effective date.</p>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">13. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">If you have questions about this policy or wish to exercise your data rights, contact us at: contact@halalbrite.com.</p>
                </div>
              </div>
            </div>

            <div style={{ opacity: 1, transform: 'none' }}>
              <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-border/50">
                <div data-slot="card-content" className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold">14. Regional Disclosures</h2>
                  <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                    <li>California Residents: We do not sell your personal data. You may exercise CCPA rights by contacting us, and we will not discriminate for doing so.</li>
                    <li>International Users: Your information may be transferred to and processed in countries with different data protection standards. We use Standard Contractual Clauses and other safeguards to protect your data.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}