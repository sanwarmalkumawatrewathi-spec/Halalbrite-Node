

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import OverviewTab from "../Components/OverviewTab";
import CustomersTab from "../Components/CustomersTab";
import EventsTab from "../Components/EventsTab";
import PayoutsTab from "../Components/PayoutsTab";
import OrganiserTab from "../Components/OrganiserTab";
import { FiBarChart2, FiUsers, FiCalendar, FiDollarSign, FiHome } from "react-icons/fi";
import { FiTrendingUp } from "react-icons/fi";

export default function DashboardTab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("Overview");
  const [isTabLoading, setIsTabLoading] = useState(false);

  useEffect(() => {
    const paramTab = searchParams.get("tab");
    if (paramTab) {
      setActiveTab(paramTab);
    } else {
      setActiveTab("Overview");
    }
  }, [searchParams]);

  const handleTabChange = (tabName: string) => {
    if (tabName === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(tabName);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    setTimeout(() => {
      setIsTabLoading(false);
    }, 500);
  };

  const tabs = [
    { name: "Overview", icon: FiTrendingUp },
    { name: "Customers", icon: FiUsers },
    { name: "Events", icon: FiCalendar },
    { name: "Payouts", icon: FiDollarSign },
    { name: "Organiser", icon: FiHome },
  ];
  return (
    <div className="max-w-7xl  w-[100%]  mx-auto px-4 sm:px-6 lg:px-8 py-4  sm:py-8 bg-[#fafaf9] mb-20">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-[rgb(0,0,0)] mb-2 font-bold text-[36px] font-normal">Organiser Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your events, sales, and payouts
        </p>
      </div>

      {/* Tabs */}


      <div className="text-muted-foreground h-9 items-center bg-white rounded-xl shadow-sm border-0 p-1 mb-6 sm:mb-8 flex justify-start w-full overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => handleTabChange(tab.name)}
              className={`inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 border border-transparent py-2 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 flex-1 min-w-0 px-2 sm:px-4 rounded-lg ${isActive
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
                : "text-foreground hover:bg-gray-100"
                }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="hidden sm:inline ml-2">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="relative min-h-[400px] w-full pb-Create New Event20">
        {isTabLoading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
              <p className="mt-3 text-red-600 text-sm font-semibold tracking-wide animate-pulse">Loading...</p>
            </div>
          </div>
        )}

        <div className={`w-full ${isTabLoading ? 'opacity-50 pointer-events-none' : ''}`}>
          {activeTab === "Overview" && <OverviewTab onTabChange={handleTabChange} />}
          {activeTab === "Customers" && <CustomersTab />}
          {activeTab === "Events" && <EventsTab />}
          {activeTab === "Payouts" && <PayoutsTab />}
          {activeTab === "Organiser" && <OrganiserTab />}
        </div>
      </div>
    </div>
  );
}
