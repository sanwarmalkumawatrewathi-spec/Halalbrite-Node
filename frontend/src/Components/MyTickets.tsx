"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Ticket = {
id:string;
  title: string;
  date: string;
  type: string;
  quantity: number;
  price: string;
  status: "confirmed" | "past";
  refundAvailable?: boolean;
};

const tickets: Ticket[] = [
  {
    id:"1",
    title: "Annual Islamic Conference 2025",
    date: "Dec 15, 2025",
    type: "VIP",
    quantity: 2,
    price: "€50.00",
    status: "confirmed",
  },
  {
    id:"2",
    title: "Halal Food Festival",
    date: "Nov 30, 2025",
    type: "General Admission",
    quantity: 1,
    price: "€15.00",
    status: "confirmed",
  },
  {
    id:"3",
    title: "Community Iftar Gathering",
    date: "Mar 10, 2025",
    type: "Standard",
    quantity: 4,
    price: "€40.00",
    status: "past",
  },
  {
    id:"4",
    title: "Charity Fundraiser Dinner",
    date: "Apr 19, 2026",
    type: "Standard",
    quantity: 3,
    price: "€45.00",
    status: "confirmed",
    refundAvailable: true,
  },
];

export default function MyTickets() {
    const [showRefundModal, setShowRefundModal] = useState(false);
    const router = useRouter();
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold">My Tickets</h1>
        <p className="text-gray-500 text-sm">
          View and manage your event tickets
        </p>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between"
          >
            {/* Left Content */}
            <div>
              <h2 className="font-medium text-gray-900">
                {ticket.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {ticket.date}
              </p>

              <div className="flex items-center gap-3 mt-3 text-sm">
                <span>
                  {ticket.type} × {ticket.quantity}
                </span>
                <span className="font-medium">{ticket.price}</span>

                {/* Status Badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    ticket.status === "confirmed"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button onClick={()=>router.push(`/TicketPreview`)} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">
                View Ticket
              </button>

              <button onClick={() => router.push(`/eventpage/${ticket.id}`)} className="border border-gray-300 px-4 py-2 rounded-md text-sm">
                Details
              </button>

              <button onClick={() => setShowRefundModal(true)}
                className={`px-4 py-2 rounded-md text-sm ${
                  ticket.refundAvailable
                    ? "border border-red-500 text-red-500"
                    : "border border-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!ticket.refundAvailable}
              >
                Request Refund
              </button>

{showRefundModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center ">
    <div className="bg-white rounded-xl w-full max-w-md p-6 relative shadow-lg">
      
      {/* Close button */}
      <button
        onClick={() => setShowRefundModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      <h2 className="text-lg font-semibold mb-2">Request Refund</h2>
      <p className="text-sm text-gray-500 mb-4">
        Please provide details about your refund request
      </p>

      {/* Reason */}
      <label className="text-sm font-medium">Reason for refund</label>
      <select className="w-full mt-1 mb-4 border rounded-md p-2 text-sm">
        <option>Select a reason</option>
        <option>Can't attend</option>
        <option>Event postponed</option>
        <option>Other</option>
      </select>

      {/* Details */}
      <label className="text-sm font-medium">Additional details</label>
      <textarea
        className="w-full mt-1 mb-4 border rounded-md p-2 text-sm"
        rows={4}
        placeholder="Please provide any additional information..."
      />

      {/* Info box */}
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs rounded-md p-3 mb-4">
        Refund requests must be made within 5 days of the event. Processing may
        take 5–10 business days.
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setShowRefundModal(false)}
          className="px-4 py-2 text-sm border rounded-md"
        >
          Cancel
        </button>
        <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-md">
          Submit Request
        </button>
      </div>
    </div>
  </div>
)}



            </div>
          </div>
        ))}
      </div>
    </div>
  );
}