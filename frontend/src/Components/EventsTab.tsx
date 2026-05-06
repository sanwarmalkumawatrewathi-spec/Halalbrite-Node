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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  const handleDelete = (event: any) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setDeletingId(eventToDelete._id);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/events/${eventToDelete._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success || response.ok) {
        setShowDeleteModal(false);
        setEvents(prev => prev.filter(e => e._id !== eventToDelete._id));
        setShowSuccessModal(true);
      } else {
        alert(result.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Network error while deleting.');
    } finally {
      setDeletingId(null);
      setEventToDelete(null);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading events...</div>;

  return (
    <div className="max-w-full mx-auto p-0 space-y-6">
      <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-white overflow-hidden w-full min-w-0">
        <div data-slot="card-header" className="@container/card-header auto-rows-min grid-rows-[auto_auto] gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1.5">
            <h4 data-slot="card-title" className="leading-none text-red-900 font-semibold text-lg">Your Events</h4>
            <p data-slot="card-description" className="text-muted-foreground mt-1 text-sm">Manage and track your event listings</p>
          </div>
          <button onClick={() => router.push('/post-an-event')} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus w-4 h-4 mr-2"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
            Create Event
          </button>
        </div>
        <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-0">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            <div className="inline-block min-w-full align-middle">
              <div className="px-4 pb-6 sm:px-6">
                <div data-slot="table-container" className="relative w-full overflow-x-auto">
                  <table data-slot="table" className="w-full caption-bottom text-sm min-w-[1000px]">
                    <thead data-slot="table-header" className="[&amp;_tr]:border-b">
                      <tr data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[300px]">Event</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[150px]">Category</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[150px]">Date</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[100px]">Status</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[120px]">Tickets Sold</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[120px]">Revenue</th>
                        <th data-slot="table-head" className="text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] w-[150px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody data-slot="table-body" className="[&amp;_tr:last-child]:border-0">
                      {events.length > 0 ? (
                        events.map((e, i) => {
                          const eventDate = new Date(e.startDate);
                          const isPast = eventDate < new Date();
                          const status = isPast ? 'past' : e.status;

                          let badgeStyles = "bg-gray-100 text-gray-800 hover:bg-gray-100";
                          if (status === 'published' || status === 'active') badgeStyles = "bg-green-100 text-green-800 hover:bg-green-100";
                          else if (status === 'draft') badgeStyles = "bg-amber-100 text-amber-800 hover:bg-amber-100";

                          return (
                            <tr key={i} data-slot="table-row" className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                              <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                                <div className="flex items-center gap-3 whitespace-nowrap">
                                  <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                                    <img 
                                      src={e.banner ? (e.banner.startsWith('http') ? e.banner : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}${e.banner}`) : "/images/noimage.jpg"} 
                                      alt="" 
                                      className="w-full h-full object-cover" 
                                      onError={(e: any) => {
                                        e.target.onerror = null;
                                        e.target.src = "/images/noimage.jpg";
                                      }}
                                    />
                                  </div>
                                  <span className="font-medium text-gray-900 truncate max-w-[200px]" title={e.title}>{e.title}</span>
                                </div>
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">{e.category?.name || 'General'}</td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">{eventDate.toLocaleDateString()}</td>
                              <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px]">
                                <span data-slot="badge" className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden border-transparent capitalize ${badgeStyles}`}>
                                  {status}
                                </span>
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-gray-600 whitespace-nowrap">
                                {e.ticketsSold} / {e.totalTickets || '∞'}
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-red-700 whitespace-nowrap font-medium">
                                €{(e.totalRevenue || 0).toFixed(2)}
                              </td>
                              <td data-slot="table-cell" className="p-2 align-middle whitespace-nowrap [&amp;:has([role=checkbox])]:pr-0 [&amp;>[role=checkbox]]:translate-y-[2px] text-right">
                                <div className="flex justify-end gap-2 whitespace-nowrap">
                                  <button onClick={() => router.push(`/event/${e.slug || e._id}`)} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-md bg-transparent text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-4 h-4"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                    <span className="sr-only">View</span>
                                  </button>
                                  <button onClick={() => router.push(`/post-an-event?edit=${e._id}`)} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-md bg-transparent text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit w-4 h-4"><path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z"></path></svg>
                                    <span className="sr-only">Edit</span>
                                  </button>
                                  <button onClick={() => handleDelete(e)} disabled={deletingId === e._id} data-slot="button" className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-md bg-transparent text-red-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 w-4 h-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                                    <span className="sr-only">Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-12 text-center border-b-0">
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
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <MdDeleteOutline className="text-red-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Event?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-gray-900">"{eventToDelete?.title}"</span>? This action cannot be undone and all associated data will be lost.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingId !== null}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deletingId !== null}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {deletingId ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
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
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Deleted!</h3>
            <p className="text-gray-600 mb-8">The event has been permanently removed from your dashboard.</p>
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

