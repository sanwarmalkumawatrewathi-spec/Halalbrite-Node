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
  event_id: string;
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
      <div className="p-10 text-center bg-white rounded-xl border border-gray-200 m-6">
        <p className="text-gray-500 mb-4">You don't have any tickets yet.</p>
        <button onClick={() => router.push('/events')} className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition">
          Explore Events
        </button>
      </div>
    );

  return (
    <div className="p-0 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">My Tickets</h1>
        <p className="text-gray-500 text-sm">
          View and manage your event tickets
        </p>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            {/* Left Content */}
            <div>
              <h2 className="font-semibold text-gray-900 text-lg">
                {ticket.event_name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(ticket.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>

              <div className="flex items-center gap-3 mt-3 text-sm">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                  {ticket.ticket_name} × {ticket.quantity}
                </span>
                <span className="font-bold text-gray-900">
                    {ticket.currency} {ticket.amount_total.toFixed(2)}
                </span>

                {/* Status Badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    ticket.payment_status === "paid" || ticket.payment_status === "free"
                      ? "bg-green-100 text-green-700"
                      : ticket.payment_status === "cancelled" || ticket.payment_status === "refunded"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {ticket.payment_status}
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={()=>router.push(`/TicketPreview`)} 
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
              >
                View Ticket
              </button>

              <button 
                onClick={() => router.push(`/eventpage/${ticket.event_id}`)} 
                className="border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition"
              >
                Details
              </button>

              <button 
                onClick={() => {
                    setSelectedTicket(ticket);
                    setShowRefundModal(true);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  ticket.payment_status === "paid"
                    ? "border border-red-500 text-red-500 hover:bg-red-50"
                    : "border border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={ticket.payment_status !== "paid"}
              >
                Request Refund
              </button>
            </div>
          </div>
        ))}
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