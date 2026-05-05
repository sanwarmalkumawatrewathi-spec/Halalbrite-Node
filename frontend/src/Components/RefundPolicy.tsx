import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, CircleAlert, CircleHelp } from 'lucide-react';

export default function RefundPolicy() {
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
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold">Refund Policy</h1>
            </div>
            <p className="text-red-100 max-w-2xl text-lg">We aim to ensure fairness for both attendees and organizers. Please read our refund terms carefully.</p>
          </div>
          
          <div className="p-8 sm:p-12 space-y-10">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-600" />
                General Policy
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p className="mb-4">HalalBrite operates as a platform connecting event organizers with attendees. As such, refund policies may vary by event and are primarily set by the event organizer. However, we enforce a baseline standard to protect our community.</p>
                <p>Tickets purchased on HalalBrite are generally non-refundable unless the event is cancelled, postponed, or materially altered.</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CircleAlert className="w-5 h-5 text-red-600" />
                Cancellations &amp; Rescheduling
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <ul className="space-y-4 text-gray-700">
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold text-gray-900">Event Cancellation:</span> If an event is cancelled, you are entitled to a full refund of the ticket face value. Service fees may be non-refundable depending on the circumstances.</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
                    <p><span className="font-semibold text-gray-900">Rescheduling:</span> If an event is rescheduled, your ticket will be valid for the new date. If you cannot attend the new date, you may be eligible for a refund if requested within 14 days of the rescheduling notice.</p>
                  </li>
                </ul>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Request Process</h2>
              <div className="space-y-4 text-gray-600">
                <p>To request a refund, please follow these steps:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to "My Tickets" in your account dashboard.</li>
                  <li>Select the order you wish to refund.</li>
                  <li>Click "Request Refund" and select the reason.</li>
                  <li>The organizer will review your request within 5 business days.</li>
                </ol>
                <p className="text-sm text-gray-500 mt-4">Note: If an organizer does not respond within 7 days, you may escalate the issue to HalalBrite support.</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CircleHelp className="w-5 h-5 text-red-600" />
                Questions?
              </h2>
              <p className="text-gray-600 mb-4">If you have specific questions about an event's refund policy, please contact the organizer directly through the event page. For platform-related issues, contact our support team.</p>
              <a href="/contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:ring-ring/50 focus-visible:ring-[3px] h-9 px-4 py-2 bg-red-600 hover:bg-red-700 text-white">
                Contact Support
              </a>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}