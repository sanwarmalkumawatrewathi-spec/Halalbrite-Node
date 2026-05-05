


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
      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white">
        <div data-slot="card-header" className="@container/card-header auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1.5">
            <h4 data-slot="card-title" className="leading-none text-red-900 font-semibold text-lg">Customer List</h4>
            <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">View and message your event attendees</p>
          </div>
          <button onClick={handleExport} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-red-300 text-red-700 hover:bg-red-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download w-4 h-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>
            Export to Excel
          </button>
        </div>
        <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <div className="inline-block min-w-full align-middle">
              <div className="px-4 sm:px-6">
                <div data-slot="table-container" className="relative w-full overflow-x-auto">
                  <table data-slot="table" className="w-full caption-bottom text-sm min-w-[1200px]">
                    <thead data-slot="table-header" className="[&amp;_tr]:border-b">
                      <tr data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[200px]">Customer</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[220px]">Email</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[200px]">Event</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[140px]">Tickets Purchased</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[120px]">Total Spent</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[140px]">Purchase Date</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[400px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody data-slot="table-body" className="[&amp;_tr:last-child]:border-0">
                      {customers.length > 0 ? (
                        customers.map((booking, i) => {
                          const initials = booking.user_id?.username?.substring(0, 2).toUpperCase() || "U";
                          return (
                            <tr key={i} data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                              <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                                <div className="flex items-center gap-3 whitespace-nowrap">
                                  <span data-slot="avatar" className="relative flex size-10 shrink-0 overflow-hidden rounded-full">
                                    {booking.user_id?.avatar ? (
                                      <img src={booking.user_id.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                      <span data-slot="avatar-fallback" className="flex size-full items-center justify-center rounded-full bg-red-100 text-red-700">{initials}</span>
                                    )}
                                  </span>
                                  <span className="text-gray-900 font-medium">{booking.user_id?.username || 'Unknown'}</span>
                                </div>
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">{booking.user_id?.email || 'N/A'}</td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">{booking.event_id?.title || 'Unknown Event'}</td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap text-center">{booking.quantity}</td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-red-700 whitespace-nowrap font-medium">
                                {booking.currency === 'EUR' ? '€' : booking.currency === 'USD' ? '$' : '£'}{booking.amount_total?.toFixed(2) || '0.00'}
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">{new Date(booking.createdAt).toLocaleDateString()}</td>
                              <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                                <div className="flex gap-2 whitespace-nowrap">
                                  <button data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-red-300 text-red-700 hover:bg-red-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4 mr-1"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                    Message
                                  </button>
                                  <button data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-blue-300 text-blue-700 hover:bg-blue-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-4 h-4 mr-1"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
                                    Resend Tickets
                                  </button>
                                  <button data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-red-300 text-red-700 hover:bg-red-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw w-4 h-4 mr-1"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                                    Refund
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-10 text-center text-gray-400 italic border-b-0">
                            No customers found for your events.
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
      </div>

      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white">
        <div data-slot="card-header" className="@container/card-header auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1.5">
            <h4 data-slot="card-title" className="leading-none text-red-900 font-semibold text-lg">Refund Requests</h4>
            <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">Review and process customer refund requests</p>
          </div>
          <span data-slot="badge" className="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&amp;>svg]:size-3 gap-1 [&amp;>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden border-transparent [a&amp;]:hover:bg-primary/90 bg-amber-100 text-amber-800 hover:bg-amber-100">1 Pending</span>
        </div>
        <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <div className="inline-block min-w-full align-middle">
              <div className="px-4 sm:px-6">
                <div data-slot="table-container" className="relative w-full overflow-x-auto">
                  <table data-slot="table" className="w-full caption-bottom text-sm min-w-[1400px]">
                    <thead data-slot="table-header" className="[&amp;_tr]:border-b">
                      <tr data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[180px]">Customer</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[220px]">Email</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[200px]">Event</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[120px]"># of Tickets</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[140px]">Total Refund Amount</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[150px]">Reason for Refund</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[250px]">Additional Details</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[140px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody data-slot="table-body" className="[&amp;_tr:last-child]:border-0">
                      <tr data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                        <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                          <div className="flex items-center gap-3 whitespace-nowrap">
                            <span data-slot="avatar" className="relative flex size-10 shrink-0 overflow-hidden rounded-full"><span data-slot="avatar-fallback" className="flex size-full items-center justify-center rounded-full bg-red-100 text-red-700">SA</span></span>
                            <span className="text-gray-900 font-medium">Sarah Ahmed</span>
                          </div>
                        </td>
                        <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">sarah.ahmed@example.com</td>
                        <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">Annual Islamic Conference 2025</td>
                        <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap text-center">2</td>
                        <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-red-700 whitespace-nowrap font-medium">€50</td>
                        <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">Unable to attend</td>
                        <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600">
                          <div className="max-w-[250px] truncate" title="Family emergency - need to travel abroad on the event date. Would appreciate a full refund as per your policy.">Family emergency - need to travel abroad on the event date. Would appreciate a full refund as per your policy.</div>
                        </td>
                        <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                          <div className="flex gap-2 whitespace-nowrap">
                            <button data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-purple-300 text-purple-700 hover:bg-purple-50">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-4 h-4 mr-1"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                              Open Stripe Dashboard
                            </button>
                            <button data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-red-300 text-red-700 hover:bg-red-50">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw w-4 h-4 mr-1"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                              Refund
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


