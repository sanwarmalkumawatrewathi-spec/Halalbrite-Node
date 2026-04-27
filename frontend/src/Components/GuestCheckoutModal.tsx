"use client";
import React from "react";
import Link from "next/link";
import { UserPlus, UserCircle, X } from "lucide-react";

type GuestCheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onContinueAsGuest: () => void;
};

export default function GuestCheckoutModal({
  isOpen,
  onClose,
  onContinueAsGuest,
}: GuestCheckoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
              <UserPlus className="text-red-600 w-10 h-10" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sign In for Faster Checkout
            </h2>
            <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
              Signing in makes it easier to find your tickets and provides a quicker checkout experience.
            </p>
          </div>

          {/* Benefits Card */}
          <div className="bg-red-50/50 rounded-3xl p-6 mb-10 border border-red-100">
            <p className="text-sm font-bold text-red-600 uppercase tracking-widest mb-4">
              Benefits of signing in:
            </p>
            <ul className="space-y-3">
              {[
                "Access all your tickets in one place",
                "Faster checkout with saved information",
                "Easy ticket transfers and management",
                "Event updates and notifications",
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/authpage"
              className="w-full flex items-center justify-center gap-3 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-[0.98]"
            >
              <UserCircle size={20} />
              Sign In
            </Link>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-gray-100 flex-1" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
              <div className="h-px bg-gray-100 flex-1" />
            </div>

            <button
              onClick={onContinueAsGuest}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border-2 border-gray-100 py-4 rounded-2xl font-bold hover:border-red-100 hover:text-red-600 transition-all active:scale-[0.98]"
            >
              Continue as Guest
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Guest checkouts will still receive tickets via email
          </p>
        </div>
      </div>
    </div>
  );
}
