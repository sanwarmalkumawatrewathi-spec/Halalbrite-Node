"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { ShieldCheck, MapPin, Calendar, Clock, CreditCard, User, Mail, Phone, Globe, ChevronLeft } from "lucide-react";
import GuestCheckoutModal from "@/Components/GuestCheckoutModal";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/authContext";

function CheckoutContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentCurrency, formatPrice, convertPrice } = useCurrency();
  const { user } = useAuth();
  
  const eventId = params.id;
  const ticketName = searchParams.get("ticket");
  const quantity = parseInt(searchParams.get("qty") || "0");

  const [event, setEvent] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postcode: "",
    country: "United Kingdom"
  });

  const [attendeeNames, setAttendeeNames] = useState<string[]>([]);
  const [useSameName, setUseSameName] = useState(true);
  const [hasAutoFilledAddress, setHasAutoFilledAddress] = useState(false);

  useEffect(() => {
    // Auto-fill form from user data if available
    if (user && !hasAutoFilledAddress) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || ""
      }));
      
      if (user.addresses && user.addresses.length > 0) {
        const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
        setFormData(prev => ({
          ...prev,
          addressLine1: defaultAddr.street || "",
          city: defaultAddr.city || "",
          postcode: defaultAddr.postcode || "",
          country: defaultAddr.country || "United Kingdom"
        }));
      }
      setHasAutoFilledAddress(true);
    }
  }, [user, hasAutoFilledAddress]);

  useEffect(() => {
    // Initialize attendee names based on quantity
    setAttendeeNames(Array(quantity).fill(""));
  }, [quantity]);

  useEffect(() => {
    // If useSameName is true, keep all names in sync with the main fullName
    if (useSameName) {
      setAttendeeNames(Array(quantity).fill(formData.fullName));
    }
  }, [formData.fullName, useSameName, quantity]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        
        // Fetch Event
        const eventRes = await fetch(`${baseUrl}/api/events/${eventId}`);
        const eventData = await eventRes.json();
        setEvent(eventData);

        // Fetch Settings
        const settingsRes = await fetch(`${baseUrl}/api/admin/settings/public`);
        const settingsData = await settingsRes.json();
        setSettings(settingsData.data?.platform);

        // Check Auth
        const token = localStorage.getItem("token");
        if (!token) {
          setShowGuestModal(true);
        } else {
            // Pre-fill if possible (would need a profile fetch here)
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchData();
  }, [eventId]);

  const calcFees = (ticket: any) => {
    if (!ticket || ticket.price === 0 || !settings) return { subtotal: 0, fees: 0, total: 0 };
    
    const feePercentage = settings.feePercentage || 0;
    const fixedFee = settings.fixedFee || 0;
    const vatRate = settings.vatRate || 0;
    const stripePercentage = settings.stripeFeePercentage || 3;
    const fixedStripe = settings.fixedStripeFee || 0.3;

    const platform = ticket.price * (feePercentage / 100) + fixedFee;
    const vat = platform * (vatRate / 100);
    const stripe = ticket.price * (stripePercentage / 100) + fixedStripe;
    const totalFees = platform + vat + stripe;

    return {
        subtotal: ticket.price,
        fees: totalFees,
        total: event?.feePayment === true ? ticket.price : ticket.price + totalFees
    };
  };

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const token = localStorage.getItem("token");

        const response = await fetch(`${baseUrl}/api/payments/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                eventId,
                ticketType: ticketName,
                quantity,
                currency: currentCurrency.code,
                attendeeName: formData.fullName,
                attendeeEmail: formData.email,
                customerPhone: formData.phone,
                attendees: attendeeNames, // Send all attendee names
                addressLine1: formData.addressLine1,
                addressLine2: formData.addressLine2,
                city: formData.city,
                postcode: formData.postcode,
                country: formData.country,
                isGuest: !token
            })
        });

        const result = await response.json();
        if (result.success && result.data?.url) {
            window.location.href = result.data.url;
        } else {
            alert(result.message || "Failed to initiate checkout");
        }
    } catch (error: any) {
        alert(error.message || "Something went wrong");
    } finally {
        setProcessing(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!event || !ticketName) return <div className="min-h-screen flex items-center justify-center text-red-600">Invalid Session</div>;

  const selectedTicket = event.ticketTypes?.find((t: any) => t.name === ticketName);
  const financial = calcFees(selectedTicket);
  const ticketPrice = financial.subtotal;
  const grandTotal = financial.total * quantity;

  return (
    <div className="bg-[#fef3f6] min-h-screen font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-sm mb-8 transition-colors"
        >
          <ChevronLeft size={18} />
          Back to Event
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: ORDER SUMMARY */}
          <div className="lg:col-span-5 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Order Summary</h1>
            
            <div className="bg-white rounded-[32px] shadow-xl shadow-red-100/50 border border-red-50 p-8">
                <div className="flex gap-4 mb-8">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img 
                            src={event.banner?.startsWith('http') ? event.banner : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')}${event.banner}`} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">{event.title}</h3>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Calendar size={14} className="text-red-500" />
                            <span>{new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-gray-900">{ticketName}</p>
                            <p className="text-sm text-gray-500">Quantity: {quantity} × {formatPrice(ticketPrice)}</p>
                        </div>
                        <p className="font-bold text-gray-900">{formatPrice(ticketPrice * quantity)}</p>
                    </div>
 
                    <div className="pt-6 border-t border-gray-100 space-y-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(ticketPrice * quantity)}</span>
                        </div>
                        {event?.feePayment !== true && (
                            <div className="flex justify-between text-gray-600">
                                <span>Fees (incl. VAT)</span>
                                <span>{formatPrice(financial.fees * quantity)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-black text-red-600">{formatPrice(financial.total * quantity)}</span>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-2xl p-5 flex gap-4 border border-green-100">
                        <ShieldCheck className="text-green-600 flex-shrink-0" size={24} />
                        <div>
                            <p className="text-sm font-bold text-green-900">Secure Payment</p>
                            <p className="text-xs text-green-700 leading-relaxed mt-1">
                                Payments are securely processed by Stripe. Your payment information is never stored on our servers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT: FORMS */}
          <div className="lg:col-span-7 space-y-10">
            <h2 className="text-3xl font-bold text-gray-900">Payment Details</h2>

            <form onSubmit={handleCompletePurchase} className="space-y-8">
                {/* TICKET HOLDER INFO */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-red-100/50 border border-red-50 p-8 md:p-10">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <User className="text-red-600" size={22} />
                        Ticket Holder Information
                    </h3>

                    <div className="space-y-8">
                        {/* TOGGLE */}
                        {quantity > 1 && (
                            <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 flex items-center gap-4 group cursor-pointer" onClick={() => setUseSameName(!useSameName)}>
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${useSameName ? 'bg-red-600 border-red-600' : 'border-red-200 bg-white'}`}>
                                    {useSameName && <div className="w-3 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-1" />}
                                </div>
                                <span className="font-bold text-gray-700 group-hover:text-red-600 transition-colors">
                                    Use my name for all {quantity} tickets
                                </span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Main Name Input (Ticket 1 or Buyer) */}
                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest">
                                    {quantity > 1 && !useSameName ? "Ticket 1 - Full Name" : "Full Name"}
                                </label>
                                <input 
                                    type="text" required
                                    value={formData.fullName}
                                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                                    placeholder="Enter full name"
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 outline-none focus:border-red-500 focus:bg-white transition-all font-medium text-lg"
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">This name will appear on your ticket</p>
                            </div>

                            {/* Additional Ticket Names (if not using same name) */}
                            {quantity > 1 && !useSameName && attendeeNames.slice(1).map((name, idx) => (
                                <div key={idx} className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-sm font-black text-gray-700 uppercase tracking-widest">
                                        Ticket {idx + 2} - Full Name
                                    </label>
                                    <input 
                                        type="text" required
                                        value={name}
                                        onChange={e => {
                                            const newNames = [...attendeeNames];
                                            newNames[idx + 1] = e.target.value;
                                            setAttendeeNames(newNames);
                                        }}
                                        placeholder={`Enter name for ticket ${idx + 2}`}
                                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 outline-none focus:border-red-500 focus:bg-white transition-all font-medium text-lg"
                                    />
                                </div>
                            ))}

                            {/* Email & Phone (Always show after names) */}
                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Email Address</label>
                                <input 
                                    type="email" required
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                    placeholder="your@email.com"
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 outline-none focus:border-red-500 focus:bg-white transition-all font-medium text-lg"
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Tickets will be sent to this email</p>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-black text-gray-700 uppercase tracking-widest">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input 
                                        type="tel"
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        placeholder="+44 7000 000000"
                                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl pl-14 pr-6 py-4 outline-none focus:border-red-500 focus:bg-white transition-all font-medium text-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {!useSameName && (
                            <p className="text-[11px] text-gray-400 font-bold text-center italic">
                                Each name will appear on its respective ticket
                            </p>
                        )}
                    </div>
                </div>

                {/* BILLING ADDRESS */}
                <div className="bg-white rounded-[32px] shadow-xl shadow-red-100/50 border border-red-50 p-8 md:p-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 m-0">
                            <Globe className="text-red-600" size={22} />
                            Billing Address
                        </h3>
                        {user?.addresses && user.addresses.length > 0 && (
                            <select 
                                className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-2 font-medium text-gray-700 outline-none focus:border-red-500 transition-all"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        const addr = user.addresses?.find((a: any) => a._id === e.target.value);
                                        if (addr) {
                                            setFormData({
                                                ...formData,
                                                addressLine1: addr.street || "",
                                                addressLine2: "",
                                                city: addr.city || "",
                                                postcode: addr.postcode || "",
                                                country: addr.country || "United Kingdom"
                                            });
                                        }
                                    }
                                }}
                            >
                                <option value="">Auto-fill from saved...</option>
                                {user.addresses.map((addr: any) => (
                                    <option key={addr._id} value={addr._id}>
                                        {addr.label || "Saved Address"} - {addr.street}, {addr.city}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Address Line 1</label>
                            <input 
                                type="text" required
                                value={formData.addressLine1}
                                onChange={e => setFormData({...formData, addressLine1: e.target.value})}
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Address Line 2 (Optional)</label>
                            <input 
                                type="text"
                                value={formData.addressLine2}
                                onChange={e => setFormData({...formData, addressLine2: e.target.value})}
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">City</label>
                                <input 
                                    type="text" required
                                    value={formData.city}
                                    onChange={e => setFormData({...formData, city: e.target.value})}
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Postcode</label>
                                <input 
                                    type="text" required
                                    value={formData.postcode}
                                    onChange={e => setFormData({...formData, postcode: e.target.value})}
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 outline-none focus:border-red-500 focus:bg-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Country</label>
                            <select 
                                value={formData.country}
                                onChange={e => setFormData({...formData, country: e.target.value})}
                                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 outline-none focus:border-red-500 focus:bg-white transition-all font-medium appearance-none"
                            >
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Ireland">Ireland</option>
                                <option value="United States">United States</option>
                                <option value="Australia">Australia</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center gap-3 text-gray-400">
                    <ShieldCheck size={20} />
                    <span className="text-sm font-bold uppercase tracking-widest">Your payment is secured with 256-bit SSL encryption</span>
                </div>

                <button 
                    type="submit"
                    disabled={processing}
                    className="w-full bg-red-600 text-white py-6 rounded-[24px] font-black text-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-[0.98] disabled:bg-gray-400 flex items-center justify-center gap-3"
                >
                    {processing ? (
                        <>
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CreditCard size={24} />
                            Complete Purchase - {formatPrice(financial.total * quantity)}
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    By completing this purchase, you agree to our <span className="text-red-600 font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-red-600 font-bold underline cursor-pointer">Refund Policy</span>
                </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      <GuestCheckoutModal 
        isOpen={showGuestModal} 
        onClose={() => router.back()}
        onContinueAsGuest={() => {
            setShowGuestModal(false);
            setIsGuest(true);
        }}
      />
    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
