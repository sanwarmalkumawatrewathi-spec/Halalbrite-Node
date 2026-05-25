"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FiEye, FiLayout, FiHome, FiUser } from 'react-icons/fi';
import Footer from '../Footer';

interface PublishSuccessProps {
  eventId: string;
  slug?: string;
  eventName?: string;
  onClose?: () => void;
}

export default function PublishSuccess({ eventId, slug, eventName }: PublishSuccessProps) {
  // Prevent background scrolling to fix double scrollbars
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 z-[120] bg-[#fafafa] overflow-y-auto flex flex-col">
      {/* Centered container with padding */}
      <div className="flex-grow flex items-center justify-center p-4 pt-10 pb-12">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 my-4 border border-gray-100">

          {/* Red Header (Mabrook Banner) */}
          <div className="bg-red-600 p-6 text-center text-white relative">
            <div className="w-32 h-32 flex items-center justify-center mx-auto mb-3">
              <img 
                src="/images/logo.png" 
                alt="Halalbrite Logo" 
                className="w-full h-full object-contain" 
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <h2 className="text-2xl font-black mb-1 tracking-tight">Mabrook!</h2>
            <p className="text-red-100 text-sm font-medium">Your event is now live on Halalbrite</p>
          </div>

          {/* Success Content details */}
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                "{eventName || "Your Event"}" <span className="text-gray-500 font-medium block mt-1">has been successfully published!</span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Attendees can now discover and purchase tickets for your event.
              </p>
            </div>

            {/* Checklist Card */}
            <div className="bg-green-50/40 rounded-2xl p-5 border border-green-100/70 space-y-3">
              <p className="text-green-900 text-sm font-bold flex items-center gap-2">
                <FiCheck className="text-green-600" /> What happens next?
              </p>
              <ul className="space-y-2.5">
                {[
                  "Your event is visible to all users on Halalbrite",
                  "Tickets are available for purchase immediately",
                  "Track sales and analytics in your Organiser Dashboard",
                  "Connect Stripe to receive payouts from ticket sales"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-green-800">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions Section */}
            <div className="space-y-3">
              <Link href={`/event/${slug || eventId}`}>
                <button className="w-full py-3 rounded-xl bg-red-900 text-white text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100 group">
                  <FiEye className="group-hover:scale-110 transition-transform" />
                  View Event Page
                </button>
              </Link>

              <Link href="/organizer-dashboard">
                <button className="w-full py-3 rounded-xl border border-red-200 text-red-900 text-sm font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 group">
                  <FiLayout className="group-hover:rotate-12 transition-transform" />
                  Organiser Dashboard
                </button>
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/">
                  <button className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-1.5">
                    <FiHome /> Home
                  </button>
                </Link>
                <Link href="/myaccount">
                  <button className="w-full py-2.5 rounded-xl bg-gray-50 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-1.5">
                    <FiUser /> My Account
                  </button>
                </Link>
              </div>
            </div>

            {/* Footer help note */}
            <div className="text-center pt-2">
              <p className="text-[10px] text-gray-400">
                Need help managing your event? Visit the <Link href="/organizer-dashboard" className="text-red-600 font-bold underline">Organiser Dashboard</Link> for analytics, attendee management, and more.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function FiCheck({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
