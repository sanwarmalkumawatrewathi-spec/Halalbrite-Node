"use client";

import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { TbTicket } from "react-icons/tb";
import MyTickets from "../Components/MyTickets";
import PaymentTab from "../Components/PaymentTab";
import SavedEvents from "../Components/SavedEvents";
import SettingsTab from "../Components/SettingsTab";
import ProfileTab from "../Components/ProfileTab";


const tabs = [
  { id: "profile", label: "Profile", icon: FaUser },
  { id: "tickets", label: "My Tickets", icon: TbTicket },
  { id: "payment", label: "Payment", icon: MdPayment },
  { id: "saved", label: "Saved", icon: FiHeart },
  { id: "settings", label: "Settings", icon: IoSettingsOutline },
];

export default function AccountTabs() {
  
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-7xl mx-auto" suppressHydrationWarning>

      {/* Heading */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">My Account</h1>
        <p className="text-sm text-gray-500">
          Manage your profile, preferences, and tickets
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-gray-100 rounded-full p-1 w-fit gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
                ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              <Icon className="text-sm" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="mt-6">
        {/* {activeTab === "profile" && <ProfileTab />} */}
        {activeTab === "profile" && (
  <ProfileTab setActiveTab={setActiveTab} />
)}


        {activeTab === "tickets" && <MyTickets />}
        {activeTab === "payment" && <PaymentTab />}
        {activeTab === "saved" && <SavedEvents />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}










