

"use client";

import React, { useState } from "react";
import OverviewTab from "../Components/OverviewTab";
import CustomersTab from "../Components/CustomersTab";
import EventsTab from "../Components/EventsTab";
import PayoutsTab from "../Components/PayoutsTab";
import OrganiserTab from "../Components/OrganiserTab";

export default function DashboardTab() {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { name: "Overview", icon: "📈" },
    { name: "Customers", icon: "👥" },
    { name: "Events", icon: "📅" },
    { name: "Payouts", icon: "💲" },
    { name: "Organiser", icon: "🏢" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Organiser Dashboard</h1>
        <p className="text-sm text-gray-500">
          Manage your events, sales, and payouts
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center bg-gray-100 rounded-full p-1 w-fit gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full transition ${
              activeTab === tab.name
                ? "bg-red-500 text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && <OverviewTab />}
      {activeTab === "Customers" && <CustomersTab />}
      {activeTab === "Events" && <EventsTab />}
      {activeTab === "Payouts" && <PayoutsTab />}
      {activeTab === "Organiser" && <OrganiserTab />}
    </div>
  );
}
