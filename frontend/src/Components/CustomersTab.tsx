


"use client";

import { FiMail } from "react-icons/fi";
import { MdOutlineReplay } from "react-icons/md";
import { IoRefreshOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { getImageUrl } from "@/utils/imageUtils";
import { useCurrency } from "@/context/CurrencyContext";

export default function CustomersTab() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const { formatPrice } = useCurrency();

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
      booking.customer_name || booking.user_id?.username || "N/A",
      booking.customer_email || booking.user_id?.email || "N/A",
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
    link.setAttribute("download", `Halalbrite_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleMessageClick = (booking: any) => {
    setSelectedBooking(booking);
    setMessageSubject(`Message regarding ${booking.event_name}`);
    setMessageContent("");
    setShowMessageModal(true);
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSendMessage = async () => {
    if (!messageContent.trim()) {
      alert("Please enter a message.");
      return;
    }

    setIsSending(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/message-attendee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          subject: messageSubject,
          message: messageContent
        })
      });

      const result = await response.json();
      if (result.success) {
        setShowMessageModal(false);
        setSuccessMessage("Your message has been sent successfully to the attendee.");
        setShowSuccessModal(true);
      } else {
        alert("Failed to send message: " + result.message);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSending(false);
    }
  };

  const [showResendModal, setShowResendModal] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleResendClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowResendModal(true);
  };

  const handleResendTickets = async () => {
    setIsResending(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const response = await fetch(`${API_URL}/api/payments/booking/${selectedBooking._id}/resend-email`, {
        method: 'POST'
      });

      const result = await response.json();
      if (result.success) {
        setShowResendModal(false);
        setSuccessMessage("Tickets have been resent successfully to the attendee's email.");
        setShowSuccessModal(true);
      } else {
        alert("Failed to resend tickets: " + result.message);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsResending(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-16 min-h-[300px]">
      <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      <p className="mt-3 text-red-600 text-sm font-semibold tracking-wide animate-pulse">Loading customers...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-0 space-y-6">
      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white">
        <div data-slot="card-header" className="@container/card-header auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1.5">
            <h4 data-slot="card-title" className="leading-none text-red-900">Customer List</h4>
            <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">View and message your event attendees</p>
          </div>
          <button onClick={handleExport} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark: dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-red-300 text-red-700 hover:bg-red-50">
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
                          const customerName = booking.customer_name || booking.user_id?.username || 'Unknown';
                          const customerEmail = booking.customer_email || booking.user_id?.email || 'N/A';
                          const initials = customerName.substring(0, 2).toUpperCase();
                          return (
                            <tr key={i} data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                              <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                                <div className="flex items-center gap-3 whitespace-nowrap">
                                  <span data-slot="avatar" className="relative flex size-10 shrink-0 overflow-hidden rounded-full">
                                    {booking.user_id?.avatar ? (
                                      <img src={getImageUrl(booking.user_id.avatar)} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                      <span data-slot="avatar-fallback" className="flex size-full items-center justify-center rounded-full bg-red-100 text-red-700">{initials}</span>
                                    )}
                                  </span>
                                  <span className="text-gray-900 font-medium">{customerName}</span>
                                </div>
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">{customerEmail}</td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">{booking.event_id?.title || 'Unknown Event'}</td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap text-center">{booking.quantity}</td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-red-700 whitespace-nowrap font-medium">
                                {formatPrice(booking.amount_total || 0, false)}
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">{new Date(booking.createdAt).toLocaleDateString()}</td>
                              <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                                <div className="flex gap-2 whitespace-nowrap">
                                  <button onClick={() => handleMessageClick(booking)} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark: dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-red-300 text-red-700 hover:bg-red-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-4 h-4 mr-1"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                                    Message
                                  </button>
                                  <button onClick={() => handleResendClick(booking)} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark: dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-blue-300 text-blue-700 hover:bg-blue-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-4 h-4 mr-1"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
                                    Resend Tickets
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

      <div data-slot="card" className="hidden bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white">
        <div data-slot="card-header" className="@container/card-header auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1.5">
            <h4 data-slot="card-title" className="leading-none text-red-900">Refund Requests</h4>
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
                        <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-red-700 whitespace-nowrap font-medium">{formatPrice(50)}</td>
                        <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">Unable to attend</td>
                        <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600">
                          <div className="max-w-[250px] truncate" title="Family emergency - need to travel abroad on the event date. Would appreciate a full refund as per your policy.">Family emergency - need to travel abroad on the event date. Would appreciate a full refund as per your policy.</div>
                        </td>
                        <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                          <div className="flex gap-2 whitespace-nowrap">
                            <button data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background hover:text-accent-foreground dark:bg-input/30 dark: dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 border-purple-300 text-purple-700 hover:bg-purple-50">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-4 h-4 mr-1"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                              Open Stripe Dashboard
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
      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50/30">
              <h3 className="text-xl font-bold text-red-900">Send Message</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Recipient</label>
                <div className="px-3 py-2 bg-gray-50 border borborder border-gray-200 rounded-lg text-gray-600 text-sm">
                  {selectedBooking?.customer_name} ({selectedBooking?.customer_email})
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="w-full px-4 py-2 borborder border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="Enter subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message Description</label>
                <textarea
                  rows={5}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full px-4 py-2 borborder border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-sm resize-none"
                  placeholder="Write your message here..."
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={isSending}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-md shadow-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Resend Tickets Modal */}
      {showResendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-blue-50/30">
              <h3 className="text-xl font-bold text-blue-900">Resend Tickets</h3>
              <button
                onClick={() => setShowResendModal(false)}
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <div className="p-8 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl">Confirm Resend</h4>
                <p className="text-sm text-gray-500 mt-2">
                  Are you sure you want to resend the tickets for <strong>{selectedBooking?.event_name}</strong> to:
                </p>
                <p className="text-md font-semibold text-blue-700 mt-1">
                  {selectedBooking?.customer_email}
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-center gap-3">
              <button
                onClick={() => setShowResendModal(false)}
                className="px-6 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResendTickets}
                disabled={isResending}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isResending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Resending...
                  </>
                ) : (
                  "Yes, Resend Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check text-green-600 w-10 h-10"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600 mb-8">{successMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200"
            >
              Great, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


