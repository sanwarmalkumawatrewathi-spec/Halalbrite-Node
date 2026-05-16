import React from 'react';
import {
  LuFileText
} from 'react-icons/lu';

export default function PrivacyPolicy() {
  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <LuFileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Legal Information</span>
          </div>
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Privacy Policy</h1>
          <p className="text-base sm:text-lg md:text-xl text-red-100 mb-3 sm:mb-4 leading-relaxed px-2 sm:px-0">Your privacy is our priority. Learn how we handle your personal information.</p>
          <p className="text-red-100 text-sm sm:text-base">Last Updated: November 27, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 flex-1">

        {/* Section 1 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Halalbrite respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit or use our platform.</p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">2. Who We Are</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>Halalbrite is a trading name of ATMS Limited, incorporated in Ireland. In this policy, “Halalbrite”, “we”, “us”, and “our” refer to ATMS Limited acting as the data controller. Event organisers and certain third parties (e.g., Stripe or PayPal) may also process data under their own privacy terms and are independently responsible for that processing.</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">3. Information We Collect</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                <li>Identity and contact data (name, email, address, phone number).</li>
                <li>Event registration details provided during checkout or RSVP.</li>
                <li>Technical data (e.g., IP address, browser type, device information) collected automatically by hosting, analytics, or payment providers for security and functionality. Halalbrite does not collect this directly.</li>
                <li>Marketing preferences and consent status.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">4. How We Use Your Data</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                <li>Facilitate ticket purchases and event registrations.</li>
                <li>Operate, maintain, and improve the platform.</li>
                <li>Meet legal or regulatory obligations.</li>
                <li>Provide customer support.</li>
                <li>Send marketing communications (only with your consent).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">5. Legal Basis for Processing</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                <li>Contractual necessity (e.g., fulfilling ticket sales).</li>
                <li>Legitimate interests (security, fraud prevention, product improvement).</li>
                <li>Consent (marketing communications or optional features).</li>
                <li>Legal compliance (responding to lawful requests).</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">6. Sharing Your Data</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                <li>Event organisers (to manage registrations and attendees).</li>
                <li>Payment processors such as Stripe for secure transactions.</li>
                <li>IT and infrastructure providers (hosting, support tools).</li>
                <li>Regulators or authorities where required by law.</li>
              </ul>
              <p className="text-sm italic text-gray-500 mt-4">Event organisers act as independent data controllers when using attendee data outside Halalbrite’s scope.</p>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">7. Data Retention</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or to satisfy legal, tax, or regulatory requirements.</p>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">8. Your Rights</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                <li>Access the personal data we hold about you.</li>
                <li>Correct inaccurate or incomplete data.</li>
                <li>Request deletion of your data.</li>
                <li>Object to or restrict certain processing.</li>
                <li>Withdraw consent where processing relies on consent.</li>
                <li>Request data portability to another service.</li>
              </ul>
              <p className="text-sm italic text-gray-500 mt-4">Submit requests by contacting us at contact@halalbrite.com.</p>
            </div>
          </div>
        </div>

        {/* Section 9 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">9. Cookies</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                <li>We directly set a single first-party cookie (ht_consent) to remember whether you opted into marketing storage. It expires after 180 days.</li>
                <li>We also use 13 essential browser-storage keys in localStorage/sessionStorage for secure login, invitation handling, draft recovery, organiser setup, and purchase deduplication. We do not store auth cookies.</li>
                <li>Meta Pixel: Loaded after you enable marketing storage; we only initialise a pixel and send Meta events on public event and checkout pages where an organiser has configured a Meta Pixel ID. You can change this any time via “Manage cookies” in the site footer (or via cookie controls in embedded event/checkout views). See our Cookie Policy for the full inventory.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 10 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">10. Children’s Data</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>Our services are not intended for children under 13, and we do not knowingly collect personal data from children.</p>
            </div>
          </div>
        </div>

        {/* Section 11 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">11. Security</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>We implement appropriate technical and organisational safeguards to protect your data. However, no online system is completely secure, and we cannot guarantee absolute protection.</p>
            </div>
          </div>
        </div>

        {/* Section 12 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">12. Changes to This Policy</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>We may update this Privacy Policy periodically. Significant changes will be communicated via the platform or email and noted with a revised effective date.</p>
            </div>
          </div>
        </div>

        {/* Section 13 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">13. Regional Disclosures</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                <li>California Residents: We do not sell your personal data. You may exercise CCPA rights by contacting us, and we will not discriminate for doing so.</li>
                <li>International Users: Your information may be transferred to and processed in countries with different data protection standards. We use Standard Contractual Clauses and other safeguards to protect your data.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-red-100 bg-gradient-to-r from-red-50 to-red-100">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">If you have questions about this policy or wish to exercise your data rights, contact us at:</p>
            <p className="text-gray-700 text-sm sm:text-base break-words"><strong>Email:</strong> <a href="mailto:contact@halalbrite.com" className="text-red-600 hover:text-red-700 break-all">contact@halalbrite.com</a></p>
          </div>
        </div>

      </div>
    </main>
  );
}