"use client";

import React from 'react';
import { FiLayout, FiCreditCard, FiSettings, FiCheck } from 'react-icons/fi';

interface BecomeOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: () => void;
}

export default function BecomeOrganizerModal({ isOpen, onClose, onConvert }: BecomeOrganizerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-8 pb-4 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#DC2626" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Become an Organiser</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            To publish your event, your account will be converted to an Organiser Account with access to powerful features at no cost.
          </p>
        </div>

        <div className="p-8 space-y-4">
          <div className="bg-red-50/50 rounded-2xl p-4 flex gap-4 items-start">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <FiLayout className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Organiser Dashboard</p>
              <p className="text-xs text-gray-500">Track ticket sales, revenue, and attendee analytics in real-time</p>
            </div>
          </div>

          <div className="bg-red-50/50 rounded-2xl p-4 flex gap-4 items-start">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <FiCreditCard className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Stripe Connect Integration</p>
              <p className="text-xs text-gray-500">Connect your bank account to receive payouts from ticket sales</p>
            </div>
          </div>

          <div className="bg-red-50/50 rounded-2xl p-4 flex gap-4 items-start">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <FiSettings className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Advanced Event Management</p>
              <p className="text-xs text-gray-500">Create organisation profiles, manage multiple events, and more</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex gap-3 items-center">
            <FiCheck className="text-green-600 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-green-900">Completely Free</p>
              <p className="text-green-700">No setup fees, no monthly charges. Only provide payment details to receive payouts.</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 bg-white hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConvert}
            className="flex-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Convert & Publish Event
          </button>
        </div>
      </div>
    </div>
  );
}
