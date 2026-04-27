"use client";

import { FaRegEye } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline, MdEvent } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const statusStyles: any = {
  published: "bg-green-100 text-green-700",
  active: "bg-green-100 text-green-700",
  draft: "bg-red-100 text-red-600",
  past: "bg-gray-200 text-gray-700",
  completed: "bg-gray-200 text-gray-700",
};

export default function EventsTab() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading events...</div>;

  return (
    <div className="max-w-7xl mx-auto p-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Your Events</h2>
            <p className="text-sm text-gray-500">
              Manage and track your event listings
            </p>
          </div>

          <button 
            onClick={() => router.push('/post-an-event')}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition"
          >
            <IoAdd className="text-lg" /> New Event
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="text-left text-gray-400 font-bold uppercase text-[10px] tracking-wider border-b border-gray-50 bg-gray-50/50">
              <tr>
                <th className="py-3 px-4">Event</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Tickets</th>
                <th>Revenue</th>
                <th className="text-right px-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {events.length > 0 ? (
                events.map((e, i) => {
                  const eventDate = new Date(e.startDate);
                  const isPast = eventDate < new Date();
                  const status = isPast ? 'past' : e.status;

                  return (
                    <tr key={i} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {e.banner && (
                            <img src={e.banner} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                          )}
                          <span className="font-bold text-gray-900">{e.title}</span>
                        </div>
                      </td>
                      <td className="text-gray-500">{e.category?.name || 'General'}</td>
                      <td className="text-gray-500">{eventDate.toLocaleDateString()}</td>
                      <td>
                        <span
                          className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${statusStyles[status] || statusStyles.draft}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="font-medium text-gray-700">
                        {e.ticketsSold} / {e.totalTickets || '∞'}
                      </td>
                      <td className="text-red-600 font-bold">€{(e.totalRevenue || 0).toFixed(2)}</td>
                      <td className="py-4 px-4">
                        <div className="flex justify-end gap-3 text-gray-400">
                          <button className="p-2 border border-gray-100 rounded-lg hover:text-gray-900 hover:border-gray-200 transition bg-white shadow-sm">
                            <FaRegEye />
                          </button>
                          <button className="p-2 border border-gray-100 rounded-lg hover:text-blue-600 hover:border-blue-100 transition bg-white shadow-sm">
                            <FiEdit />
                          </button>
                          <button className="p-2 border border-gray-100 rounded-lg hover:text-red-600 hover:border-red-100 transition bg-white shadow-sm">
                            <MdDeleteOutline />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                    <td colSpan={7} className="py-12 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <MdEvent className="text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium">No events found.</p>
                        <button 
                            onClick={() => router.push('/post-an-event')}
                            className="mt-4 text-red-600 font-bold text-sm hover:underline"
                        >
                            Create your first event now
                        </button>
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

