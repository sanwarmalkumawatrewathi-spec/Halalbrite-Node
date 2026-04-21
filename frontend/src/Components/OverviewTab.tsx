"use client";

import { FaUsers } from "react-icons/fa";
import { MdEvent, MdAttachMoney } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";
 import React, { useState } from "react";
export default function OverviewTab() {
 

  const [activeTab, setActiveTab] = useState("Overview");
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      

      {/* Stripe Alert */}
      <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-300 rounded-xl p-5">
        <div className="text-yellow-600 text-xl">
          <IoWarningOutline />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">Stripe Connect Required</p>
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
              Not Connected
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Connect your Stripe account to receive payouts. Don't worry - you can still create events and sell tickets!
          </p>
          <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-md text-sm">
            Connect Stripe Account
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance */}
        <div className="rounded-xl p-5 text-white bg-gradient-to-r from-purple-500 to-indigo-500">
          <div className="flex justify-between items-center">
            <p className="text-sm">Available Balance</p>
            <FiDollarSign />
          </div>
          <h2 className="text-xl font-semibold mt-2">€5,420.00</h2>
          <p className="text-xs mt-1">Connect Stripe to withdraw</p>
        </div>

        {/* Tickets */}
        <div className="rounded-xl p-5 text-white bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="flex justify-between items-center">
            <p className="text-sm">Tickets Sold</p>
            <FaUsers />
          </div>
          <h2 className="text-xl font-semibold mt-2">0</h2>
          <p className="text-xs mt-1">Connect Stripe to see sales</p>
        </div>

        {/* Events */}
        <div className="rounded-xl p-5 text-white bg-gradient-to-r from-orange-500 to-amber-500">
          <div className="flex justify-between items-center">
            <p className="text-sm">Active Events</p>
            <MdEvent />
          </div>
          <h2 className="text-xl font-semibold mt-2">0</h2>
          <p className="text-xs mt-1">Connect Stripe to track events</p>
        </div>

        {/* Revenue */}
        <div className="rounded-xl p-5 text-white bg-gradient-to-r from-red-500 to-pink-500">
          <div className="flex justify-between items-center">
            <p className="text-sm">Total Revenue</p>
            <MdAttachMoney />
          </div>
          <h2 className="text-xl font-semibold mt-2">€0</h2>
          <p className="text-xs mt-1">Connect Stripe to see revenue</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-5 shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-medium">Revenue & Sales Overview</p>
              <p className="text-xs text-gray-500">Last 6 months</p>
            </div>
            <select className="text-sm border rounded-md px-2 py-1">
              <option>6 Months</option>
            </select>
          </div>

          <div className="h-40 flex flex-col items-center justify-center text-gray-400">
            <IoWarningOutline className="text-3xl mb-2" />
            <p>No data available</p>
            <p className="text-xs">Connect Stripe to view revenue analytics</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow">
          <div className="mb-4">
            <p className="font-medium">Event Distribution</p>
            <p className="text-xs text-gray-500">By category</p>
          </div>

          <div className="h-40 flex flex-col items-center justify-center text-gray-400">
            <IoWarningOutline className="text-3xl mb-2" />
            <p>No data available</p>
            <p className="text-xs">Connect Stripe to view event distribution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
