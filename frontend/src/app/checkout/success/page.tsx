"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { QRCodeSVG } from "qrcode.react";
import { Download, Mail, Share2, Home, CheckCircle2, MapPin, Calendar, Clock } from "lucide-react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get("bookingId");
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
                // 1. Fetch booking details
                const res = await fetch(`${baseUrl}/api/bookings/${bookingId}`);
                let data = await res.json();
                
                // 2. If booking is still pending, trigger a verification with Stripe via our new endpoint
                if (data && data.payment_status === 'pending') {
                    console.log("Booking is pending, verifying status with Stripe...");
                    const verifyRes = await fetch(`${baseUrl}/api/payments/booking/${bookingId}/verify`, { method: 'POST' });
                    const verifyData = await verifyRes.json();
                    
                    if (verifyData.success && verifyData.status === 'paid') {
                        // Re-fetch or update local state to reflect 'paid' status
                        const updatedRes = await fetch(`${baseUrl}/api/bookings/${bookingId}`);
                        data = await updatedRes.json();
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

    if (loading) return (
        <div className="min-h-screen bg-[#fff9fa] flex flex-col items-center justify-center p-6 text-center">
            <div className="relative mb-8">
                {/* Outer glowing ring */}
                <div className="absolute inset-0 bg-red-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                {/* Main Spinner */}
                <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <CheckCircle2 size={32} className="text-red-600 animate-bounce" />
                    </div>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-red-900 mb-2">Verifying Your Booking</h2>
            <p className="text-gray-500 font-medium animate-pulse">
                Please wait while we finalize your tickets...
            </p>
        </div>
    );
    if (!booking) return (
        <div className="min-h-screen bg-[#fff9fa] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-10 rounded-[32px] shadow-2xl shadow-red-100/50 max-w-sm w-full border border-red-50">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-red-300" style={{ transform: 'rotate(45deg)' }} />
                </div>
                <h2 className="text-2xl font-bold text-red-900 mb-2">Booking Not Found</h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                    We couldn't find the details for this booking. If you believe this is an error, please contact support or check your email.
                </p>
                <button 
                    onClick={() => router.push('/')}
                    className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );

    const handleDownload = () => {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        window.open(`${baseUrl}/api/payments/booking/${bookingId}/download`, "_blank");
    };

    const handleEmail = async () => {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        try {
            const res = await fetch(`${baseUrl}/api/payments/booking/${bookingId}/resend-email`, { method: "POST" });
            const data = await res.json();
            if (data.success) alert("Tickets emailed successfully!");
        } catch (e) {
            alert("Failed to email tickets");
        }
    };

    return (
        <div className="bg-[#fff9fa]  font-sans">
            <Header />

            <main className="max-w-xl mx-auto px-6 py-12">
                <div className="bg-white rounded-[32px] shadow-2xl shadow-red-100/50 overflow-hidden border border-red-50">
                    {/* TOP CONFIRMATION BANNER */}
                    <div className="bg-red-600 p-10 text-white text-center relative overflow-hidden">
                        {/* Decorative Icons (simplified placeholders for the screenshot's confetti/icons) */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute top-4 left-4 rotate-12"><Calendar size={60} /></div>
                            <div className="absolute bottom-4 right-4 -rotate-12"><Calendar size={60} /></div>
                        </div>

                        <div className="flex justify-center mb-6">
                            <div className="bg-white/20 p-5 rounded-full backdrop-blur-md">
                                <Calendar size={40} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-3 tracking-tight">Booking Confirmed!</h1>
                        <p className="text-red-100 text-sm font-medium">Your tickets have been sent to {booking.customer_email}</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* BOOKING REFERENCE */}
                        <div className="text-center space-y-1">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Main Booking Reference</p>
                            <p className="text-2xl font-black text-red-900 tracking-tight">{booking.booking_reference}</p>
                        </div>

                        {/* EVENT DETAILS CARD */}
                        <div className="bg-[#fff5f6] rounded-3xl p-8 space-y-6">
                            <h2 className="text-xl font-bold text-red-800 leading-tight">{booking.event_name}</h2>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Date</p>
                                    <p className="text-sm font-bold text-gray-700">
                                        {new Date(booking.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Time</p>
                                    <p className="text-sm font-bold text-gray-700">{booking.event_time || '11:00 AM - 7:00 PM'}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Location</p>
                                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                                    {booking.event_venue}<br />
                                    <span className="text-gray-500 font-medium">{booking.event_location}</span>
                                </p>
                            </div>
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleDownload}
                                    className="bg-red-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-100"
                                >
                                    <Download size={18} />
                                    Download Tickets
                                </button>
                                <button
                                    onClick={handleEmail}
                                    className="bg-white text-gray-700 border border-gray-200 py-4 rounded-xl font-bold text-sm hover:border-red-200 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Mail size={18} />
                                    Email Tickets
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                                <button
                                    className="w-full sm:w-auto bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-sm hover:border-red-200 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Share2 size={18} />
                                    Share Event
                                </button>
                                <button
                                    onClick={() => router.push('/')}
                                    className="text-red-600 font-bold text-sm hover:underline"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>

                        {/* IMPORTANT INFO BOX */}
                        <div className="bg-[#fffbea] rounded-2xl border border-yellow-100 p-6">
                            <h3 className="text-sm font-bold text-yellow-800 mb-3">Important Information</h3>
                            <ul className="space-y-2 text-xs text-yellow-700 font-medium leading-relaxed">
                                <li className="flex gap-2"><span>•</span> Present your ticket at the event entrance</li>
                                <li className="flex gap-2"><span>•</span> Arrive 15 minutes before the event starts</li>
                                <li className="flex gap-2"><span>•</span> Tickets are non-refundable but transferable</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div>Loading success page...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
