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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 transition-all duration-300">
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-gray-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
              <UserPlus className="text-red-600 w-7 h-7" />
            </div>
          </div>

          {/* Text */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Sign In for Faster Checkout
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Signing in makes it easier to find your tickets and provides a quicker checkout experience.
            </p>
          </div>

          {/* Benefits Card */}
          <div className="bg-red-50/40 rounded-2xl p-4 mb-6 border border-red-100/50">
            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2">
              Benefits of signing in:
            </p>
            <ul className="space-y-2">
              {[
                "Access all your tickets in one place",
                "Faster checkout with saved information",
                "Follow and Save events and organisers",
                "Event updates and notifications",
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-gray-600">
                  <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/login-register"
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-[0.98]"
            >
              <UserCircle size={18} />
              Sign In
            </Link>

            <div className="flex items-center gap-3 my-4">
              <div className="h-px bg-gray-100 flex-1" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">or</span>
              <div className="h-px bg-gray-100 flex-1" />
            </div>

            <button
              onClick={onContinueAsGuest}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 py-3 rounded-xl text-sm font-bold hover:border-red-100 hover:text-red-600 transition-all active:scale-[0.98]"
            >
              Continue as Guest
            </button>
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-5">
            Guest checkouts will still receive tickets via email
          </p>
        </div>
      </div>
    </div>
  );
}
