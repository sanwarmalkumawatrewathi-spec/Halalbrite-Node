"use client";

import { FaUsers } from "react-icons/fa";
import { MdEvent, MdAttachMoney } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";
import { IoWarningOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";

interface OverviewTabProps {
  onTabChange?: (tab: string) => void;
}

export default function OverviewTab({ onTabChange }: OverviewTabProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const { refreshUser } = useAuth();

  useEffect(() => {
    fetchStats();
    refreshUser(); // Refresh global auth state to sync Stripe status
  }, []);

  const fetchStats = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("API Error Response:", text);
        return;
      }

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

  const handleManageStripe = async () => {
    try {
      let API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      if (!API_URL || API_URL === 'undefined') {
        API_URL = 'http://localhost:5000';
      }
      API_URL = API_URL.replace(/\/$/, '');

      const token = localStorage.getItem('token');
      const fullUrl = `${API_URL}/api/payments/stripe-login`;
      console.log("[DEBUG] HandleManageStripe - Target URL:", fullUrl);
      console.log("[DEBUG] Current process.env.NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

      const response = await fetch(fullUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Manage Stripe API Error:", text);
        alert("Failed to get login link. Check console for details.");
        return;
      }

      const result = await response.json();

      if (result.url) {
        window.open(result.url, '_blank');
      } else {
        alert(result.message || "Failed to generate login link");
      }
    } catch (error) {
      console.error("Manage Stripe error:", error);
      alert("An error occurred while opening Stripe dashboard.");
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
    <div className="max-w-full mx-auto p-0 space-y-6">
      {/* Stripe Alert */}
      {!data?.stripeConnected && (
        <div data-slot="card" className="text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-2 border-amber-200 bg-amber-50">
          <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert w-6 h-6 text-amber-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-amber-900 break-words font-semibold text-lg">Stripe Connect Required</h3>
                  <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 [&amp;>svg]:size-3 gap-1 [&amp;>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent text-primary-foreground [a&amp;]:hover:bg-primary/90 bg-amber-500 w-fit text-white">Not Connected</span>
                </div>
                <p className="text-amber-800 mb-3 text-sm sm:text-base">Connect your Stripe account to receive payouts. Don't worry - you can still create events and sell tickets!</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleConnectStripe} data-slot="button" className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 w-full sm:w-auto text-white">Connect Stripe Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {data?.stripeConnected && (
        <div data-slot="card" className="text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-2 border-green-200 bg-green-50">
          <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-6 h-6 text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-green-900 break-words font-semibold text-lg">Stripe Connected</h3>
                  <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 [&amp;>svg]:size-3 gap-1 [&amp;>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent text-primary-foreground [a&amp;]:hover:bg-primary/90 bg-green-500 w-fit text-white">Active</span>
                </div>
                <p className="text-green-800 mb-3 text-sm sm:text-base">Your Stripe account is linked. You can now receive payouts from ticket sales.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleManageStripe} data-slot="button" className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 w-full sm:w-auto text-white">Manage Stripe Account</button>
                  <button onClick={handleDisconnectStripe} data-slot="button" className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-green-600 bg-transparent hover:bg-green-100 text-green-700 h-9 px-4 py-2 has-[>svg]:px-3 w-full sm:w-auto">Disconnect Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 overflow-hidden">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 font-medium">Available Balance</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-5 h-5"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <p className="text-white mb-1 text-3xl font-bold">€{stats.availableBalance.toFixed(2)}</p>
            <div className="flex items-center gap-1 text-purple-100 text-sm">
              <span>{data?.stripeConnected ? 'Withdrawals processed via Stripe' : 'Connect Stripe to withdraw'}</span>
            </div>
          </div>
        </div>

        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 overflow-hidden">
          <div onClick={() => onTabChange && onTabChange('Customers')} className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 font-medium">Tickets Sold</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <p className="text-white mb-1 text-3xl font-bold">{stats.ticketsSold}</p>
            <div className="flex items-center gap-1 text-blue-100 text-sm">
              <span>{data?.stripeConnected ? 'Total tickets across all events' : 'Connect Stripe to see sales analytics'}</span>
            </div>
          </div>
        </div>

        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 overflow-hidden">
          <div onClick={() => onTabChange && onTabChange('Events')} className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white cursor-pointer hover:from-amber-600 hover:to-amber-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-100 font-medium">Active Events</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-range w-5 h-5"><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M16 2v4"></path><path d="M3 10h18"></path><path d="M8 2v4"></path><path d="M17 14h-6"></path><path d="M13 18H7"></path><path d="M7 14h.01"></path><path d="M17 18h.01"></path></svg>
            </div>
            <p className="text-white mb-1 text-3xl font-bold">{stats.activeEvents}</p>
            <div className="flex items-center gap-1 text-amber-100 text-sm">
              <span>Currently published and live</span>
            </div>
          </div>
        </div>

        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 overflow-hidden">
          <div onClick={() => onTabChange && onTabChange('Payouts')} className="bg-gradient-to-br from-red-500 to-red-600 p-6 text-white cursor-pointer hover:from-red-600 hover:to-red-700 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100 font-medium">Total Revenue</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-5 h-5"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <p className="text-white mb-1 text-3xl font-bold">€{stats.totalRevenue.toFixed(2)}</p>
            <div className="flex items-center gap-1 text-red-100 text-sm">
              <span>{data?.stripeConnected ? 'Gross sales before platform fees' : 'Connect Stripe to see revenue'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 lg:col-span-2 rounded-2xl shadow-lg border-0 bg-white">
          <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 data-slot="card-title" className="leading-none text-red-900 font-semibold text-lg">Revenue &amp; Sales Overview</h4>
                <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">Last 6 months</p>
              </div>
              <button type="button" role="combobox" className="data-[placeholder]:text-muted-foreground [&amp;_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&amp;_svg]:pointer-events-none [&amp;_svg]:shrink-0 [&amp;_svg:not([class*='size-'])]:size-4 w-[150px] border-red-200 focus:ring-red-500 bg-white">
                <span data-slot="select-value" style={{ pointerEvents: 'none' }}>6 Months</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down size-4 opacity-50"><path d="m6 9 6 6 6-6"></path></svg>
              </button>
            </div>
          </div>
          <div data-slot="card-content" className="px-6 [&amp;:last-child]:pb-6">
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert w-12 h-12 text-gray-400 mx-auto mb-3"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                <p className="text-gray-600 mb-2 font-medium">No data available</p>
                <p className="text-sm text-gray-500">{data?.stripeConnected ? 'Start selling tickets to see analytics here' : 'Connect Stripe to view revenue analytics'}</p>
              </div>
            </div>
          </div>
        </div>

        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white">
          <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
            <h4 data-slot="card-title" className="leading-none text-red-900 font-semibold text-lg">Event Distribution</h4>
            <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">By category</p>
          </div>
          <div data-slot="card-content" className="px-6 [&amp;:last-child]:pb-6">
            <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert w-12 h-12 text-gray-400 mx-auto mb-3"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                <p className="text-gray-600 mb-2 font-medium">No data available</p>
                <p className="text-sm text-gray-500">{data?.stripeConnected ? 'Create more events to see category distribution' : 'Connect Stripe to view event distribution'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
