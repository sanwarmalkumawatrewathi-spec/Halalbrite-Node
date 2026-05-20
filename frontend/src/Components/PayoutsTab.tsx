"use client";

import { IoCheckmarkCircle, IoTimeOutline, IoWalletOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";

const statusStyles: any = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

export default function PayoutsTab() {
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchPayoutData();
  }, []);

  const fetchPayoutData = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');

      // Fetch payouts
      const payoutsRes = await fetch(`${API_URL}/api/dashboard/organizer/payouts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const payoutsResult = await payoutsRes.json();

      // Fetch stats for balance info
      const statsRes = await fetch(`${API_URL}/api/dashboard/organizer/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsResult = await statsRes.json();

      if (payoutsResult.success) setPayouts(payoutsResult.data);
      if (statsResult.success) setStats(statsResult.data.stats);

    } catch (error: any) {
      console.error("Failed to fetch payout data:", error);
      // If error is Failed to fetch, it might be CORS or server down
      if (error.message === 'Failed to fetch') {
        console.error("This is likely a CORS or Network issue. Check if backend is running on 5000.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-16 min-h-[300px]">
      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      <p className="mt-3 text-red-600 text-sm font-semibold tracking-wide animate-pulse">Loading payout data...</p>
    </div>
  );

  const totalPaidOut = payouts
    .filter(p => p.status === 'paid')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="max-w-full mx-auto p-0 space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white overflow-hidden w-full">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 text-white h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100">Available Balance</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet w-5 h-5"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-9.27 7.8A4.02 4.02 0 0 1 5.38 16H4a2 2 0 0 1-2-2V4"></path><path d="M21 12v4"></path><path d="M12 21h-2"></path><circle cx="18" cy="14" r="1"></circle></svg>
            </div>
            <p className="text-white mb-1 font-bold text-2xl">{formatPrice(stats?.availableBalance || 0, false)}</p>
            <div className="flex items-center gap-1 text-purple-100 text-sm">
              <span>Ready for next payout</span>
            </div>
          </div>
        </div>

        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white p-6 w-full overflow-hidden">
          <div className="flex flex-col h-full justify-between">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
              <h2 className="text-3xl font-bold text-amber-500 mt-1">{formatPrice(stats?.pendingBalance || 0, false)}</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 text-amber-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Currently processing
            </div>
          </div>
        </div>

        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white p-6 w-full overflow-hidden">
          <div className="flex flex-col h-full justify-between">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Paid Out</p>
              <h2 className="text-3xl font-bold text-green-600 mt-1">{formatPrice(totalPaidOut, false)}</h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-4 h-4 text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Lifetime earnings
            </div>
          </div>
        </div>
      </div>

      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white overflow-hidden w-full min-w-0">
        <div data-slot="card-header" className="@container/card-header auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-col space-y-1.5 pb-4">
          <h4 data-slot="card-title" className="leading-none text-red-900">Payout History</h4>
          <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">Track your payment disbursements</p>
        </div>
        <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <div className="inline-block min-w-full align-middle">
              <div className="px-4 sm:px-6">
                <div data-slot="table-container" className="relative w-full overflow-x-auto">
                  <table data-slot="table" className="w-full caption-bottom text-sm min-w-[700px]">
                    <thead data-slot="table-header" className="[&amp;_tr]:border-b">
                      <tr data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-black transition-colors">
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[150px]">Date</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[150px]">Amount</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[150px]">Status</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[150px]">Method</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-right">Reference</th>
                      </tr>
                    </thead>
                    <tbody data-slot="table-body" className="[&amp;_tr:last-child]:border-0">
                      {payouts.length > 0 ? (
                        payouts.map((p, i) => {
                          const isPaid = p.status === 'paid';
                          const badgeClasses = isPaid
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-100";

                          return (
                            <tr key={i} data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-black/20 transition-colors">
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">
                                {new Date(p.createdAt).toLocaleDateString()}
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-green-700 whitespace-nowrap font-medium">
                                {formatPrice(p.amount || 0, false)}
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                                <span data-slot="badge" className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;>svg]:size-3 gap-1 [&amp;>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&amp;]:hover:bg-primary/90 capitalize ${badgeClasses}`}>
                                  {isPaid ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle w-3 h-3 mr-1"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                  ) : (
                                    <IoTimeOutline className="w-3 h-3 mr-1" />
                                  )}
                                  {p.status}
                                </span>
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-500 whitespace-nowrap">
                                {p.payoutMethod || 'Bank Transfer'}
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-right text-gray-400 font-mono text-xs">
                                #{p._id ? p._id.toString().slice(-8).toUpperCase() : 'REF'}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-gray-400 italic border-b-0">
                            No payout history found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-slot="card-footer" className="flex items-center justify-center p-6 pt-0 border-t border-gray-100 mt-6 flex-col space-y-4">
          <p className="text-sm text-gray-500 text-center">View detailed payout information and manage account settings on Stripe Express</p>
          <button data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-md">
            View Stripe Express Dashboard
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link w-4 h-4 ml-2"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

