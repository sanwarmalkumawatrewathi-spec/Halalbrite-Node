"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import CustomModal from "./CustomModal";

export default function SettingsTab() {
  const router = useRouter();
  const { user, isOrganizer, becomeOrganizer, updateUser } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmText: "Confirm",
    onConfirm: () => {},
    showCancel: true,
    type: "info" as "info" | "success" | "warning" | "error"
  });
  
  const [prefs, setPrefs] = useState({
    eventUpdates: user?.preferences?.eventUpdates ?? true,
    promotions: user?.preferences?.promotions ?? false,
    newsletter: user?.preferences?.newsletter ?? true,
  });

  // Sync preferences when user object updates
  useEffect(() => {
    if (user?.preferences) {
      setPrefs({
        eventUpdates: user.preferences.eventUpdates,
        promotions: user.preferences.promotions,
        newsletter: user.preferences.newsletter,
      });
    }
  }, [user]);

  const togglePreference = async (key: string, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);

    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [key]: value })
      });
      
      if (response.ok) {
          updateUser({ preferences: newPrefs });
      }
    } catch (error) {
      console.error("Failed to update preferences:", error);
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    const res = await becomeOrganizer();
    setIsUpgrading(false);
    if (res.success) {
      setModalConfig({
        title: "Success!",
        message: "Account upgraded to Organiser successfully!",
        confirmText: "Go to Dashboard",
        onConfirm: () => router.push("/organizer-dashboard"),
        showCancel: false,
        type: "success"
      });
    } else {
      setModalConfig({
        title: "Upgrade Failed",
        message: res.message || "Upgrade failed",
        confirmText: "Close",
        onConfirm: () => setShowUpgradeModal(false),
        showCancel: false,
        type: "error"
      });
    }
  };

  const startUpgrade = () => {
    setModalConfig({
      title: "Upgrade to Organiser Account?",
      message: "Your account will be upgraded to an organiser account. You'll gain access to event creation and management features, along with your own organiser dashboard. You can continue using all regular user features as well.",
      confirmText: "Confirm Upgrade",
      onConfirm: handleUpgrade,
      showCancel: true,
      type: "info"
    });
    setShowUpgradeModal(true);
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
            onClick={startUpgrade} 
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
      <CustomModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        showCancel={modalConfig.showCancel}
        type={modalConfig.type}
      />
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