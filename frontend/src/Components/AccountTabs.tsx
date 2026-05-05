"use client";

import { useState } from "react";
import MyTickets from "../Components/MyTickets";
import SavedEvents from "../Components/SavedEvents";
import SettingsTab from "../Components/SettingsTab";
import ProfileTab from "../Components/ProfileTab";

const tabs = [
  {
    id: "profile",
    label: "Profile",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-4 h-4 sm:mr-2">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )
  },
  {
    id: "tickets",
    label: "My Tickets",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket w-4 h-4 sm:mr-2">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
        <path d="M13 5v2"></path>
        <path d="M13 17v2"></path>
        <path d="M13 11v2"></path>
      </svg>
    )
  },
  {
    id: "saved",
    label: "Saved",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-4 h-4 sm:mr-2">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
      </svg>
    )
  },
  {
    id: "settings",
    label: "Settings",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings w-4 h-4 sm:mr-2">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    )
  }
];

export default function AccountTabs() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-7xl mx-auto" suppressHydrationWarning>

      {/* Heading */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile, preferences, and tickets
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 sm:mb-8 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div
          role="tablist"
          aria-orientation="horizontal"
          data-slot="tabs-list"
          className="text-gray-500 h-10 items-center rounded-xl p-[3px] justify-between flex bg-white border border-gray-200 w-full sm:w-auto min-w-max justify-start outline-none shadow-sm"
          tabIndex={0}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                data-state={isActive ? "active" : "inactive"}
                data-slot="tabs-trigger"
                onClick={() => setActiveTab(tab.id)}
                className="inline-flex h-[calc(100%-1px)] flex-1 sm:flex-none min-w-[25%] cursor-pointer items-center justify-center gap-1.5 rounded-[9px] border border-transparent px-3 sm:px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-600 hover:text-gray-900 data-[state=active]:hover:text-white"
                tabIndex={isActive ? 0 : -1}
              >
                {tab.svg}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "profile" && <ProfileTab setActiveTab={setActiveTab} />}
        {activeTab === "tickets" && <MyTickets />}
        {activeTab === "saved" && <SavedEvents />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}
