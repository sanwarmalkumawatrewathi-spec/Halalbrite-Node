"use client";

import React from 'react';
import Link from 'next/link';
import { FiEye, FiLayout, FiHome, FiUser, FiArrowRight } from 'react-icons/fi';

interface PublishSuccessProps {
  eventId: string;
  slug?: string;
  onClose?: () => void;
}

export default function PublishSuccess({ eventId, slug }: PublishSuccessProps) {
  return (
    <div className="fixed inset-0 z-[120] bg-[#fafafa] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 my-8">
        <div className="bg-red-600 p-12 text-center text-white relative">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15 8H21L16 12L18 18L12 14L6 18L8 12L3 8H9L12 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-4xl font-black mb-2 tracking-tight">Congratulations!</h2>
          <p className="text-red-100 text-lg font-medium">Your event is now live on HalalBrite</p>
        </div>

        <div className="p-10 space-y-10">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-bold text-gray-900 italic">Your Event <span className="text-gray-500 font-medium not-italic">has been successfully published!</span></h3>
            <p className="text-gray-500 leading-relaxed">
              Attendees can now discover and purchase tickets for your event.
            </p>
          </div>

          <div className="bg-green-50/50 rounded-3xl p-8 border border-green-100 space-y-4">
            <p className="text-green-900 font-bold flex items-center gap-2">
              <FiCheck className="text-green-600" /> What happens next?
            </p>
            <ul className="space-y-4">
              {[
                "Your event is visible to all users on HalalBrite",
                "Tickets are available for purchase immediately",
                "Track sales and analytics in your Organiser Dashboard",
                "Connect Stripe to receive payouts from ticket sales"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-green-800">
                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <Link href={`/event/${slug || eventId}`}>
              <button className="w-full py-4 rounded-2xl bg-red-900 text-white font-bold hover:bg-black transition-all flex items-center justify-center gap-3 text-lg shadow-xl shadow-red-100 group">
                <FiEye className="group-hover:scale-110 transition-transform" />
                View Event Page
              </button>
            </Link>

            <Link href="/organizer-dashboard">
              <button className="w-full py-4 rounded-2xl border-2 border-red-100 text-red-900 font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-3 text-lg group">
                <FiLayout className="group-hover:rotate-12 transition-transform" />
                Organiser Dashboard
              </button>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/">
                <button className="w-full py-3 rounded-2xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm">
                  <FiHome /> Home
                </button>
              </Link>
              <Link href="/myaccount">
                <button className="w-full py-3 rounded-2xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 text-sm">
                  <FiUser /> My Account
                </button>
              </Link>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-gray-400">
              Need help managing your event? Visit the <Link href="/organizer-dashboard" className="text-red-600 font-bold underline">Organiser Dashboard</Link> for analytics, attendee management, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FiCheck({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}
