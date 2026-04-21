



"use client";

import { FiMail } from "react-icons/fi";
import { MdOutlineReplay } from "react-icons/md";
import { IoRefreshOutline } from "react-icons/io5";

const customers = [
  {
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    event: "Annual Islamic Conference 2025",
    tickets: 3,
    total: "€75",
    date: "10/11/2025",
    initials: "AK",
  },
  {
    name: "Ahmed Khan",
    email: "ahmed@example.com",
    event: "Halal Food Festival",
    tickets: 2,
    total: "€30",
    date: "15/10/2025",
    initials: "AK",
  },
  {
    name: "Fatima Ali",
    email: "fatima@example.com",
    event: "Halal Food Festival",
    tickets: 5,
    total: "€125",
    date: "05/11/2025",
    initials: "FA",
  },
  {
    name: "Omar Hassan",
    email: "omar@example.com",
    event: "Workshop on Islamic Finance",
    tickets: 2,
    total: "€50",
    date: "09/11/2025",
    initials: "OH",
  },
  {
    name: "Aisha Rahman",
    email: "aisha@example.com",
    event: "Annual Islamic Conference 2025",
    tickets: 4,
    total: "€100",
    date: "07/11/2025",
    initials: "AR",
  },
];

export default function CustomersTab() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Customer List */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold">Customer List</h2>
            <p className="text-sm text-gray-500">
              View and message your event attendees
            </p>
          </div>
          <button className="border border-red-500 text-red-500 px-3 py-1.5 text-sm rounded-md">
            Export to Excel
          </button>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-[1000px] w-full text-sm">
            <thead className="text-left text-gray-500 border-b bg-gray-50 sticky top-0">
              <tr>
                <th className="py-2">Customer</th>
                <th>Email</th>
                <th>Event</th>
                <th>Tickets Purchased</th>
                <th>Total Spent</th>
                <th>Purchase Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-3 flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500 text-xs">
                      {c.initials}
                    </span>
                    {c.name}
                  </td>
                  <td>{c.email}</td>
                  <td>{c.event}</td>
                  <td>{c.tickets}</td>
                  <td className="text-red-500">{c.total}</td>
                  <td>{c.date}</td>
                  <td className="flex gap-2">
                    <button className="flex items-center gap-1 border border-red-500 text-red-500 px-2 py-1 rounded-md text-xs">
                      <FiMail /> Message
                    </button>
                    <button className="flex items-center gap-1 border border-blue-500 text-blue-500 px-2 py-1 rounded-md text-xs">
                      <MdOutlineReplay /> Resend Tickets
                    </button>
                    <button className="flex items-center gap-1 border border-gray-300 text-gray-600 px-2 py-1 rounded-md text-xs">
                      <IoRefreshOutline /> Refund
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Requests */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold">Refund Requests</h2>
            <p className="text-sm text-gray-500">
              Review and process customer refund requests
            </p>
          </div>
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
            1 Pending
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-left text-gray-500 border-b bg-gray-50">
              <tr>
                <th className="py-2">Customer</th>
                <th>Email</th>
                <th>Event</th>
                <th># of Tickets</th>
                <th>Total Refund Amount</th>
                <th>Reason for Refund</th>
                <th>Additional Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3 flex items-center gap-2">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500 text-xs">SA</span>
                  Sarah Ahmed
                </td>
                <td>sarah@example.com</td>
                <td>Annual Islamic Conference 2025</td>
                <td>2</td>
                <td className="text-red-500 font-medium">€50</td>
                <td>Unable to attend</td>
                <td className="text-gray-600 text-xs max-w-[250px] truncate">
                  Family emergency - need to travel abroad
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

