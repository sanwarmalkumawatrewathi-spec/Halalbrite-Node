"use client";

import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Download, Calendar, Clock, MapPin, User, Ticket, Info, ChevronLeft } from "lucide-react";

function TicketPreviewContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get("bookingId");
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
                const res = await fetch(`${baseUrl}/api/bookings/${bookingId}`);
                let result = await res.json();
                let data = result.data || result;

                // Nuclear Option: If event details are missing, fetch them directly
                if (data && data.event_id && (!data.event_name || !data.event_date)) {
                    const eventId = typeof data.event_id === 'string' ? data.event_id : data.event_id._id;
                    const eventRes = await fetch(`${baseUrl}/api/events/${eventId}`);
                    const eventResult = await eventRes.json();
                    const eventData = eventResult.data || eventResult;
                    if (eventData) {
                        data.event = eventData;
                    }
                }

                setBooking(data);
            } catch (error) {
                console.error("Fetch booking error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (bookingId) fetchBooking();
    }, [bookingId]);

    const handleDownloadPdf = async () => {
        if (!booking) return;
        try {
            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
            const response = await fetch(`${baseUrl}/api/payments/booking/${booking._id}/ticket`);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Ticket-${booking.booking_reference}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (err) {
            console.error("PDF Download failed:", err);
            alert("Failed to download PDF. Please try again.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        </div>
    );

    if (!booking) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500 font-medium">Ticket not found.</p>
        </div>
    );

    const eventName = booking.event_name || booking.event?.title || booking.event_id?.title || "Event Confirmed";
    const eventDate = booking.event_date || booking.event?.startDate || booking.event_id?.startDate;
    const dateStr = eventDate ? new Date(eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Check Ticket';
    
    // Time logic
    const startTime = booking.event_time || booking.event?.startTime || booking.event_id?.startTime;
    const endTime = booking.event?.endTime || booking.event_id?.endTime;
    const timeStr = startTime ? (endTime && !startTime.includes('-') ? `${startTime} - ${endTime}` : startTime) : 'See Ticket';

    const venueName = booking.event_venue || booking.event?.location?.venueName || booking.event_id?.location?.venueName || "Venue Confirmed";
    
    // Location/Address logic
    const address = booking.event_location || booking.event?.location?.address || booking.event_id?.location?.address;
    const city = booking.event?.location?.city || booking.event_id?.location?.city;
    const addressStr = address ? (city && !address.includes(city) ? `${address}, ${city}` : address) : (city || "Check Ticket");

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                {/* ACTIONS HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <button 
                            onClick={() => router.back()}
                            className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors mb-2"
                        >
                            <ChevronLeft size={16} />
                            Back to My Tickets
                        </button>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Ticket Preview</h1>
                        <p className="text-sm text-gray-500 font-medium">Your event ticket (PDF format)</p>
                    </div>
                    <button 
                        onClick={handleDownloadPdf}
                        className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Download size={18} />
                        Download PDF
                    </button>
                </div>

                {/* TICKET CONTAINER */}
                <div className="relative mb-12">
                    {/* RED OUTER FRAME WITH DOTS */}
                    <div className="bg-red-600 rounded-[40px] p-2 sm:p-3 relative overflow-hidden shadow-2xl">
                        {/* Side Dots (Perforation look) */}
                        <div className="absolute left-1.5 sm:left-2 top-0 bottom-0 flex flex-col justify-around py-8">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-100" />
                            ))}
                        </div>
                        <div className="absolute right-1.5 sm:right-2 top-0 bottom-0 flex flex-col justify-around py-8">
                            {[...Array(15)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-100" />
                            ))}
                        </div>

                        {/* WHITE TICKET INNER */}
                        <div className="bg-white rounded-[32px] overflow-hidden">
                            <div className="p-6 sm:p-10 space-y-8">
                                {/* Ticket Header */}
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-red-600 p-2 rounded-xl">
                                            <Calendar className="text-white" size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-red-600 font-black text-xl leading-none">HalalBrite</h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Event Ticket</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticket #</p>
                                        <p className="text-xs font-black text-gray-900 tracking-wider">TKT-{booking.booking_reference?.split('-')[1] || booking.booking_reference?.slice(-8) || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Event Info */}
                                <div className="space-y-4">
                                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{eventName}</h1>
                                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                                        {booking.ticket_name?.split(' ')[0] || "Admission"}
                                    </span>
                                </div>

                                {/* Date, Time, Location Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-50 p-2.5 rounded-xl">
                                                <Calendar className="text-red-600" size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
                                                <p className="text-sm font-bold text-gray-900">{dateStr}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 pt-4">
                                            <div className="bg-red-50 p-2.5 rounded-xl">
                                                <MapPin className="text-red-600" size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                                                <p className="text-sm font-bold text-gray-900">{venueName}</p>
                                                <p className="text-xs font-medium text-gray-500">{addressStr}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-50 p-2.5 rounded-xl">
                                                <Clock className="text-red-600" size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</p>
                                                <p className="text-sm font-bold text-gray-900">{timeStr}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ticket & Holder Sections */}
                                <div className="space-y-4 pt-6">
                                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                                <Ticket className="text-red-600" size={14} />
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticket Details</p>
                                        </div>
                                        <div className="space-y-3 mb-4">
                                            {booking.items && booking.items.length > 0 ? (
                                                booking.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600 font-medium">{item.ticket_name} × {item.quantity}</span>
                                                        <span className="text-gray-900 font-bold">£ {(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600 font-medium">{booking.ticket_name || "General Admission"} × {booking.quantity || 1}</span>
                                                    <span className="text-gray-900 font-bold">£ {booking.amount_total?.toFixed(2) || "0.00"}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Quantity</p>
                                                <p className="text-sm font-bold text-gray-900">{booking.quantity || (booking.items?.reduce((acc: any, curr: any) => acc + curr.quantity, 0)) || 1} ticket(s)</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Paid</p>
                                                <p className="text-lg font-black text-gray-900">£ {booking.amount_total?.toFixed(2) || "0.00"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#fff5f6] rounded-2xl p-5 border border-red-50">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-1.5 rounded-lg shadow-sm">
                                                <User className="text-red-600" size={14} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticket Holder</p>
                                                <p className="text-sm font-bold text-gray-900">{booking.customer_name || "Valued Customer"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code & Ref */}
                                <div className="flex flex-col items-center gap-6 pt-10 border-t-2 border-dashed border-gray-200">
                                    <div className="text-center space-y-1">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking Reference</p>
                                        <p className="text-xs font-black text-gray-900 tracking-widest">{booking.booking_reference}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-3xl border-4 border-red-500 shadow-xl">
                                        <QRCodeSVG value={booking.booking_reference || "N/A"} size={160} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-gray-900 uppercase tracking-tighter">Please present this ticket at the event entrance</p>
                                        <div className="flex flex-col gap-1 mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <p>For support or inquiries: support@halalbrite.com</p>
                                            <p>This ticket is non-refundable but transferable. Valid for one-time entry only.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* IMPORTANT INFO */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-[32px] p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-yellow-500 p-2 rounded-xl">
                            <Info className="text-white" size={20} />
                        </div>
                        <h3 className="text-lg font-black text-yellow-900 uppercase tracking-tight">Important Information</h3>
                    </div>
                    <ul className="space-y-4">
                        {[
                            "This is a digital ticket. You can print it or display it on your mobile device.",
                            "Each ticket contains a unique code for entry verification.",
                            "Please arrive at least 15 minutes before the event start time.",
                            "The ticket holder's name must match their ID for entry.",
                            "Screenshots or photocopies may not be accepted. Please show the original PDF."
                        ].map((text, i) => (
                            <li key={i} className="flex gap-3 text-sm font-bold text-yellow-800/80 leading-relaxed">
                                <span className="text-yellow-500 flex-shrink-0">•</span>
                                {text}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function TicketPreview() {
    return (
        <>
            <Header />
            <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
                <TicketPreviewContent />
            </Suspense>
            <Footer />
        </>
    );
}
