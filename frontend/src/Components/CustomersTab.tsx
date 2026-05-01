


"use client";

import { FiMail } from "react-icons/fi";
import { MdOutlineReplay } from "react-icons/md";
import { IoRefreshOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";

export default function CustomersTab() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/customers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Customers API Error:", text);
        return;
      }

      const result = await response.json();
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (customers.length === 0) {
      alert("No customer data to export.");
      return;
    }

    // Define headers
    const headers = ["Customer", "Email", "Event", "Tickets", "Total Spent", "Purchase Date"];
    
    // Create rows (properly handling commas in values by wrapping in quotes)
    const rows = customers.map(booking => [
      booking.user_id?.username || "N/A",
      booking.user_id?.email || "N/A",
      booking.event_id?.title || "N/A",
      booking.quantity || 0,
      booking.amount_total ? booking.amount_total.toFixed(2) : "0.00",
      new Date(booking.createdAt).toLocaleDateString()
    ]);

    // Combine headers and rows into CSV format
    const csvString = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val}"`).join(","))
    ].join("\n");

    // Create a blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `HalalBrite_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-10 text-center">Loading customers...</div>;

  return (
    <div className="max-w-7xl mx-auto p-0 space-y-6">
      {/* Customer List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Customer List</h2>
            <p className="text-sm text-gray-500">
              View and message your event attendees
            </p>
          </div>
          <button 
            onClick={handleExport}
            className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 text-sm font-bold rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
          >
            Export to Excel
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="text-left text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-50 bg-gray-50/50">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th>Email</th>
                <th>Event</th>
                <th>Tickets</th>
                <th>Total Spent</th>
                <th>Purchase Date</th>
                <th className="text-right px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.length > 0 ? (
                customers.map((booking, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">
                        {booking.user_id?.avatar ? (
                          <img src={booking.user_id.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                          booking.user_id?.username?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      <span className="font-bold text-gray-900">{booking.user_id?.username}</span>
                    </td>
                    <td className="text-gray-500">{booking.user_id?.email}</td>
                    <td className="font-medium text-gray-700">{booking.event_id?.title}</td>
                    <td className="text-gray-900 font-bold">{booking.quantity}</td>
                    <td className="text-red-600 font-bold">{booking.currency === 'EUR' ? '€' : booking.currency === 'USD' ? '$' : '£'}{booking.amount_total?.toFixed(2)}</td>
                    <td className="text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:text-red-600 hover:border-red-100 transition shadow-sm bg-white">
                          <FiMail />
                        </button>
                        <button className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-100 transition shadow-sm bg-white">
                          <MdOutlineReplay />
                        </button>
                        <button className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:text-gray-900 hover:border-gray-200 transition shadow-sm bg-white">
                          <IoRefreshOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 italic">
                    No customers found for your events.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


