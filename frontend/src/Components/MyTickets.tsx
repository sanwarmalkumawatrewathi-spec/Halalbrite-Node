"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Ticket = {
  _id: string;
  event_name: string;
  event_date: string;
  ticket_name: string;
  quantity: number;
  amount_total: number;
  currency: string;
  payment_status: "paid" | "pending" | "cancelled" | "refunded" | "free";
  event_id: {
    _id: string;
    slug?: string;
  };
};

export default function MyTickets() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/bookings/my-tickets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const contentType = response.headers.get("content-type");
            if (response.ok && contentType && contentType.includes("application/json")) {
                const data = await response.json();
                setTickets(data);
            } else {
                console.error("Failed to fetch tickets:", response.status, await response.text());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading tickets...</div>;
    
    if (tickets.length === 0) return (
      <div data-slot="card" className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200">
        <div data-slot="card-header" className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-4 sm:p-6 pb-0">
          <h4 data-slot="card-title" className="text-lg sm:text-xl font-semibold">My Tickets</h4>
          <p data-slot="card-description" className="text-gray-500 text-sm">View and manage your event tickets</p>
        </div>
        <div data-slot="card-content" className="p-4 sm:p-6 pt-0 text-center py-10">
          <p className="text-gray-500 mb-4">You don't have any tickets yet.</p>
          <button onClick={() => router.push('/events')} className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition">
            Explore Events
          </button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6" suppressHydrationWarning>
      <div data-slot="card" className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 shadow-sm">
        <div data-slot="card-header" className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 p-4 sm:p-6 pb-0">
          <h4 data-slot="card-title" className="text-lg sm:text-xl font-semibold">My Tickets</h4>
          <p data-slot="card-description" className="text-gray-500 text-sm">View and manage your event tickets</p>
        </div>
        <div data-slot="card-content" className="p-4 sm:p-6 pt-0">
          <div className="space-y-3 sm:space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="border border-gray-200 bg-white rounded-lg p-3 sm:p-4 hover:border-red-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-gray-900 text-sm sm:text-base font-semibold">{ticket.event_name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {new Date(ticket.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1.5 sm:mt-2">
                      <span className="text-xs sm:text-sm text-gray-600">{ticket.ticket_name} × {ticket.quantity}</span>
                      <span className="text-xs sm:text-sm text-gray-900 font-semibold">{ticket.currency} {ticket.amount_total.toFixed(2)}</span>
                      <span data-slot="badge" className={`inline-flex items-center justify-center rounded-md px-2 py-0.5 font-medium w-fit whitespace-nowrap text-white text-xs ${ticket.payment_status === "paid" || ticket.payment_status === "free" ? "bg-green-600" : ticket.payment_status === "cancelled" || ticket.payment_status === "refunded" ? "bg-red-600" : "bg-yellow-500"}`}>
                        {ticket.payment_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-shrink-0">
                    <button 
                      onClick={()=>router.push(`/TicketPreview`)}
                      data-slot="button" 
                      className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-white rounded-md px-3 bg-red-600 hover:bg-red-700 flex-1 sm:flex-initial text-xs sm:text-sm h-8 sm:h-9"
                    >
                      View Ticket
                    </button>
                    <button 
                      onClick={() => router.push(`/event/${ticket.event_id?.slug || ticket.event_id?._id || ticket.event_id}`)}
                      data-slot="button" 
                      className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 border bg-white text-gray-900 hover:bg-gray-100 rounded-md px-3 flex-1 sm:flex-initial text-xs sm:text-sm h-8 sm:h-9 border-gray-200"
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => {
                          setSelectedTicket(ticket);
                          setShowRefundModal(true);
                      }}
                      disabled={ticket.payment_status !== "paid"}
                      data-slot="button" 
                      className={`inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 border rounded-md px-3 flex-1 sm:flex-initial text-xs sm:text-sm h-8 sm:h-9 ${ticket.payment_status === "paid" ? "bg-white text-red-600 border-red-200 hover:bg-red-50" : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"}`}
                    >
                      Request Refund
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setShowRefundModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-1">Request Refund</h2>
            <p className="text-sm text-gray-500 mb-6">
              Request a refund for <span className="font-semibold text-gray-900">{selectedTicket?.event_name}</span>
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Reason for refund</label>
                    <select className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none">
                        <option>Select a reason</option>
                        <option>Can't attend</option>
                        <option>Event postponed</option>
                        <option>Medical emergency</option>
                        <option>Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Additional details</label>
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                        rows={4}
                        placeholder="Please provide any additional information to help us process your request..."
                    />
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-700 text-[11px] rounded-lg p-3 my-6">
              <p className="font-bold mb-1">Important Information:</p>
              <ul className="list-disc ml-4 space-y-1">
                  <li>Refund requests must be made within 5 days of the event.</li>
                  <li>Processing may take 5–10 business days.</li>
                  <li>Some processing fees might be non-refundable.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-6 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                    alert("Refund request submitted successfully!");
                    setShowRefundModal(false);
                }}
                className="px-6 py-2 text-sm font-bold bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}