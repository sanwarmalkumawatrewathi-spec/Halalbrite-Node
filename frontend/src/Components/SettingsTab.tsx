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
    onConfirm: () => { },
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
    <div className="space-y-4 sm:space-y-6" suppressHydrationWarning>

      {/* 🔴 Become Organizer Section (Only show for non-organizers) */}
      {!isOrganizer && (
        <div data-slot="card" className="text-gray-900 flex flex-col gap-6 rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-white shadow-sm">
          <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 p-4 sm:p-6">
            <h4 data-slot="card-title" className="text-red-900 text-lg sm:text-xl">Become an Event Organiser</h4>
            <p data-slot="card-description" className="text-gray-500 text-sm">Start hosting and managing your own events on HalalBrite</p>
          </div>
          <div data-slot="card-content" className="[&:last-child]:pb-6 p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-gray-700 text-sm sm:text-base">Upgrade to an organiser account to unlock powerful features:</p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 ml-4">
                <li className="flex items-start"><span className="text-red-600 mr-2">✓</span>Create and manage unlimited events</li>
                <li className="flex items-start"><span className="text-red-600 mr-2">✓</span>Access detailed analytics and insights</li>
                <li className="flex items-start"><span className="text-red-600 mr-2">✓</span>Receive payouts through Stripe Connect</li>
                <li className="flex items-start"><span className="text-red-600 mr-2">✓</span>Build your public organiser profile</li>
                <li className="flex items-start"><span className="text-red-600 mr-2">✓</span>Manage ticket sales and attendees</li>
              </ul>
              <button
                onClick={startUpgrade}
                disabled={isUpgrading}
                data-slot="button"
                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-white h-9 px-4 py-2 mt-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 w-full md:w-auto text-sm sm:text-base ${isUpgrading ? "opacity-50 cursor-not-allowed" : ""}`}
                type="button"
              >
                {isUpgrading ? "Upgrading..." : "Upgrade to Organiser Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📧 Email Preferences */}
      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
        <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 p-4 sm:p-6">
          <h4 data-slot="card-title" className="text-lg sm:text-xl">Email Preferences</h4>
          <p data-slot="card-description" className="text-gray-500 text-sm">Manage your email notifications</p>
        </div>
        <div data-slot="card-content" className="space-y-3 sm:space-y-4 [&:last-child]:pb-6 p-4 sm:p-6">

          <PreferenceItem
            title="Event Updates"
            desc="Receive updates about events you're attending"
            enabled={prefs.eventUpdates}
            onToggle={() => togglePreference("eventUpdates", !prefs.eventUpdates)}
          />

          <div data-orientation="horizontal" role="none" data-slot="separator-root" className="bg-gray-200 h-px w-full"></div>

          <PreferenceItem
            title="Promotions"
            desc="Receive promotional offers and discounts"
            enabled={prefs.promotions}
            onToggle={() => togglePreference("promotions", !prefs.promotions)}
          />

          <div data-orientation="horizontal" role="none" data-slot="separator-root" className="bg-gray-200 h-px w-full"></div>

          <PreferenceItem
            title="Newsletter"
            desc="Weekly newsletter with featured events"
            enabled={prefs.newsletter}
            onToggle={() => togglePreference("newsletter", !prefs.newsletter)}
          />

        </div>
      </div>

      {/* 🔒 Change Password */}
      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border">
        <div data-slot="card-header" className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-3 sm:p-4 pb-0">
          <h4 data-slot="card-title" className="text-lg sm:text-xl flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-5 h-5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Change Password
          </h4>
          <p data-slot="card-description" className="text-gray-500 text-sm">Ensure your account is secure</p>
        </div>
        <div data-slot="card-content" className="p-3 sm:p-4 pt-0">
          <form className="space-y-3 max-w-md">
            <div className="space-y-1">
              <label data-slot="label" className="flex items-center gap-2 font-medium text-sm sm:text-base text-gray-700" htmlFor="current-password">Current Password</label>
              <input type="password" data-slot="input" className="flex h-9 w-full min-w-0 border border-gray-300 px-3 py-1 text-base bg-white transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xl md:text-sm text-gray-900" id="current-password" />
            </div>
            <div className="space-y-1">
              <label data-slot="label" className="flex items-center gap-2 font-medium text-sm sm:text-base text-gray-700" htmlFor="new-password">New Password</label>
              <input type="password" data-slot="input" className="flex h-9 w-full min-w-0 border border-gray-300 px-3 py-1 text-base bg-white transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xl md:text-sm text-gray-900" id="new-password" />
            </div>
            <div className="space-y-1">
              <label data-slot="label" className="flex items-center gap-2 font-medium text-sm sm:text-base text-gray-700" htmlFor="confirm-password">Confirm New Password</label>
              <input type="password" data-slot="input" className="flex h-9 w-full min-w-0 border border-gray-300 px-3 py-1 text-base bg-white transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xl md:text-sm text-gray-900" id="confirm-password" />
            </div>
            <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-white h-9 px-4 py-2 mt-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 w-full sm:w-auto text-sm sm:text-base" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* ⚠️ Danger Zone */}
      <div data-slot="card" className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-red-200 shadow-sm">
        <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 p-4 sm:p-6">
          <h4 data-slot="card-title" className="text-red-700 text-lg sm:text-xl">Danger Zone</h4>
          <p data-slot="card-description" className="text-gray-500 text-sm">Irreversible account actions</p>
        </div>
        <div data-slot="card-content" className="[&:last-child]:pb-6 p-4 sm:p-6">
          <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-white h-9 px-4 py-2 bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm sm:text-base" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 lucide-trash-2 w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
            Delete Account
          </button>
        </div>
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
    <div className="flex items-start sm:items-center justify-between gap-3">
      <div className="space-y-0.5 flex-1 min-w-0">
        <label data-slot="label" className="flex items-center gap-2 font-medium text-sm sm:text-base text-gray-900">{title}</label>
        <p className="text-xs sm:text-sm text-gray-500">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        data-state={enabled ? "checked" : "unchecked"}
        data-slot="switch"
        className={`peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0 ${enabled ? "bg-red-600" : "bg-gray-200"}`}
      >
        <span
          data-state={enabled ? "checked" : "unchecked"}
          data-slot="switch-thumb"
          className={`bg-white pointer-events-none block h-4 w-4 rounded-full shadow-sm ring-0 transition-transform ${enabled ? "translate-x-[calc(100%-2px)]" : "translate-x-0"}`}
        ></span>
      </button>
    </div>
  );
}