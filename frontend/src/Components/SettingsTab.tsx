"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsTab() {
    const router = useRouter()
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [prefs, setPrefs] = useState({
    updates: true,
    promotions: false,
    newsletter: true,
    recommendations: true,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      
      {/* 🔴 Become Organizer */}
      <div className="bg-white border border-red-200 rounded-xl p-6">
        <h2 className="text-red-600 font-semibold">
          Become an Event Organiser
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Start hosting and managing your own events on HalaBrite
        </p>

        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <p>✔ Create and manage unlimited events</p>
          <p>✔ Access detailed analytics and insights</p>
          <p>✔ Receive payouts through Stripe Connect</p>
          <p>✔ Build your public organiser profile</p>
          <p>✔ Manage ticket sales and attendees</p>
        </div>

        <button onClick={() => setShowUpgradeModal(true)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm">
          Upgrade to Organiser Account
        </button>
      </div>

      {/* 📧 Email Preferences */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold">Email Preferences</h2>
        <p className="text-sm text-gray-500">
          Manage your email notifications
        </p>

        <div className="mt-4 divide-y">
          <PreferenceItem
            title="Event Updates"
            desc="Receive updates about events you're attending"
            enabled={prefs.updates}
            onToggle={() => toggle("updates")}
          />

          <PreferenceItem
            title="Promotions"
            desc="Receive promotional offers and discounts"
            enabled={prefs.promotions}
            onToggle={() => toggle("promotions")}
          />

          <PreferenceItem
            title="Newsletter"
            desc="Weekly newsletter with featured events"
            enabled={prefs.newsletter}
            onToggle={() => toggle("newsletter")}
          />

          <PreferenceItem
            title="Recommendations"
            desc="Personalized event recommendations"
            enabled={prefs.recommendations}
            onToggle={() => toggle("recommendations")}
          />
        </div>
      </div>

      {/* 🔒 Change Password */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold">Change Password</h2>
        <p className="text-sm text-gray-500">
          Ensure your account is secure
        </p>

        <div className="mt-4 space-y-4 max-w-md">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />

          <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">
            Update Password
          </button>
        </div>
      </div>

      {/* ⚠️ Danger Zone */}
      <div className="bg-white border border-red-200 rounded-xl p-6">
        <h2 className="text-red-600 font-semibold">Danger Zone</h2>
        <p className="text-sm text-gray-500">
          Irreversible account actions
        </p>

        <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md text-sm">
          Delete Account
        </button>
      </div>




{showUpgradeModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative">
      
      {/* Close */}
      <button
        onClick={() => setShowUpgradeModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      {/* Title */}
      <h2 className="text-lg font-semibold mb-2">
        Upgrade to Organiser Account?
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-500 mb-6">
        Your account will be upgraded to an organiser account. You'll gain access
        to event creation and management features, along with your own organiser
        dashboard. You can continue using all regular user features as well.
      </p>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setShowUpgradeModal(false)}
          className="px-4 py-2 text-sm border rounded-md"
        >
          Cancel
        </button>

        <button
          onClick={()=>router.push("/OrganiserDashboard")}
          className="px-4 py-2 text-sm bg-red-600 text-white rounded-md"
        >
          Upgrade Account
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

/* 🔁 Reusable Toggle Item */
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
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`w-10 h-5 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-red-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}