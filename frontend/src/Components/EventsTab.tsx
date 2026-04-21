"use client";

import { FaRegEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { IoAdd } from "react-icons/io5";

const events = [
  {
    name: "Annual Islamic Conference 2025",
    organiser: "Islamic Conference Society",
    date: "Dec 15, 2025",
    status: "active",
    tickets: "250/300",
    revenue: "€6,250",
  },
  {
    name: "Halal Food Festival",
    organiser: "Islamic Conference Society",
    date: "Dec 20, 2025",
    status: "active",
    tickets: "480/500",
    revenue: "€7,200",
  },
  {
    name: "Community Gathering",
    organiser: "Islamic Conference Society",
    date: "Jan 5, 2026",
    status: "draft",
    tickets: "0/150",
    revenue: "€0",
  },
  {
    name: "Workshop on Islamic Finance",
    organiser: "Islamic Conference Society",
    date: "Oct 10, 2025",
    status: "completed",
    tickets: "80/80",
    revenue: "€800",
  },
];

const statusStyles: any = {
  active: "bg-green-100 text-green-700",
  draft: "bg-red-100 text-red-600",
  completed: "bg-gray-200 text-gray-700",
};

export default function EventsTab() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold">Your Events</h2>
            <p className="text-sm text-gray-500">
              Manage and track your event listings
            </p>
          </div>

          <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-md text-sm">
            <IoAdd /> New Event
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">Event</th>
                <th>Organiser</th>
                <th>Date</th>
                <th>Status</th>
                <th>Tickets</th>
                <th>Revenue</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {events.map((e, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-3 font-medium">{e.name}</td>
                  <td className="text-gray-600">{e.organiser}</td>
                  <td>{e.date}</td>
                  <td>
                    <span
                      className={`px-2 py-1 text-xs rounded-full capitalize ${statusStyles[e.status]}`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td>{e.tickets}</td>
                  <td className="text-red-500">{e.revenue}</td>
                  <td className="flex items-center gap-3 text-gray-600">
                    <FaRegEye className="cursor-pointer hover:text-black" />
                    <FiEdit className="cursor-pointer hover:text-black" />
                    <MdDeleteOutline className="cursor-pointer text-red-500" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
