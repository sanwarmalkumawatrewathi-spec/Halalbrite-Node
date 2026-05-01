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
        <div className="min-h-screen bg-[#fef3f6] flex items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-7xl bg-white rounded-2xl shadow p-6 space-y-6"
            >
                {/* Header */}
                <div>
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    <p className="text-sm text-gray-500">Tell us about your event</p>
                </div>

                {/* Event Title */}
                <div>
                    <label className="text-sm font-medium">Event Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g., Annual Islamic Conference 2025"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-200"
                    />
                </div>


                {/* Banner Upload */}
        <div>
          <label className="text-sm font-medium">Event Banner</label>
          {/* Show current banner preview in edit mode */}
          {form.bannerPreview && (
            <div className="mt-2 mb-3 relative">
              <img src={form.bannerPreview} alt="Current banner" className="w-full h-40 object-cover rounded-xl border border-gray-200" />
              <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">Current Banner</span>
            </div>
          )}
          <div className="mt-2 border-2 border-dashed rounded-xl p-6 text-center text-gray-400 cursor-pointer hover:bg-gray-50">
            <div className="text-2xl">⬆️</div>
            <p className="text-xs mt-1">{form.bannerPreview ? 'Upload new banner to replace' : 'Click to upload banner image'}</p>
            <input name="banner" type="file" accept="image/*" className="text-sm mt-2" />
          </div>
        </div>

                {/* Thumbnail */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Event Thumbnail</label>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="thumbnailType"
                            value="same"
                            checked={form.thumbnailType === "same"}
                            onChange={handleChange}
                        />
                        Use same image as banner
                    </label>

                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="thumbnailType"
                            value="different"
                            checked={form.thumbnailType === "different"}
                            onChange={handleChange}
                        />
                        Use different thumbnail image
                    </label>

                    {/* 👇 SHOW ONLY IF DIFFERENT */}
                    {form.thumbnailType === "different" && (
                        <div className="mt-2 border-2 border-dashed rounded-xl p-6 text-center text-gray-400 cursor-pointer hover:bg-gray-50">
                            <div className="text-2xl">⬆️</div>

                            <input
                                type="file"
                                className="mt-2 text-sm"
                                onChange={(e) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        thumbnail: e.target.files?.[0] || null,
                                    }))
                                }
                            />
                        </div>
                    )}
                </div>





                {/* Category */}
                <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-medium">Description</label>

                    <SimpleEditor
                        onChange={(value) =>
                            setForm((prev) => ({ ...prev, description: value }))
                        }
                        initialValue={form.description}
                    />
                </div>

                {/* Organizer */}
                <div>
                    <label className="text-sm font-medium">Event Organiser(Optional)</label>
                    <input
                        type="text"
                        name="organizerName"
                        value={form.organizerName}
                        onChange={handleChange}
                        placeholder="Enter organizer name (optional)"
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                </div>

            


<div className="grid grid-cols-2 gap-4">
  {/* Start Date */}
  <div>
    <label className="text-sm font-medium flex items-center gap-2">
      <FaRegCalendarAlt className="text-gray-500" />
      Start Date
    </label>

    <div className="relative mt-1">
      <input
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm appearance-none"
      />
     
    </div>
  </div>

  {/* End Date */}
  <div>
    <label className="text-sm font-medium flex items-center gap-2">
      <FaRegCalendarAlt className="text-gray-500" />
      End Date
    </label>

    <div className="relative mt-1">
      <input
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm appearance-none"
      />
      
    </div>
  </div>
</div>

{/* Time */}
<div className="grid grid-cols-2 gap-4">
  {/* Start Time */}
  <div>
    <label className="text-sm font-medium flex items-center gap-2">
      <FaRegClock className="text-gray-500" />
      Start Time
    </label>

    <div className="relative mt-1">
      <input
        type="time"
        name="startTime"
        value={form.startTime}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm appearance-none"
      />
     
    </div>
  </div>

  {/* End Time */}
  <div>
    <label className="text-sm font-medium flex items-center gap-2">
      <FaRegClock className="text-gray-500" />
      End Time
    </label>

    <div className="relative mt-1">
      <input
        type="time"
        name="endTime"
        value={form.endTime}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm appearance-none"
      />
   
    </div>
  </div>
</div>



                {/* Event Type Toggle */}
                

                <EventType form={form} setForm={setForm} />

                <TicketSection tickets={tickets} setTickets={setTickets} />

{status.message && (
    <div className={`p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
        {status.message}
    </div>
)}

<div className="flex justify-end gap-3 mt-6">
  {/* Preview Button */}
  <button
    type="button"
    className="px-5 py-2 rounded-full border text-sm bg-gray-100 hover:bg-gray-200 transition"
  >
    Preview Event
  </button>

  {/* Review & Publish */}
  <button
    type="submit"
    disabled={loading}
    className={`px-5 py-2 rounded-full text-sm bg-red-600 text-white flex items-center gap-2 hover:bg-red-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {loading ? (isEditMode ? 'Updating...' : 'Publishing...') : (isEditMode ? '✓ Update Event' : '✓ Review & Publish')}
  </button>
</div>

               
            </form>
        </div>
    );
}
