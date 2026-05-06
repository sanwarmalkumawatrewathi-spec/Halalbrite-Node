"use client";

import React from 'react';
import { FiCalendar, FiMapPin, FiTag, FiArrowRight, FiCheck } from 'react-icons/fi';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
  eventData: any;
  tickets: any[];
}

export default function ReviewModal({ isOpen, onClose, onPublish, eventData, tickets }: ReviewModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateStr: string, timeStr: string) => {
    if (!dateStr) return "Not set";
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return `${date.toLocaleDateString('en-GB', options)}, ${timeStr || ''}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-red-900">Review & Publish</h2>
            <p className="text-sm text-gray-500">Review your event details before publishing</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-red-900">{eventData.title || "Untitled Event"}</h3>
            <p className="text-gray-600 font-medium">{eventData.categoryName || "Conference"}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiCalendar className="text-red-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Date & Time</p>
                <p className="text-gray-600">{formatDate(eventData.startDate, eventData.startTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiMapPin className="text-red-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Location</p>
                <p className="text-gray-600">{eventData.venue || eventData.eventType === 'online' ? 'Online Event' : 'TBA'}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiTag className="text-red-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Tickets</p>
                <p className="text-gray-600">{tickets.length} ticket type(s)</p>
                <div className="mt-1 space-y-1">
                  {tickets.map((t, i) => (
                    <p key={i} className="text-xs text-gray-500">
                      {t.name}: €{t.price} ({t.quantity} available)
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl p-6 space-y-3">
            <p className="text-red-900 font-bold">Ready to publish?</p>
            <p className="text-red-700 text-sm leading-relaxed">
              Your event will be visible to the public immediately after publishing. You can edit event details later from your dashboard.
            </p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-600 bg-white hover:bg-gray-100 transition-all"
          >
            Edit Details
          </button>
          <button
            onClick={onPublish}
            className="px-8 py-2.5 rounded-full text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-100"
          >
            <FiCheck />
            Publish Event
          </button>
        </div>
      </div>
    </div>
  );
}
