"use client";

import { FaUsers } from "react-icons/fa";
import { MdEvent, MdAttachMoney } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";
import { IoWarningOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";

export default function OverviewTab() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectStripe = async () => {
    if (!window.confirm("Are you sure you want to disconnect your Stripe account? This will stop your ability to receive payouts.")) return;
    
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/payments/connect/disconnect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert("Stripe account disconnected.");
        fetchStats(); // Refresh dashboard
      } else {
        alert(result.message || "Failed to disconnect");
      }
    } catch (error) {
      console.error("Disconnect Stripe error:", error);
      alert("An error occurred.");
    }
  };

  const handleConnectStripe = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/api/payments/connect`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        alert(result.message || "Failed to generate connection URL");
      }
    } catch (error) {
      console.error("Connect Stripe error:", error);
      alert("An error occurred while connecting to Stripe.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading stats...</div>;

  const stats = data?.stats || {
    availableBalance: 0,
    ticketsSold: 0,
    activeEvents: 0,
    totalRevenue: 0
  };

  return (
    <div className="max-w-7xl mx-auto p-0 space-y-6">
      
      {/* Stripe Alert */}
      {data?.stripeConnected ? (
        <div className="flex items-start gap-4 bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
          <div className="text-green-600 text-xl">
            <IoCheckmarkCircleOutline />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900">Stripe Connected</p>
              <span className="text-[10px] font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Your Stripe account is linked. You can now receive payouts from ticket sales.
            </p>
            <button 
              onClick={handleDisconnectStripe}
              className="mt-3 text-red-600 text-xs font-bold hover:underline"
            >
              Disconnect Account
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 bg-yellow-50 border border-yellow-300 rounded-xl p-5 shadow-sm">
          <div className="text-yellow-600 text-xl">
            <IoWarningOutline />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900">Stripe Connect Required</p>
              <span className="text-[10px] font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded uppercase tracking-wider">
                Not Connected
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Connect your Stripe account to receive payouts and view detailed sales analytics.
            </p>
            <button 
              onClick={handleConnectStripe}
              className="mt-3 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition"
            >
              Connect Stripe Account
            </button>
          </div>
        </div>
      )}



      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance */}
        <div className="rounded-xl p-6 text-white bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <p className="text-sm font-medium uppercase tracking-wider">Available Balance</p>
            <FiDollarSign className="text-lg" />
          </div>
          <h2 className="text-3xl font-bold">€{stats.availableBalance.toFixed(2)}</h2>
          <p className="text-xs mt-3 opacity-70">Withdrawals processed via Stripe</p>
        </div>

        {/* Tickets */}
        <div className="rounded-xl p-6 text-white bg-gradient-to-br from-blue-600 to-indigo-800 shadow-lg">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <p className="text-sm font-medium uppercase tracking-wider">Tickets Sold</p>
            <FaUsers className="text-lg" />
          </div>
          <h2 className="text-3xl font-bold">{stats.ticketsSold}</h2>
          <p className="text-xs mt-3 opacity-70">Total tickets across all events</p>
        </div>

        {/* Events */}
        <div className="rounded-xl p-6 text-white bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <p className="text-sm font-medium uppercase tracking-wider">Active Events</p>
            <MdEvent className="text-lg" />
          </div>
          <h2 className="text-3xl font-bold">{stats.activeEvents}</h2>
          <p className="text-xs mt-3 opacity-70">Currently published and live</p>
        </div>

        {/* Revenue */}
        <div className="rounded-xl p-6 text-white bg-gradient-to-br from-rose-600 to-pink-700 shadow-lg">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <p className="text-sm font-medium uppercase tracking-wider">Total Revenue</p>
            <MdAttachMoney className="text-lg" />
          </div>
          <h2 className="text-3xl font-bold">€{stats.totalRevenue.toFixed(2)}</h2>
          <p className="text-xs mt-3 opacity-70">Gross sales before platform fees</p>
        </div>
      </div>

      {/* Charts placeholder - In real world use Recharts/Chart.js */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="font-bold text-gray-800">Revenue Overview</p>
              <p className="text-xs text-gray-500">Sales trends over time</p>
            </div>
            <select className="text-xs font-bold border-none bg-gray-50 rounded-lg px-3 py-1.5 outline-none">
              <option>Last 6 Months</option>
            </select>
          </div>

          <div className="h-56 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <IoWarningOutline className="text-4xl mb-3 text-gray-300" />
            <p className="font-medium text-sm">No sales data yet</p>
            <p className="text-xs mt-1">Start selling tickets to see analytics here</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <p className="font-bold text-gray-800">Event Distribution</p>
            <p className="text-xs text-gray-500">Breakdown by category</p>
          </div>

          <div className="h-56 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <IoWarningOutline className="text-4xl mb-3 text-gray-300" />
            <p className="font-medium text-sm">Not enough data</p>
            <p className="text-xs mt-1">Create more events to see category distribution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
