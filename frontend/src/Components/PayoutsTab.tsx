"use client";

import { IoCheckmarkCircle, IoTimeOutline, IoWalletOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";

const statusStyles: any = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

export default function PayoutsTab() {
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

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

    } catch (error) {
      console.error("Failed to fetch payout data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading payout data...</div>;

  const totalPaidOut = payouts
    .filter(p => p.status === 'paid')
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-0 space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available */}
        <div className="rounded-xl p-6 text-white bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg">
          <div className="flex justify-between items-center opacity-80 mb-2">
            <p className="text-sm font-medium uppercase tracking-wider">Available Balance</p>
            <IoWalletOutline className="text-lg" />
          </div>
          <h2 className="text-3xl font-bold">€{(stats?.availableBalance || 0).toFixed(2)}</h2>
          <p className="text-xs mt-3 opacity-70">Ready for next payout</p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Pending</p>
          <h2 className="text-2xl font-bold text-orange-500 mt-2">
            €0.00
          </h2>
          <p className="text-xs text-gray-500 mt-2">Currently processing</p>
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Total Paid Out</p>
          <h2 className="text-2xl font-bold text-green-600 mt-2">
            €{totalPaidOut.toFixed(2)}
          </h2>
          <p className="text-xs text-gray-500 mt-2">Lifetime earnings</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-8">
          <h2 className="font-bold text-gray-800 text-lg">Payout History</h2>
          <p className="text-sm text-gray-500">
            Track your payment disbursements
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="text-left text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-50 bg-gray-50/50">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
                <th className="text-right px-4 text-gray-300">#Ref</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {payouts.length > 0 ? (
                payouts.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-4 text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="text-green-600 font-bold">€{(p.amount || 0).toFixed(2)}</td>
                    <td>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusStyles[p.status] || 'bg-gray-100 text-gray-500'}`}
                      >
                        {p.status === "paid" ? (
                          <IoCheckmarkCircle />
                        ) : (
                          <IoTimeOutline />
                        )}
                        {p.status}
                      </span>
                    </td>
                    <td className="text-gray-500">{p.payoutMethod || 'Bank Transfer'}</td>
                    <td className="text-right px-4 text-gray-300 text-xs font-mono">{p._id.toString().slice(-8).toUpperCase()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                    No payout history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center mt-10 pt-6 border-t border-gray-50 space-y-4">
          <p className="text-sm text-gray-500">
            View detailed payout information and manage account settings on Stripe Express
          </p>
          <button className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition">
            View Stripe Express Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

