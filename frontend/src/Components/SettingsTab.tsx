"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

export default function SettingsTab() {
  const router = useRouter();
  const { user, isOrganizer, becomeOrganizer } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const [prefs, setPrefs] = useState({
    eventUpdates: user?.preferences?.eventUpdates ?? true,
    promotions: user?.preferences?.promotions ?? false,
    newsletter: user?.preferences?.newsletter ?? true,
  });

  const togglePreference = async (key: string, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);

    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/api/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [key]: value })
      });
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    const res = await becomeOrganizer();
    setIsUpgrading(false);
    if (res.success) {
      setShowUpgradeModal(false);
      alert("Account upgraded to Organiser successfully!");
      router.push("/OrganiserDashboard");
    } else {
      alert(res.message || "Upgrade failed");
    }
  };

  return (
    <div className="p-0 min-h-screen space-y-6">
      
      {/* 🔴 Become Organizer Section (Only show for non-organizers) */}
      {!isOrganizer && (
        <div className="bg-white border border-red-100 rounded-xl p-6 shadow-sm">
          <h2 className="text-red-600 font-bold text-lg">
            Become an Event Organiser
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Start hosting and managing your own events on HalalBrite
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
            <p className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✔</span> 
                Create and manage unlimited events
            </p>
            <p className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✔</span> 
                Access detailed analytics and insights
            </p>
            <p className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✔</span> 
                Receive payouts through Stripe Connect
            </p>
            <p className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✔</span> 
                Build your public organiser profile
            </p>
          </div>

          <button 
            onClick={() => setShowUpgradeModal(true)} 
            className="mt-6 bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition shadow-md"
          >
            Upgrade to Organiser Account
          </button>
        </div>
      )}

      {/* 📧 Email Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-900">Email Preferences</h2>
        <p className="text-sm text-gray-500">
          Manage your email notifications
        </p>

        <div className="mt-4 divide-y divide-gray-50">
          <PreferenceItem
            title="Event Updates"
            desc="Receive updates about events you're attending"
            enabled={prefs.eventUpdates}
            onToggle={() => togglePreference("eventUpdates", !prefs.eventUpdates)}
          />

          <PreferenceItem
            title="Promotions"
            desc="Receive promotional offers and discounts"
            enabled={prefs.promotions}
            onToggle={() => togglePreference("promotions", !prefs.promotions)}
          />

          <PreferenceItem
            title="Newsletter"
            desc="Weekly newsletter with featured events"
            enabled={prefs.newsletter}
            onToggle={() => togglePreference("newsletter", !prefs.newsletter)}
          />
        </div>
      </div>

      {/* 🔒 Change Password */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-bold text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-500">
          Ensure your account is secure
        </p>

        <div className="mt-6 space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Current Password</label>
            <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">New Password</label>
            <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">Confirm New Password</label>
            <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <button className="w-full sm:w-auto bg-red-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition">
            Update Password
          </button>
        </div>
      </div>

      {/* ⚠️ Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-red-700 font-bold">Danger Zone</h2>
        <p className="text-sm text-red-600/70">
          Irreversible account actions
        </p>

        <button className="mt-4 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm font-bold hover:bg-red-600 hover:text-white transition">
          Delete Account
        </button>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Upgrade to Organiser Account?
            </h2>

            <p className="text-gray-500 mb-8">
              Your account will be upgraded to an organiser account. You'll gain access
              to event creation and management features, along with your own organiser
              dashboard. You can continue using all regular user features as well.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                disabled={isUpgrading}
                onClick={() => setShowUpgradeModal(false)}
                className="px-6 py-2.5 text-sm font-bold border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                disabled={isUpgrading}
                onClick={handleUpgrade}
                className="px-8 py-2.5 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center justify-center"
              >
                {isUpgrading ? "Upgrading..." : "Confirm Upgrade"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PreferenceItem({
  title,
  desc,
  enabled,
  onToggle,
}: {
  title: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-5">
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 max-w-[250px]">{desc}</p>
      </div>

      <button
        onClick={onToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
          enabled ? "bg-red-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-lg transform transition duration-300 ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}