"use client";
import { useState, useEffect } from "react";
import SimpleEditor from "@/Components/SimpleEditor";
import { BsCalendar4Event } from "react-icons/bs";
import { FaRegCalendarAlt, FaRegClock } from "react-icons/fa";
import EventType from "@/Components/EventType";
import TicketSection from "@/Components/TicketSection";
import { useAuth } from "@/context/authContext";
import ReviewModal from "./EventPublishing/ReviewModal";
import FullEventPreview from "./EventPublishing/FullEventPreview";
import BecomeOrganizerModal from "./EventPublishing/BecomeOrganizerModal";
import PublishSuccess from "./EventPublishing/PublishSuccess";
import { useRouter } from "next/navigation";
import CreateOrganisationModal from "@/Components/CreateOrganisationModal";
import { useCurrency } from "@/context/CurrencyContext";

export default function EventForm({ editId }: { editId?: string | null }) {
    const { user, isOrganizer, becomeOrganizer, isStripeConnected } = useAuth();
    const { currentCurrency } = useCurrency();
    const router = useRouter();
    const isEditMode = !!editId && editId !== 'null' && editId !== 'undefined';
    const todayStr = (() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    })();
    const [categories, setCategories] = useState<any[]>([]);
    const [organisations, setOrganisations] = useState<any[]>([]);
    const [isLoadingOrganisations, setIsLoadingOrganisations] = useState(false);

    // Modal states
    const [showReview, setShowReview] = useState(false);
    const [showBecomeOrganizer, setShowBecomeOrganizer] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [publishedEventId, setPublishedEventId] = useState("");
    const [publishedEventSlug, setPublishedEventSlug] = useState("");
    const [showCreateOrg, setShowCreateOrg] = useState(false);
    const [form, setForm] = useState<{
        title: string;
        category: string;
        description: string;
        organizer: string;
        organizerProfile: string;
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
        thumbnailPreview: string;
        lat?: number;
        lng?: number;
    }>({
        title: "",
        category: "",
        description: "",
        organizer: user?._id || "",
        organizerProfile: "",
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
        country: "United Kingdom",
        meetingLink: "",
        bannerPreview: "",
        thumbnailPreview: "",
        lat: undefined as number | undefined,
        lng: undefined as number | undefined,
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

    // Load saved form data from localStorage on mount
    useEffect(() => {
        if (isEditMode) return;
        const savedForm = localStorage.getItem('event_form_draft');
        const savedTickets = localStorage.getItem('event_tickets_draft');

        if (savedForm) {
            try {
                const parsed = JSON.parse(savedForm);
                
                // Clear invalid/expired blob preview URLs and empty serialized File objects
                if (parsed.bannerPreview && parsed.bannerPreview.startsWith('blob:')) {
                    parsed.banner = null;
                    parsed.bannerPreview = "";
                } else if (parsed.banner && typeof parsed.banner === 'object' && !(parsed.banner instanceof File)) {
                    parsed.banner = null;
                }
                
                if (parsed.thumbnailPreview && parsed.thumbnailPreview.startsWith('blob:')) {
                    parsed.thumbnail = null;
                    parsed.thumbnailPreview = "";
                } else if (parsed.thumbnail && typeof parsed.thumbnail === 'object' && !(parsed.thumbnail instanceof File)) {
                    parsed.thumbnail = null;
                }

                setForm(prev => ({ ...prev, ...parsed }));
            } catch (e) { console.error("Error loading saved form", e); }
        }

        if (savedTickets) {
            try {
                setTickets(JSON.parse(savedTickets));
            } catch (e) { console.error("Error loading saved tickets", e); }
        }
    }, [isEditMode]);

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        if (isEditMode) return;
        localStorage.setItem('event_form_draft', JSON.stringify(form));
        localStorage.setItem('event_tickets_draft', JSON.stringify(tickets));
    }, [form, tickets, isEditMode]);

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                organizer: user._id,
                organizerName: prev.organizerName || user.username
            }));
        }
    }, [user]);

    // Handle form reset when editId is not present, or fetch existing event data when in edit mode
    useEffect(() => {
        if (!editId || editId === 'null' || editId === 'undefined') {
            // Reset to initial create state
            setForm({
                title: "",
                category: "",
                description: "",
                organizer: user?._id || "",
                organizerProfile: "",
                organizerName: user?.username || "",
                startDate: "",
                endDate: "",
                startTime: "",
                endTime: "",
                eventType: "in-person",
                thumbnailType: "same",
                thumbnail: null,
                banner: null,
                venue: "",
                address: "",
                city: "",
                postcode: "",
                country: "United Kingdom",
                meetingLink: "",
                bannerPreview: "",
                thumbnailPreview: "",
                lat: undefined,
                lng: undefined,
            });
            setTickets([
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
            return;
        }

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
                        organizerProfile: ev.organizerProfile || '',
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
                        country: ev.location?.country === 'UK' ? 'United Kingdom' : (ev.location?.country || 'United Kingdom'),
                        meetingLink: ev.meetingLink || '',
                        bannerPreview: ev.banner || '',
                        thumbnailPreview: ev.thumbnail || '',
                        lat: ev.location?.geometry?.coordinates?.[1],
                        lng: ev.location?.geometry?.coordinates?.[0],
                    }));

                    // Pre-fill tickets if available
                    if (ev.ticketTypes && ev.ticketTypes.length > 0) {
                        const mappedTickets = ev.ticketTypes.map((t: any) => {
                            const startD = t.saleStart ? new Date(t.saleStart) : null;
                            const endD = t.saleEnd ? new Date(t.saleEnd) : null;
                            const priceInActiveCurrency = t.price ? Number((Number(t.price) * currentCurrency.rate).toFixed(2)) : 0;
                            return {
                                ...t,
                                price: priceInActiveCurrency,
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
    }, [editId, user]);

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

    const fetchOrganisations = async () => {
        try {
            setIsLoadingOrganisations(true);
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const token = localStorage.getItem("token");
            const res = await fetch(`${baseUrl}/api/dashboard/organizer/organisations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const result = await res.json();
            if (result.success) {
                setOrganisations(result.data);
            }
        } catch (error) {
            console.error("❌ Failed to fetch organisations:", error);
        } finally {
            setIsLoadingOrganisations(false);
        }
    };

    const handleOrgSuccess = (newOrg: any) => {
        setOrganisations(prev => [...prev, newOrg]);
        setForm(prev => ({
            ...prev,
            organizerProfile: newOrg._id,
            organizerName: newOrg.name
        }));
    };

    useEffect(() => {
        fetchCategories();
        fetchOrganisations();
    }, []);

    const getImageUrl = (url: string) => {
        if (!url) return "";
        if (url.startsWith('http') || url.startsWith('blob:')) return url;
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "startDate") {
                if (!prev.endDate || prev.endDate < value) {
                    updated.endDate = value;
                }
                if (updated.endDate === value && updated.startTime && updated.endTime && updated.endTime < updated.startTime) {
                    updated.endTime = updated.startTime;
                }
            }
            if (name === "startTime") {
                if (updated.startDate === updated.endDate && updated.endTime && updated.endTime < value) {
                    updated.endTime = value;
                }
            }
            if (name === "endDate") {
                if (updated.startDate && value < updated.startDate) {
                    updated.endDate = updated.startDate;
                }
                if (updated.startDate === updated.endDate && updated.startTime && updated.endTime && updated.endTime < updated.startTime) {
                    updated.endTime = updated.startTime;
                }
            }
            if (name === "endTime") {
                if (updated.startDate === updated.endDate && updated.startTime && value < updated.startTime) {
                    updated.endTime = updated.startTime;
                }
            }
            return updated;
        });
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

    const validateForm = (isDraft = false) => {
        if (isDraft) {
            if (!form.title) {
                setStatus({ type: "error", message: "Please provide an Event Title to save as a draft." });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return false;
            }
            return true;
        }

        const required = [
            { field: 'title', label: 'Event Title' },
            { field: 'category', label: 'Category' },
            { field: 'description', label: 'Description' },
            { field: 'startDate', label: 'Start Date' },
            { field: 'endDate', label: 'End Date' },
            { field: 'startTime', label: 'Start Time' },
            { field: 'endTime', label: 'End Time' },
            { field: 'organizerProfile', label: 'Organiser Profile' },
        ];

        const missing = required.filter(r => !form[r.field as keyof typeof form]);

        if (missing.length > 0) {
            setStatus({ type: "error", message: `Please complete the following fields: ${missing.map(m => m.label).join(', ')}` });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }

        if (form.startDate && form.startTime && form.endDate && form.endTime) {
            const startDateTime = new Date(`${form.startDate}T${form.startTime}`);
            const endDateTime = new Date(`${form.endDate}T${form.endTime}`);
            if (endDateTime <= startDateTime) {
                setStatus({ type: "error", message: "Event End Date & Time must be after Start Date & Time." });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return false;
            }
        }

        if (form.eventType === 'in-person') {
            if (!form.venue || !form.address || !form.city || !form.postcode) {
                setStatus({ type: "error", message: "Please complete all location fields for in-person events." });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return false;
            }
        } else if (form.eventType === 'online' && !form.meetingLink) {
            setStatus({ type: "error", message: "Please provide a meeting link for online events." });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }

        if (!form.bannerPreview && !form.banner) {
            setStatus({ type: "error", message: "Please upload an event banner image." });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }

        if (form.thumbnailType === 'different' && !form.thumbnailPreview && !form.thumbnail) {
            setStatus({ type: "error", message: "Please upload a thumbnail image." });
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }

        if (tickets.length === 0) {
            setStatus({ type: "error", message: "Please add at least one ticket type." });
            return false;
        }

        for (const ticket of tickets) {
            if (!ticket.name || ticket.price === undefined || ticket.quantity === undefined) {
                setStatus({ type: "error", message: "Please complete all ticket details (Name, Price, Quantity)." });
                return false;
            }
            if (!ticket.saleStartDate || !ticket.saleStartTime || !ticket.saleEndDate || !ticket.saleEndTime) {
                setStatus({ type: "error", message: `Please fill in all sales start and end dates/times for ticket: "${ticket.name || 'Untitled'}".` });
                return false;
            }
            
            // Check that ticket sales start is before sales end
            const saleStart = new Date(`${ticket.saleStartDate}T${ticket.saleStartTime}`);
            const saleEnd = new Date(`${ticket.saleEndDate}T${ticket.saleEndTime}`);
            if (saleEnd <= saleStart) {
                setStatus({ type: "error", message: `Ticket "${ticket.name}" sales end date/time must be after its start date/time.` });
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: any) => {
        if (e) e.preventDefault();
        if (!validateForm(false)) return;
        setShowReview(true);
    };

    const handleSaveDraft = async () => {
        if (!validateForm(true)) return;
        await confirmPublish(false, true);
    };

    const handlePreview = () => {
        if (!validateForm(false)) return;

        const previewData = {
            ...form,
            banner: form.bannerPreview,
            thumbnail: form.thumbnailPreview,
            ticketTypes: tickets,
            organizer: user,
            organizerName: form.organizerName,
            category: categories.find(c => c._id === form.category)
        };

        sessionStorage.setItem("event_preview", JSON.stringify(previewData));
        window.open(`/event/preview?preview=true`, "_blank");
    };

    const confirmPublish = async (isBypassingRoleCheck = false, isDraft = false) => {
        if (!isOrganizer && !isBypassingRoleCheck) {
            setShowReview(false);
            setShowBecomeOrganizer(true);
            return;
        }

        if (!isDraft && !isStripeConnected && !isEditMode) {
            setStatus({ type: "error", message: "Please connect your Stripe account in the Organizer Dashboard before publishing." });
            setShowReview(false);
            return;
        }

        setLoading(true);
        setStatus({ type: "", message: "" });
        setShowReview(false);

        try {
            let bannerUrl = form.bannerPreview;
            let thumbnailUrl = "";

            // 1. Handle Banner Upload (if file is selected)
            if (form.banner instanceof File) {
                bannerUrl = await handleUpload(form.banner);
            } else if (bannerUrl && bannerUrl.startsWith('blob:')) {
                throw new Error("The event banner image could not be uploaded because the file session has expired. Please re-upload your event banner.");
            }

            // 2. Handle Thumbnail Upload
            if (form.thumbnailType === "different") {
                if (form.thumbnail instanceof File) {
                    thumbnailUrl = await handleUpload(form.thumbnail as unknown as File);
                } else if (form.thumbnailPreview && form.thumbnailPreview.startsWith('blob:')) {
                    throw new Error("The thumbnail image could not be uploaded because the file session has expired. Please re-upload your thumbnail.");
                } else {
                    thumbnailUrl = form.thumbnailPreview;
                }
            } else {
                thumbnailUrl = bannerUrl;
            }

            // 3. Prepare Event Data
            const formattedTickets = tickets.map(t => {
                const saleStart = t.saleStartDate && t.saleStartTime ? `${t.saleStartDate}T${t.saleStartTime}:00` : null;
                const saleEnd = t.saleEndDate && t.saleEndTime ? `${t.saleEndDate}T${t.saleEndTime}:00` : null;
                const priceInBase = t.price ? Number((Number(t.price) / currentCurrency.rate).toFixed(2)) : 0;
                return {
                    ...t,
                    price: priceInBase,
                    saleStart,
                    saleEnd
                };
            });

            const selectedCategory = categories.find(c => c._id === form.category);

            const eventData = {
                ...form,
                status: isDraft ? 'draft' : 'published',
                banner: bannerUrl || (isEditMode ? undefined : ""),
                thumbnail: thumbnailUrl || (isEditMode ? undefined : ""),
                ticketTypes: formattedTickets,
                location: {
                    venueName: form.venue,
                    address: form.address,
                    city: form.city,
                    postcode: form.postcode,
                    country: form.country,
                    geometry: form.lat && form.lng ? {
                        type: "Point",
                        coordinates: [form.lng, form.lat]
                    } : undefined
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

            if (isEditMode) {
                setStatus({ type: "success", message: isDraft ? "Draft updated successfully! Redirecting..." : "Event updated successfully! Redirecting..." });
                setTimeout(() => {
                    router.push("/organizer-dashboard");
                }, 2000);
            } else {
                if (isDraft) {
                    setStatus({ type: "success", message: "Draft event created successfully! Redirecting..." });
                    localStorage.removeItem('event_form_draft');
                    localStorage.removeItem('event_tickets_draft');
                    setTimeout(() => {
                        router.push("/organizer-dashboard");
                    }, 2000);
                } else {
                    const event = data.data || data;
                    setPublishedEventId(event._id);
                    setPublishedEventSlug(event.slug || event._id);
                    setShowSuccess(true);

                    // Clear drafts
                    localStorage.removeItem('event_form_draft');
                    localStorage.removeItem('event_tickets_draft');
                }
            }

        } catch (error: any) {
            console.error("Submission Error:", error);
            setStatus({ type: "error", message: error.message || "An error occurred during submission" });
        } finally {
            setLoading(false);
        }
    };

    const handleConvertAndPublish = async () => {
        try {
            setLoading(true);
            const result = await becomeOrganizer();
            if (result.success) {
                setShowBecomeOrganizer(false);
                // Now that they are an organizer, publish
                // We need to wait a bit for context to update or just bypass the check
                await confirmPublish(true);
            } else {
                setStatus({ type: "error", message: result.message || "Failed to convert account" });
            }
        } catch (err) {
            console.error("Conversion error:", err);
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
                            className="w-full border border-gray-200 borborder rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                            required
                        />
                    </div>

                    {/* Banner Upload */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Event Banner</label>
                        {form.bannerPreview && (
                            <div className="mt-2 mb-4 relative group">
                                <img src={getImageUrl(form.bannerPreview)} alt="Current banner" className="w-full h-48 object-cover rounded-2xl border border-gray-200 shadow-sm" />
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
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file);
                                        setForm(prev => ({
                                            ...prev,
                                            banner: file,
                                            bannerPreview: previewUrl
                                        }));
                                    }
                                }}
                            />
                            <div className="flex flex-col items-center">
                                <div className="p-3 bg-red-50 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 w-6 h-6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                </div>
                                <p className="text-sm font-semibold text-gray-700">{form.bannerPreview ? 'Click to upload new banner' : 'Click to upload banner image'}</p>
                                <p className="text-xs text-gray-400 mt-1">Recommended: 1080x1920px (9:16 ratio), Max size 2.5MB</p>
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
                            <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-white transition-all cursor-pointer relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const previewUrl = URL.createObjectURL(file);
                                            setForm(prev => ({
                                                ...prev,
                                                thumbnail: file,
                                                thumbnailPreview: previewUrl
                                            }));
                                        }
                                    }}
                                />
                                {form.thumbnailPreview ? (
                                    <div className="flex flex-col items-center">
                                        <img src={getImageUrl(form.thumbnailPreview)} alt="Thumbnail preview" className="w-20 h-20 object-cover rounded-lg mb-2 shadow-sm" />
                                        <p className="text-xs font-medium text-red-600">Change thumbnail</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="p-2 bg-gray-100 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                        </div>
                                        <p className="text-xs font-medium text-gray-600">Upload thumbnail image</p>
                                    </div>
                                )}
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
                                className="w-full border borborder border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none appearance-none transition-all"
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
                            <select
                                name="organizerProfile"
                                value={form.organizerProfile}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "new") {
                                        setShowCreateOrg(true);
                                        return;
                                    }
                                    const selectedOrg = organisations.find(o => o._id === val);
                                    setForm(prev => ({
                                        ...prev,
                                        organizerProfile: val,
                                        organizerName: selectedOrg ? selectedOrg.name : ""
                                    }));
                                }}
                                className="w-full border borborder border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all appearance-none"
                                required
                            >
                                <option value="" disabled>Select an Organisation Profile</option>
                                {organisations.map(org => (
                                    <option key={org._id} value={org._id}>{org.name}</option>
                                ))}
                                <option value="new" className="text-red-600 font-bold">+ Create New Organisation Profile</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
                            </div>
                        </div>


                        {form.organizerProfile === "" && (
                            <p className="text-[10px] text-red-500 mt-1 px-1 italic">Please select or create an organisation profile to list this event.</p>
                        )}
                        {form.organizerProfile !== "" && form.organizerProfile !== "new" && (
                            <p className="text-[10px] text-green-600 mt-1 px-1 italic font-medium">Professional Listing: {form.organizerName}</p>
                        )}
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
                                min={todayStr}
                                value={form.startDate}
                                onChange={handleChange}
                                className="w-full border borborder border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
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
                                min={form.startDate || todayStr}
                                value={form.endDate}
                                onChange={handleChange}
                                className="w-full border borborder border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
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
                                className="w-full border borborder border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
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
                                min={form.startDate === form.endDate ? form.startTime : undefined}
                                value={form.endTime}
                                onChange={handleChange}
                                className="w-full border borborder border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Event Type Section (Part of Card 1 footer in image) */}
                    <div className=" border p-6 border-gray-100 borborder rounded-xl">
                        <EventType form={form} setForm={setForm} onlyToggle={true} />
                    </div>
                </div>

                {/* Card 2: Event Location (Conditional) */}
                <EventType form={form} setForm={setForm} onlyLocation={true} />

                {/* Card 3: Ticket Types */}
                <TicketSection 
                    tickets={tickets} 
                    setTickets={setTickets} 
                    eventStartDate={form.startDate} 
                    eventStartTime={form.startTime} 
                />

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
                        onClick={handleSaveDraft}
                        disabled={loading}
                        className={`px-8 py-2.5 rounded-full text-sm font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95'}`}
                    >
                        Save as Draft
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
                                {isEditMode ? 'Preview and Update Event' : 'Preview and Publish Event'}
                            </>
                        )}
                    </button>
                </div>
            </form>

            <FullEventPreview
                isOpen={showReview}
                onClose={() => setShowReview(false)}
                onPublish={confirmPublish}
                eventData={{
                    ...form,
                    categoryName: categories.find(c => c._id === form.category)?.name
                }}
                tickets={tickets}
                organisations={organisations}
                isEditMode={isEditMode}
            />

            <BecomeOrganizerModal
                isOpen={showBecomeOrganizer}
                onClose={() => setShowBecomeOrganizer(false)}
                onConvert={handleConvertAndPublish}
            />

            <CreateOrganisationModal
                isOpen={showCreateOrg}
                onClose={() => setShowCreateOrg(false)}
                onSuccess={handleOrgSuccess}
            />

            {showSuccess && (
                <PublishSuccess
                    onClose={() => setShowSuccess(false)}
                    eventId={publishedEventId}
                    slug={publishedEventSlug}
                    eventName={form.title}
                />
            )}
        </div>
    );
}
