import React from 'react';
import {
  LuFileText,
  LuShield,
  LuCircleAlert
} from 'react-icons/lu';
import {
  CircleCheckBig,
  DollarSign
} from 'lucide-react';
export default function TermsOfService() {
  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <LuFileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Legal Information</span>
          </div>
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Terms of Service</h1>
          <p className="text-base sm:text-lg md:text-xl text-red-100 mb-3 sm:mb-4 leading-relaxed px-2 sm:px-0">Please read these terms carefully before using Halalbrite</p>
          <p className="text-red-100 text-sm sm:text-base">Last Updated: November 27, 2025</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 flex-1">

        {/* Section Welcome */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-red-900 mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl">Welcome to Halalbrite</h2>
                <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">These Terms of Service (&quot;Terms&quot;) govern your access to and use of Halalbrite&apos;s website, services, and applications (collectively, the &quot;Service&quot;). By accessing or using our Service, you agree to be bound by these Terms.</p>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">If you do not agree to these Terms, please do not use our Service.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">1. Acceptance of Terms</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>By creating an account or using Halalbrite, you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.</p>
              <p>We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such changes constitutes acceptance of the modified Terms.</p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">2. Account Registration and Security</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p><strong className="text-gray-900">Account Creation:</strong> You must provide accurate, current, and complete information during registration and keep your account information updated. You are responsible for maintaining the confidentiality of your account credentials.</p>
              <p><strong className="text-gray-900">Account Security:</strong> You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use of your account or any other security breach.</p>
              <p><strong className="text-gray-900">Account Types:</strong> Halalbrite offers different account types (User, Organiser, Admin). Organiser accounts have additional responsibilities as outlined in these Terms.</p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">3. User Responsibilities</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>You agree to:</p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
                <li>Not use the Service in any way that violates any applicable law or regulation</li>
                <li>Not impersonate any person or entity or misrepresent your affiliation with any person or entity</li>
                <li>Not engage in any conduct that restricts or inhibits anyone&apos;s use of the Service</li>
                <li>Not introduce viruses, trojans, or other malicious code</li>
                <li>Not attempt to gain unauthorized access to any portion of the Service</li>
                <li>Provide accurate information when purchasing tickets or creating events</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">4. Event Organiser Terms</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p><strong className="text-gray-900">Event Creation:</strong> As an Event Organiser, you are solely responsible for your events, including event descriptions, pricing, ticket availability, event execution, and compliance with all applicable laws and regulations.</p>
              <p><strong className="text-gray-900">Halal Compliance:</strong> All events listed on Halalbrite must comply with halal principles and Islamic values. Halalbrite reserves the right to remove any event that does not meet these standards.</p>
              <p><strong className="text-gray-900">Event Cancellation:</strong> You may cancel events according to your stated cancellation policy. You are responsible for notifying attendees and processing refunds as appropriate.</p>
              <p><strong className="text-gray-900">Accuracy of Information:</strong> You must provide accurate and complete information about your events, including dates, times, locations, pricing, and any relevant restrictions or requirements.</p>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">5. Payments and Fees</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p><strong className="text-gray-900">Platform Fees:</strong> Halalbrite charges a platform fee of 3% + €0.30 per paid ticket sold, plus 23% VAT on the platform fee. Free events are not subject to platform fees.</p>
              <p><strong className="text-gray-900">Payment Processing:</strong> All payments are processed securely through Stripe. By using our payment services, you agree to Stripe&apos;s Terms of Service.</p>
              <p><strong className="text-gray-900">Stripe Connect:</strong> Event Organisers must connect a Stripe account to receive payouts. Payments are transferred according to your Stripe payout schedule.</p>
              <p><strong className="text-gray-900">Fee Payment Options:</strong> Organisers can choose to absorb platform fees or pass them to attendees on a per-ticket basis.</p>
              <p><strong className="text-gray-900">Taxes:</strong> You are responsible for determining and paying any applicable taxes related to your use of the Service, including sales tax, VAT, or other taxes.</p>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">6. Refunds and Cancellations</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p><strong className="text-gray-900">Organiser Refund Policy:</strong> Each Event Organiser sets their own refund policy. Attendees should review the refund policy before purchasing tickets.</p>
              <p><strong className="text-gray-900">Processing Refunds:</strong> Organisers are responsible for processing refunds through their organiser dashboard. Platform fees for refunded tickets will be returned to the organiser.</p>
              <p><strong className="text-gray-900">Event Cancellation by Organiser:</strong> If an event is cancelled by the organiser, all ticket holders must be notified promptly and offered full refunds.</p>
              <p><strong className="text-gray-900">Halalbrite&apos;s Role:</strong> Halalbrite is not responsible for issuing refunds on behalf of organisers. All refund requests should be directed to the event organiser.</p>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">7. Intellectual Property Rights</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p><strong className="text-gray-900">Halalbrite Content:</strong> The Service and its original content, features, and functionality are owned by Halalbrite and are protected by international copyright, trademark, and other intellectual property laws.</p>
              <p><strong className="text-gray-900">User Content:</strong> You retain ownership of any content you submit to the Service (event descriptions, images, etc.). By submitting content, you grant Halalbrite a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content in connection with the Service.</p>
              <p><strong className="text-gray-900">Prohibited Uses:</strong> You may not copy, modify, distribute, sell, or lease any part of our Service without express written permission from Halalbrite.</p>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">8. Privacy and Data Protection</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you consent to our collection and use of your information as described in the Privacy Policy.</p>
              <p><strong className="text-gray-900">Data Security:</strong> We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the internet is 100% secure.</p>
              <p><strong className="text-gray-900">Third-Party Services:</strong> We use third-party services (such as Stripe for payments) that may collect information about you. These services have their own privacy policies.</p>
            </div>
          </div>
        </div>

        {/* Section 9 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">9. Limitation of Liability</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p><strong className="text-gray-900">Service &quot;As Is&quot;:</strong> The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied.</p>
              <p><strong className="text-gray-900">No Liability for Events:</strong> Halalbrite is not responsible for the conduct of event organisers or attendees, the quality or safety of events, or any disputes between users.</p>
              <p><strong className="text-gray-900">Limitation of Damages:</strong> To the maximum extent permitted by law, Halalbrite shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.</p>
              <p><strong className="text-gray-900">Maximum Liability:</strong> Our total liability for any claim arising out of or relating to these Terms or the Service shall not exceed the amount you paid to Halalbrite in the twelve months preceding the claim.</p>
            </div>
          </div>
        </div>

        {/* Section 10 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">10. Indemnification</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>You agree to indemnify, defend, and hold harmless Halalbrite, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses, including legal fees, arising out of or in any way connected with:</p>
              <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 sm:space-y-2">
                <li>Your access to or use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your events (if you are an organiser)</li>
                <li>Any content you submit to the Service</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 11 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">11. Termination</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p><strong className="text-gray-900">Termination by You:</strong> You may terminate your account at any time by contacting us. You remain responsible for any outstanding obligations.</p>
              <p><strong className="text-gray-900">Termination by Halalbrite:</strong> We may suspend or terminate your access to the Service at any time, with or without cause, with or without notice, including if we believe you have violated these Terms.</p>
              <p><strong className="text-gray-900">Effect of Termination:</strong> Upon termination, your right to use the Service will immediately cease. Provisions that by their nature should survive termination (including payment obligations, warranty disclaimers, and limitations of liability) will survive.</p>
            </div>
          </div>
        </div>

        {/* Section 12 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">12. Dispute Resolution</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p><strong className="text-gray-900">Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law provisions.</p>
              <p><strong className="text-gray-900">Dispute Resolution:</strong> Any disputes arising out of or relating to these Terms or the Service will first be attempted to be resolved through good faith negotiations between the parties.</p>
              <p><strong className="text-gray-900">Jurisdiction:</strong> If negotiations fail, disputes shall be resolved in the courts of London, United Kingdom, and you consent to the exclusive jurisdiction of such courts.</p>
            </div>
          </div>
        </div>

        {/* Section 13 */}
        <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 mb-6 sm:mb-8">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">13. General Provisions</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
              <p><strong className="text-gray-900">Entire Agreement:</strong> These Terms constitute the entire agreement between you and Halalbrite regarding the Service and supersede all prior agreements.</p>
              <p><strong className="text-gray-900">Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue to be valid and enforceable.</p>
              <p><strong className="text-gray-900">Waiver:</strong> Our failure to enforce any right or provision of these Terms will not constitute a waiver of such right or provision.</p>
              <p><strong className="text-gray-900">Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations without restriction.</p>
              <p><strong className="text-gray-900">Force Majeure:</strong> Halalbrite shall not be liable for any failure to perform due to circumstances beyond our reasonable control.</p>
            </div>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="text-gray-900 flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border border-red-100 bg-gradient-to-r from-red-50 to-red-100">
          <div className="[&_:last-child]:pb-6 p-5 sm:p-6 md:p-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path></svg>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-red-900 mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl">Questions About These Terms?</h2>
                <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">If you have any questions about these Terms of Service, please contact us at:</p>
                <p className="text-gray-700 text-sm sm:text-base break-words"><strong>Email:</strong> <a href="mailto:legal@Halalbrite.com" className="text-red-600 hover:text-red-700 break-all">legal@Halalbrite.com</a></p>
                <p className="text-gray-700 mt-1.5 sm:mt-2 text-sm sm:text-base"><strong>Address:</strong> 123 Event Street, London, UK, SW1A 1AA</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}