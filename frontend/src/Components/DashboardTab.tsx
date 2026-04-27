

"use client";

import React, { useState } from "react";
import OverviewTab from "../Components/OverviewTab";
import CustomersTab from "../Components/CustomersTab";
import EventsTab from "../Components/EventsTab";
import PayoutsTab from "../Components/PayoutsTab";
import OrganiserTab from "../Components/OrganiserTab";
import { FiBarChart2, FiUsers, FiCalendar, FiDollarSign, FiHome } from "react-icons/fi";
import { FiTrendingUp } from "react-icons/fi";

export default function DashboardTab() {
  const [activeTab, setActiveTab] = useState("Overview");

 const tabs = [
  { name: "Overview", icon: FiTrendingUp },
  { name: "Customers", icon: FiUsers },
  { name: "Events", icon: FiCalendar },
  { name: "Payouts", icon: FiDollarSign },
  { name: "Organiser", icon: FiHome },
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
    

      <div className="flex items-center justify-between bg-gray-100 rounded-full p-1 w-full gap-2">
  {tabs.map((tab) => {
    const Icon = tab.icon;

    return (
      <button
        key={tab.name}
        onClick={() => setActiveTab(tab.name)}
        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full transition ${
          activeTab === tab.name
            ? "bg-red-500 text-white"
            : "text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Icon size={18} />
        {tab.name}
      </button>
    );
  })}
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
