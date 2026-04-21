"use client";
import { useState, useEffect } from "react";
import SimpleEditor from "@/Components/SimpleEditor";
import { BsCalendar4Event } from "react-icons/bs";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import EventType from "@/Components/EventType";
import TicketSection from "@/Components/TicketSection";

import { useAuth } from "@/context/authContext";

export default function EventForm() {
    const { user } = useAuth();
    const [categories, setCategories] = useState<any[]>([]);
    const [form, setForm] = useState({
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
                console.log("🛠️ Fetching categories from:", `${baseUrl}/api/categories`);
                
                const res = await fetch(`${baseUrl}/api/categories`);
                const data = await res.json();
                
                console.log("✅ Categories received:", data);
                
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error("❌ API response is not an array:", data);
                }
            } catch (error) {
                console.error("❌ Failed to fetch categories:", error);
            }
        };
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
            const eventData = {
                ...form,
                banner: bannerUrl,
                thumbnail: thumbnailUrl,
                ticketTypes: tickets,
                location: {
                    venueName: form.venue,
                    address: form.address,
                    city: form.city,
                    postcode: form.postcode,
                    country: form.country
                }
            };

            // 4. Create Event
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const res = await fetch(`${baseUrl}/api/events`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(eventData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create event");

            setStatus({ type: "success", message: "Event created successfully! Redirecting..." });
            setTimeout(() => {
                window.location.href = "/OrganiserDashboard";
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


                {/* Banner Upload (UI only) */}
        <div>
          <label className="text-sm font-medium">Event Banner</label>
          <div className="mt-2 border-2 border-dashed rounded-xl p-6 text-center text-gray-400 cursor-pointer hover:bg-gray-50">
            <div className="text-2xl">⬆️</div>
            <input type="file" className="text-sm mt-2" placeholder="Click to upload banner image"/>
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
    {loading ? 'Publishing...' : '✓ Review & Publish'}
  </button>
</div>

               
            </form>
        </div>
    );
}
