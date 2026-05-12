"use client";

import { FaUsers } from "react-icons/fa";
import { MdEvent, MdAttachMoney } from "react-icons/md";
import { FiDollarSign } from "react-icons/fi";
import { IoWarningOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface OverviewTabProps {
  onTabChange?: (tab: string) => void;
}

const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fee2e2', '#991b1b', '#7f1d1d'];

export default function OverviewTab({ onTabChange }: OverviewTabProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeFilter, setTimeFilter] = useState('6 Months');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDates, setCustomDates] = useState({ start: '', end: '' });

  const { refreshUser } = useAuth();

  useEffect(() => {
    fetchStats();

    // Check if returning from Stripe
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');

    if (status === 'stripe_success' || status === 'stripe_connected') {
      verifyStripeStatus();
    } else {
      refreshUser();
    }
  }, []);

  const verifyStripeStatus = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/api/payments/connect/verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      if (result.success) {
        // Refresh global user state to reflect new verification status
        await refreshUser();
        // Update local stats
        fetchStats();
        // Remove query param without reload
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch (error) {
      console.error("Failed to verify Stripe status:", error);
    }
  };

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

  // Format chart data based on selected filter
  const revenueData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    const now = new Date();

    if (timeFilter === '1 Week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

        // Try to find daily data if it exists, otherwise use monthly data proportional to days
        const existingMonth = data?.chartData?.find((item: any) =>
          item._id.month === (d.getMonth() + 1) && item._id.year === d.getFullYear()
        );

        // NOTE: This is a fallback distribution logic since backend currently returns monthly
        result.push({
          name: dateStr,
          revenue: existingMonth ? (existingMonth.totalRevenue / 30) : 0,
          tickets: existingMonth ? (existingMonth.ticketCount / 30) : 0
        });
      }
    } else if (timeFilter === '1 Month') {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        // Show labels every 5 days for clarity
        const dateStr = i % 5 === 0 ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '';

        const existingMonth = data?.chartData?.find((item: any) =>
          item._id.month === (d.getMonth() + 1) && item._id.year === d.getFullYear()
        );

        result.push({
          name: dateStr || d.getDate().toString(),
          revenue: existingMonth ? (existingMonth.totalRevenue / 30) : 0,
          tickets: existingMonth ? (existingMonth.ticketCount / 30) : 0
        });
      }
    } else {
      // 6 Months or Custom
      let monthsToDisplay = 6;
      if (timeFilter === 'Custom' && customDates.start && customDates.end) {
        const start = new Date(customDates.start);
        const end = new Date(customDates.end);
        monthsToDisplay = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        if (monthsToDisplay < 1) monthsToDisplay = 1;
      }

      for (let i = monthsToDisplay - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = d.getMonth() + 1;
        const y = d.getFullYear();

        const existing = data?.chartData?.find((item: any) => item._id.month === m && item._id.year === y);

        result.push({
          name: months[d.getMonth()],
          revenue: existing ? existing.totalRevenue : 0,
          tickets: existing ? existing.ticketCount : 0
        });
      }
    }
    return result;
  }, [data?.chartData, timeFilter, customDates]);

  const distributionData = data?.eventDistribution?.map((item: any) => ({
    name: item._id || 'Uncategorized',
    value: item.count
  })) || [];

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
      {!data?.stripeConnected ? (
        <div data-slot="card" className="text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-2 border-amber-200 bg-amber-50">
          <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert w-6 h-6 text-amber-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-amber-900 break-words font-semibold text-lg">Stripe Connect Required</h3>
                  <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 bg-amber-500 text-white">Not Connected</span>
                </div>
                <p className="text-amber-800 mb-3 text-sm sm:text-base">Connect your Stripe account to receive payouts. Don't worry - you can still create events and sell tickets!</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleConnectStripe} className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 h-9 px-4 py-2 text-white">Connect Stripe Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : data?.chargesEnabled && data?.payoutsEnabled ? (
        <div data-slot="card" className="text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-2 border-green-200 bg-green-50">
          <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-6 h-6 text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-green-900 font-semibold text-lg">Stripe Connected</h3>
                  <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 bg-green-500 text-white">Active</span>
                </div>
                <p className="text-green-800 mb-3 text-sm sm:text-base">Your Stripe account is linked and fully verified. You can now receive payouts from ticket sales.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleManageStripe} className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-9 px-4 py-2 text-white">Manage Stripe Account</button>
                  <button onClick={handleDisconnectStripe} className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border border-green-600 bg-transparent hover:bg-green-100 text-green-700 h-9 px-4 py-2">Disconnect Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div data-slot="card" className="text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-2 border-blue-200 bg-blue-50">
          <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info w-6 h-6 text-blue-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="16" y2="12"></line><line x1="12" x2="12.01" y1="8" y2="8"></line></svg>
              </div>
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-blue-900 font-semibold text-lg">
                    {data?.verificationStatus === 'verified' ? 'Verification in Progress' : 'Action Required'}
                  </h3>
                  <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 bg-blue-500 text-white">
                    {data?.verificationStatus === 'verified' ? 'Processing' : 'Pending'}
                  </span>
                </div>
                <p className="text-blue-800 mb-3 text-sm sm:text-base">
                  {data?.verificationStatus === 'verified'
                    ? "You've submitted your details! Stripe is currently verifying your account. This usually takes a few minutes."
                    : "You've connected your account, but Stripe needs more information to enable payouts. Please complete the onboarding process."
                  }
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={handleConnectStripe} className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 h-9 px-4 py-2 text-white">
                    {data?.verificationStatus === 'verified' ? 'Update Details' : 'Complete Onboarding'}
                  </button>
                  {data?.stripeConnected && (
                    <button onClick={handleManageStripe} className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border border-blue-600 bg-transparent hover:bg-blue-100 text-blue-700 h-9 px-4 py-2">Manage Stripe</button>
                  )}
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
              <span className="text-purple-100">Available Balance</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-5 h-5"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <p className="text-white mb-1">€{stats.availableBalance.toFixed(2)}</p>
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
            <p className="text-white mb-1">{stats.ticketsSold}</p>
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
            <p className="text-white mb-1">{stats.activeEvents}</p>
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
            <p className="text-white mb-1">€{stats.totalRevenue.toFixed(2)}</p>
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
                <h4 data-slot="card-title" className="leading-none text-red-900">Revenue & Sales Overview</h4>
                <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">
                  {timeFilter === 'Custom' && customDates.start
                    ? `${new Date(customDates.start).toLocaleDateString()} - ${new Date(customDates.end).toLocaleDateString()}`
                    : `Last ${timeFilter}`}
                </p>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  type="button"
                  className="flex items-center justify-between gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm whitespace-nowrap transition-all outline-none focus:ring-2 focus:ring-red-500 w-[150px] h-9"
                >
                  <span className="truncate">{timeFilter}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down size-4 opacity-50 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                    <path d="m6 9 6 6 6-6"></path>
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1">
                    {['1 Week', '1 Month', '6 Months', 'Custom'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setTimeFilter(option);
                          setIsDropdownOpen(false);
                          if (option !== 'Custom') {
                            setCustomDates({ start: '', end: '' });
                          }
                        }}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-red-50 transition-colors ${timeFilter === option ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                      >
                        {option}
                        {timeFilter === option && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div data-slot="card-content" className="px-6 [&:last-child]:pb-6">
            {timeFilter === 'Custom' && (!customDates.start || !customDates.end) ? (
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                {!showDatePicker ? (
                  <div className="text-center px-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-range w-12 h-12 text-red-400 mx-auto mb-3">
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M16 2v4"></path>
                      <path d="M3 10h18"></path>
                      <path d="M8 2v4"></path>
                      <path d="M17 14h-6"></path>
                      <path d="M13 18H7"></path>
                      <path d="M7 14h.01"></path>
                      <path d="M17 18h.01"></path>
                    </svg>
                    <p className="text-gray-900 mb-2">Custom Date Range</p>
                    <p className="text-sm text-gray-600 mb-4">Select a custom date range to view analytics for specific periods</p>
                    <button
                      onClick={() => setShowDatePicker(true)}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 h-9 px-4 py-2 text-white shadow-lg shadow-red-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar w-4 h-4 mr-2">
                        <path d="M8 2v4"></path>
                        <path d="M16 2v4"></path>
                        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                        <path d="M3 10h18"></path>
                      </svg>
                      Choose Dates
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                    <h4 className="text-red-900 font-bold mb-4">Select Range</h4>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
                      <div className="flex-1 w-full text-left">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Start</label>
                        <input
                          type="date"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
                          onChange={(e) => setCustomDates(prev => ({ ...prev, start: e.target.value }))}
                        />
                      </div>
                      <div className="flex-1 w-full text-left">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">End</label>
                        <input
                          type="date"
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
                          onChange={(e) => setCustomDates(prev => ({ ...prev, end: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setShowDatePicker(false)}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        disabled={!customDates.start || !customDates.end}
                        onClick={() => {
                          // Filter is applied via state
                          setShowDatePicker(false);
                        }}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-red-700 transition disabled:opacity-50"
                      >
                        Apply Filter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: '#fef2f2' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#dc2626"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {timeFilter === 'Custom' && customDates.start && customDates.end && (
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => setCustomDates({ start: '', end: '' })}
                  className="text-xs text-red-600 font-bold hover:underline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                  Reset Custom Range
                </button>
              </div>
            )}
          </div>
        </div>

        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white">
          <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
            <h4 data-slot="card-title" className="leading-none text-red-900">Event Distribution</h4>
            <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">By category</p>
          </div>
          <div data-slot="card-content" className="px-6 [&amp;:last-child]:pb-6">
            {distributionData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {distributionData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-alert w-12 h-12 text-gray-400 mx-auto mb-3"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                  <p className="text-gray-600 mb-2 font-medium">No data available</p>
                  <p className="text-sm text-gray-500">{data?.stripeConnected ? 'Create more events to see category distribution' : 'Connect Stripe to view event distribution'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
