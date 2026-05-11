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
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Actions */}
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-gray-100 h-9 px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Back to My Tickets
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-9 px-4 py-2 rounded-xl shadow-lg shadow-red-200"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </button>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-normal text-gray-900 mb-2">Ticket Preview</h1>
                    <p className="text-gray-600">Your event ticket (PDF format)</p>
                </div>

                {/* Ticket Design */}
                <div className="bg-white shadow-2xl rounded-lg p-3 sm:p-6 md:p-8 lg:p-12">
                    <div className="relative bg-gradient-to-br from-red-50 to-white border-2 sm:border-4 border-red-600 rounded-2xl sm:rounded-3xl overflow-hidden">
                        {/* Perforation Dots - Left */}
                        <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-6 bg-red-600 flex flex-col items-center justify-around py-2 sm:py-4">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            ))}
                        </div>

                        {/* Ticket Content */}
                        <div className="px-8 sm:px-12 md:px-16 py-6 sm:py-8 md:py-10">
                            {/* Ticket Header */}
                            <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-red-200 gap-2">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-red-900 text-lg sm:text-xl font-normal">HalalBrite</h2>
                                        <p className="text-red-600 text-xs sm:text-sm font-medium uppercase tracking-wider">Event Ticket</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-gray-500 text-[10px] font-normal uppercase tracking-widest">Ticket #</p>
                                    <p className="text-gray-900 text-sm font-normal tracking-wide">TKT-{booking.booking_reference?.split('-')[1] || booking.booking_reference?.slice(-8) || "N/A"}</p>
                                </div>
                            </div>

                            {/* Event Title */}
                            <div className="mb-6 sm:mb-8">
                                <h1 className="text-red-900 mb-3 text-xl sm:text-2xl md:text-3xl font-medium leading-tight">{eventName}</h1>
                                <div className="inline-block bg-red-600 text-white px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider">
                                    {booking.ticket_name?.split(' ')[0] || "General Admission"}
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Date</p>
                                        <p className="text-gray-900 text-sm sm:text-base font-bold">{dateStr}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Time</p>
                                        <p className="text-gray-900 text-sm sm:text-base font-bold">{timeStr}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 sm:col-span-2">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Location</p>
                                        <p className="text-gray-900 text-sm sm:text-base font-bold">{venueName}</p>
                                        <p className="text-gray-500 text-xs sm:text-sm mt-0.5">{addressStr}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Details Box */}
                            <div className="bg-white border-2 border-red-200 rounded-2xl p-5 sm:p-6 mb-8 shadow-sm">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Ticket className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Ticket Details</p>
                                        <div className="space-y-2">
                                            {booking.items && booking.items.length > 0 ? (
                                                booking.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-600 font-medium">{item.ticket_name}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-900 text-sm sm:text-base font-medium leading-relaxed">
                                                    {booking.ticket_name || "Access to all conference sessions and networking areas"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-red-200">
                                    <div>
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Quantity</p>
                                        <p className="text-gray-900 text-sm sm:text-base font-black">{booking.quantity || 1} ticket(s)</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Price Paid</p>
                                        <p className="text-gray-900 text-sm sm:text-base font-black flex items-center justify-end gap-1">
                                            £ {booking.amount_total?.toFixed(2) || "0.00"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Holder */}
                            <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-300 rounded-2xl p-5 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-1">Ticket Holder</p>
                                        <p className="text-red-900 text-sm sm:text-base font-black">{booking.customer_name || "Valued Customer"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Reference */}
                            <div className="mb-8">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 text-center">Booking Reference</p>
                                <p className="text-gray-900 text-center tracking-[0.2em] text-sm sm:text-base font-black">{booking.booking_reference}</p>
                            </div>

                            {/* Perforation Line */}
                            {/* 

                           <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t-2 border-dashed border-red-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-gray-500 text-xs font-bold uppercase tracking-widest">Scan at entrance</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="inline-block bg-white border-2 sm:border-4 border-red-600 rounded-2xl p-4 sm:p-6 shadow-xl max-w-full">
                                    <div className="bg-white p-2 rounded-xl mb-3 sm:mb-4">
                                        <QRCodeSVG
                                            value={booking.booking_reference || "N/A"}
                                            size={200}
                                            className="mx-auto"
                                        />
                                    </div>
                                    <p className="text-gray-600 text-xs sm:text-sm font-bold leading-relaxed px-2">
                                        Please present this ticket at the event entrance
                                    </p>
                                </div>
                            </div> */}

                            {/* Support Footer */}
                            <div className="mt-10 pt-6 border-t-2 border-red-200 text-center">
                                <p className="text-gray-500 text-xs sm:text-sm mb-2 font-medium">
                                    For support or inquiries, contact: <span className="text-red-600 font-bold">support@halalbrite.com</span>
                                </p>
                                <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                                    This ticket is non-refundable but transferable. Valid for one-time entry only.
                                </p>
                            </div>
                        </div>

                        {/* Perforation Dots - Right */}
                        <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-6 bg-red-600 flex flex-col items-center justify-around py-2 sm:py-4">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Important Information Section */}
                <div className="mt-8 bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-20">
                    <h3 className="text-amber-900 text-lg font-black mb-4 flex items-center gap-3 uppercase tracking-tight">
                        <span className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-black">!</span>
                        Important Information
                    </h3>
                    <ul className="text-amber-800 text-sm sm:text-base space-y-3 font-medium">
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-black">•</span>
                            This is a digital ticket. You can print it or display it on your mobile device.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-black">•</span>
                            Each ticket contains a unique code for entry verification.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-black">•</span>
                            Please arrive at least 15 minutes before the event start time.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-black">•</span>
                            The ticket holder's name must match their ID for entry.
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-500 font-black">•</span>
                            Screenshots or photocopies may not be accepted. Please show the original PDF.
                        </li>
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
