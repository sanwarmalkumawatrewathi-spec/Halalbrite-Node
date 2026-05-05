"use client";
import { useState, useEffect } from "react";
import SimpleEditor from "@/Components/SimpleEditor";
import { BsCalendar4Event } from "react-icons/bs";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import EventType from "@/Components/EventType";
import TicketSection from "@/Components/TicketSection";
import { useAuth } from "@/context/authContext";

export default function EventForm({ editId }: { editId?: string | null }) {
    const { user } = useAuth();
    const isEditMode = !!editId;
    const [categories, setCategories] = useState<any[]>([]);
    const [form, setForm] = useState<{
        title: string;
        category: string;
        description: string;
        organizer: string;
        organizerName: string;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
        eventType: string;
        thumbnailType: string;
        thumbnail: File | null;
        banner: File | null;
        venue: string;
        address: string;
        city: string;
        postcode: string;
        country: string;
        meetingLink: string;
        bannerPreview: string;
    }>({
        title: "",
        category: "",
        description: "",
        organizer: user?._id || "",
        organizerName: user?.username || "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
        eventType: "in-person",
        thumbnailType: "same",
        thumbnail: null,
        banner: null,
        // Location fields (moved from EventType)
        venue: "",
        address: "",
        city: "",
        postcode: "",
        country: "UK",
        meetingLink: "",
        bannerPreview: "",
    });

    const [tickets, setTickets] = useState([
        {
            name: "General Admission",
            description: "Standard entry ticket",
            price: 0,
            quantity: 100,
            saleStartDate: "",
            saleStartTime: "",
            saleEndDate: "",
            saleEndTime: "",
            chargeCustomer: true,
        },
    ]);

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                organizer: user._id,
                organizerName: prev.organizerName || user.username
            }));
        }
    }, [user]);

    // Fetch existing event data when in edit mode
    useEffect(() => {
        if (!editId) return;
        const fetchEvent = async () => {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
                const token = localStorage.getItem("token");
                const res = await fetch(`${baseUrl}/api/events/${editId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                const ev = data.data || data;
                if (ev && ev._id) {
                    // Parse dates
                    const startD = ev.startDate ? new Date(ev.startDate) : null;
                    const endD = ev.endDate ? new Date(ev.endDate) : null;
                    const toDateStr = (d: Date | null) => {
                        if (!d || isNaN(d.getTime())) return '';
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const day = String(d.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    };
                    const toTimeStr = (d: Date | null) => {
                        if (!d || isNaN(d.getTime())) return '';
                        const hours = String(d.getHours()).padStart(2, '0');
                        const minutes = String(d.getMinutes()).padStart(2, '0');
                        return `${hours}:${minutes}`;
                    };

                    setForm(prev => ({
                        ...prev,
                        title: ev.title || '',
                        category: ev.category?._id || ev.category || '',
                        description: ev.description || '',
                        organizer: ev.organizer?._id || ev.organizer || prev.organizer,
                        organizerName: ev.organizerName || prev.organizerName,
                        startDate: toDateStr(startD),
                        endDate: toDateStr(endD),
                        startTime: toTimeStr(startD),
                        endTime: toTimeStr(endD),
                        eventType: ev.eventType || 'in-person',
                        venue: ev.location?.venueName || '',
                        address: ev.location?.address || '',
                        city: ev.location?.city || '',
                        postcode: ev.location?.postcode || '',
                        country: ev.location?.country || 'UK',
                        meetingLink: ev.meetingLink || '',
                        bannerPreview: ev.banner || '',
                    }));

                    // Pre-fill tickets if available
                    if (ev.ticketTypes && ev.ticketTypes.length > 0) {
                        const mappedTickets = ev.ticketTypes.map((t: any) => {
                            const startD = t.saleStart ? new Date(t.saleStart) : null;
                            const endD = t.saleEnd ? new Date(t.saleEnd) : null;
                            return {
                                ...t,
                                saleStartDate: toDateStr(startD),
                                saleStartTime: toTimeStr(startD),
                                saleEndDate: toDateStr(endD),
                                saleEndTime: toTimeStr(endD),
                                chargeCustomer: t.chargeCustomer !== undefined ? t.chargeCustomer : true
                            };
                        });
                        setTickets(mappedTickets);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch event for editing:', err);
            }
        };
        fetchEvent();
    }, [editId]);

    const fetchCategories = async () => {
        try {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const res = await fetch(`${baseUrl}/api/categories`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setCategories(data);
            }
        } catch (error) {
            console.error("❌ Failed to fetch categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append("image", file);
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const res = await fetch(`${baseUrl}/api/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload failed");
        return data.url;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: "", message: "" });

        try {
            let bannerUrl = "";
            let thumbnailUrl = "";

            // 1. Handle Banner Upload
            const bannerFile = (document.getElementsByName("banner")[0] as HTMLInputElement)?.files?.[0];
            if (bannerFile) {
                bannerUrl = await handleUpload(bannerFile);
            }

            // 2. Handle Thumbnail Upload
            if (form.thumbnailType === "different" && form.thumbnail) {
                thumbnailUrl = await handleUpload(form.thumbnail as unknown as File);
            } else {
                thumbnailUrl = bannerUrl;
            }

            // 3. Prepare Event Data
            const formattedTickets = tickets.map(t => {
                const saleStart = t.saleStartDate && t.saleStartTime ? `${t.saleStartDate}T${t.saleStartTime}:00` : null;
                const saleEnd = t.saleEndDate && t.saleEndTime ? `${t.saleEndDate}T${t.saleEndTime}:00` : null;
                return {
                    ...t,
                    saleStart,
                    saleEnd
                };
            });

            const eventData = {
                ...form,
                banner: bannerUrl || (isEditMode ? undefined : ""),
                thumbnail: thumbnailUrl || (isEditMode ? undefined : ""),
                ticketTypes: formattedTickets,
                location: {
                    venueName: form.venue,
                    address: form.address,
                    city: form.city,
                    postcode: form.postcode,
                    country: form.country
                }
            };

            // 4. Create or Update Event
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const url = isEditMode ? `${baseUrl}/api/events/${editId}` : `${baseUrl}/api/events`;
            const method = isEditMode ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(eventData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || (isEditMode ? "Failed to update event" : "Failed to create event"));

            setStatus({ type: "success", message: isEditMode ? "Event updated successfully! Redirecting..." : "Event created successfully! Redirecting..." });
            setTimeout(() => {
                window.location.href = "/organizer-dashboard";
            }, 2000);

        } catch (error: any) {
            console.error("Submission Error:", error);
            setStatus({ type: "error", message: error.message || "An error occurred during submission" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">


            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                {/* Card 1: Basic Information */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-[#991b1b] mb-1">Basic Information</h2>
                        <p className="text-sm text-gray-500 font-medium">Tell us about your event</p>
                    </div>

                    {/* Event Title */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Event Title</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="e.g., Annual Islamic Conference 2025"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Banner Upload */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Event Banner</label>
                        {form.bannerPreview && (
                            <div className="mt-2 mb-4 relative group">
                                <img src={form.bannerPreview} alt="Current banner" className="w-full h-48 object-cover rounded-2xl border border-gray-200 shadow-sm" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                                    <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/60 rounded-full">Current Banner</span>
                                </div>
                            </div>
                        )}
                        <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 hover:bg-red-50/30 transition-all cursor-pointer group">
                            <input
                                name="banner"
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-red-50 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 w-6 h-6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">{form.bannerPreview ? 'Click to upload new banner' : 'Click to upload banner image'}</p>
                                <p className="text-xs text-gray-400 mt-1">Recommended: 1920x1080px (16:9 ratio), Max size 2.5MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail Option */}
                    <div className="bg-gray-50/50 rounded-2xl p-5 space-y-4 border border-gray-100">
                        <label className="text-sm font-semibold text-gray-700">Event Thumbnail</label>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="thumbnailType"
                                    value="same"
                                    checked={form.thumbnailType === "same"}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-700">Use same image as banner</span>
                                    <span className="text-xs text-gray-400">The banner image will be used for event cards on the home page</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="thumbnailType"
                                    value="different"
                                    checked={form.thumbnailType === "different"}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-700">Use different thumbnail image</span>
                                    <span className="text-xs text-gray-400">Upload a separate image for event cards (Recommended: square or 4:3 ratio)</span>
                                </div>
                            </label>
                        </div>

                        {form.thumbnailType === "different" && (
                            <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-white transition-all cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            thumbnail: e.target.files?.[0] || null,
                                        }))
                                    }
                                />
                                <div className="flex flex-col items-center">
                                    <div className="p-2 bg-gray-100 rounded-full mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                    </div>
                                    <p className="text-xs font-medium text-gray-600">Upload thumbnail image</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <div className="relative">
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none appearance-none transition-all"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-red-100 focus-within:border-red-400 transition-all">
                            <SimpleEditor
                                onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
                                initialValue={form.description}
                            />
                        </div>
                    </div>

                    {/* Organizer */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Event Organiser (Optional)</label>
                        <div className="relative">
                            <input
                                type="text"
                                name="organizerName"
                                value={form.organizerName}
                                onChange={handleChange}
                                placeholder="Ahmed Hassan"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 px-1 italic">Leave blank to show \"Ahmed Hassan\" as the organizer</p>
                    </div>

                    {/* Date and Time Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FaRegCalendarAlt className="text-gray-400 w-3.5 h-3.5" />
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FaRegCalendarAlt className="text-gray-400 w-3.5 h-3.5" />
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FaRegClock className="text-gray-400 w-3.5 h-3.5" />
                                Start Time
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <FaRegClock className="text-gray-400 w-3.5 h-3.5" />
                                End Time
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Event Type Section (Part of Card 1 footer in image) */}
                    <div className="pt-6 border-t border-gray-100">
                        <EventType form={form} setForm={setForm} onlyToggle={true} />
                    </div>
                </div>

                {/* Card 2: Event Location (Conditional) */}
                <EventType form={form} setForm={setForm} onlyLocation={true} />

                {/* Card 3: Ticket Types */}
                <TicketSection tickets={tickets} setTickets={setTickets} />

                {/* Status Messages */}
                {status.message && (
                    <div className={`p-4 rounded-2xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        <div className="flex items-center gap-2">
                            {status.type === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            )}
                            {status.message}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                        type="button"
                        className="px-6 py-2.5 rounded-full border border-gray-200 text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        Preview Event
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#dc2626] to-[#991b1b] hover:from-[#b91c1c] hover:to-[#7f1d1d] transition-all shadow-md flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95'}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                {isEditMode ? 'Updating...' : 'Publishing...'}
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                {isEditMode ? 'Update Event' : 'Review & Publish'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
