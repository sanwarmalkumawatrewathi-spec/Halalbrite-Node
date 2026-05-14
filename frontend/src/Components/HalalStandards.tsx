import React from 'react';
import { ArrowLeft, Shield, CircleCheckBig, Info, TriangleAlert } from 'lucide-react';

export default function HalalStandards() {
  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <a href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:bg-gray-200 h-9 px-4 py-2 text-gray-600 hover:text-gray-900 -ml-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </a>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-[rgb(251,44,54)] p-8 sm:p-12 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Halal Standards</h1>
            </div>
            <p className="text-emerald-100 max-w-2xl text-lg">Our commitment to ensuring all events on our platform adhere to Islamic principles.</p>
          </div>

          <div className="p-8 sm:p-12 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CircleCheckBig className="w-5 h-5 text-emerald-600" />
                Our Promise
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p className="mb-4">Halalbrite is dedicated to providing a safe, inclusive, and shariah-compliant environment for our community. We vet all organizers and events to ensure they align with our core values.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-600" />
                Event Guidelines
              </h2>
              <div className="bg-[rgb(251,249,249)] rounded-xl p-6 border border-gray-100">
                <ul className="space-y-4 text-gray-700">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold text-gray-900">Food &amp; Beverages:</span> All food and drinks served at events must be strictly Halal. No alcohol or pork products are permitted.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold text-gray-900">Environment:</span> Events should maintain a respectful atmosphere. We encourage segregation or designated areas where appropriate for mixed gatherings, depending on the nature of the event.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold text-gray-900">Entertainment:</span> Entertainment must be permissible and respectful of Islamic values. No inappropriate music or performances.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold text-gray-900">Prayer Facilities:</span> Organizers are encouraged to provide prayer spaces (Salah areas) for attendees during prayer times.</p>
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TriangleAlert className="w-5 h-5 text-emerald-600" />
                Reporting Violations
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>We take our Halal standards seriously. If you attend an event that violates these guidelines, please report it to us immediately.</p>
                <p>To report a violation:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Contact our support team via the "Contact" page.</li>
                  <li>Provide the event name, date, and details of the violation.</li>
                  <li>We will investigate and take appropriate action, which may include removing the organizer from our platform.</li>
                </ol>
              </div>
              <div className="mt-6">
                <a href="/contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 bg-[rgb(251,44,54)] hover:bg-red-700 text-white">
                  Report an Issue
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}