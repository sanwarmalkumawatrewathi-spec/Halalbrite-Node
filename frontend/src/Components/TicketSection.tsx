"use client";
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useCurrency } from "@/context/CurrencyContext";

export default function TicketSection({ 
    tickets, 
    setTickets,
    eventStartDate,
    eventStartTime
}: { 
    tickets: any[], 
    setTickets: any,
    eventStartDate?: string,
    eventStartTime?: string
}) {
    const [settings, setSettings] = useState<any>(null);
    const { currentCurrency } = useCurrency();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
                const response = await fetch(`${API_URL}/api/admin/settings/public`);
                const result = await response.json();
                if (result.data) {
                    setSettings(result.data.platform);
                }
            } catch (error) {
                console.error("Failed to fetch platform settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (i: number, field: string, value: any) => {
        const updated = [...tickets];
        updated[i][field] = value;
        setTickets(updated);
    };

    const addTicket = () => {
        setTickets([
            ...tickets,
            {
                name: "",
                description: "",
                price: 0,
                quantity: 0,
                saleStartDate: "",
                saleStartTime: "",
                saleEndDate: "",
                saleEndTime: "",
                chargeCustomer: true,
            },
        ]);
    };

    const removeTicket = (index: number) => {
        const updated = tickets.filter((_, i) => i !== index);
        setTickets(updated);
    };

    const formatEventStart = (dateStr?: string, timeStr?: string) => {
        if (!dateStr) return "";
        try {
            const parts = dateStr.split('-');
            let displayDate = dateStr;
            if (parts.length === 3) {
                displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            
            let displayTime = "";
            if (timeStr) {
                const timeParts = timeStr.split(':');
                if (timeParts.length >= 2) {
                    let hours = parseInt(timeParts[0]);
                    const minutes = timeParts[1];
                    const ampm = hours >= 12 ? 'pm' : 'am';
                    hours = hours % 12;
                    hours = hours ? hours : 12;
                    displayTime = ` - ${hours}:${minutes}${ampm}`;
                }
            }
            return `Event Starts: ${displayDate}${displayTime}`;
        } catch (e) {
            return "";
        }
    };

    // 💰 Fee calculation
    const calcFees = (price: number) => {
        if (price === 0) {
            return {
                platform: "0.00",
                vat: "0.00",
                stripe: "0.00",
                total: "0.00",
            };
        }
        // Use backend settings or fallbacks
        const feePercentage = settings?.feePercentage ?? 0;
        const fixedFee = settings?.fixedFee ?? 0;
        const vatRate = settings?.vatRate ?? 0;
        const stripePercentage = settings?.stripeFeePercentage ?? 3;
        const fixedStripe = settings?.fixedStripeFee ?? 0.3;

        const platform = price * (feePercentage / 100) + fixedFee;
        const vat = platform * (vatRate / 100);
        const stripe = price * (stripePercentage / 100) + fixedStripe;
        const total = platform + vat + stripe;

        return {
            platform: platform.toFixed(2),
            vat: vat.toFixed(2),
            stripe: stripe.toFixed(2),
            total: total.toFixed(2),
        };
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-[#991b1b]">Ticket Types</h3>
                    <p className="text-sm text-gray-500">Configure your ticket options and pricing</p>
                </div>
            </div>

            <div className="space-y-6">
                {tickets.map((t, i) => {
                    const fees = calcFees(Number(t.price || 0));

                    return (
                        <div
                            key={i}
                            className="relative bg-[#fef2f2] border border-red-100 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
                        >
                            {/* ❌ Remove Button */}
                            {tickets.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeTicket(i)}
                                    className="absolute top-4 right-4 p-2 rounded-full text-red-300 hover:text-red-600 hover:bg-red-100 transition-all"
                                >
                                    <FaTimes size={16} />
                                </button>
                            )}

                            <div className="flex items-center gap-2">
                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">Ticket {i + 1}</span>
                                <div className="h-px flex-1 bg-red-100"></div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Ticket Name</label>
                                    <input
                                        value={t.name}
                                        onChange={(e) => handleChange(i, "name", e.target.value)}
                                        placeholder="General Admission"
                                        className="w-full border border-gray-200 borborder rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Description</label>
                                    <input
                                        value={t.description}
                                        onChange={(e) => handleChange(i, "description", e.target.value)}
                                        placeholder="Standard entry ticket"
                                        className="w-full border border-gray-200 borborder rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Price ({currentCurrency.symbol})</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{currentCurrency.symbol}</span>
                                            <input
                                                type="number"
                                                value={t.price}
                                                onChange={(e) => handleChange(i, "price", e.target.value)}
                                                placeholder="25"
                                                className="w-full border border-gray-200 borborder rounded-xl pl-8 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700">Quantity</label>
                                        <input
                                            type="number"
                                            value={t.quantity}
                                            onChange={(e) => handleChange(i, "quantity", e.target.value)}
                                            placeholder="100"
                                            className="w-full border border-gray-200 borborder rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all bg-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sale Period Card */}
                            <div className="bg-white/60 border border-red-50 rounded-2xl p-5 space-y-4">
                                <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    Ticket Sale Period
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400 px-1">Sale Start</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="date"
                                                    value={t.saleStartDate}
                                                    onChange={(e) => handleChange(i, "saleStartDate", e.target.value)}
                                                    className="w-full border borborder border-gray-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-100 outline-none bg-white"
                                                />
                                                <input
                                                    type="time"
                                                    value={t.saleStartTime}
                                                    onChange={(e) => handleChange(i, "saleStartTime", e.target.value)}
                                                    className="w-full border  borborder border-gray-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-100 outline-none bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400 px-1">Sale End</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <input
                                                    type="date"
                                                    value={t.saleEndDate}
                                                    onChange={(e) => handleChange(i, "saleEndDate", e.target.value)}
                                                    className="w-full border borborder border-gray-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-100 outline-none bg-white"
                                                />
                                                <input
                                                    type="time"
                                                    value={t.saleEndTime}
                                                    onChange={(e) => handleChange(i, "saleEndTime", e.target.value)}
                                                    className="w-full border borborder border-gray-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-red-100 outline-none bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                                    <p className="text-[10px] text-gray-400 italic">Set when tickets will be available for purchase</p>
                                    {eventStartDate && (
                                        <p className="text-xs font-bold text-slate-600">
                                            {formatEventStart(eventStartDate, eventStartTime)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Fee Breakdown */}
                            <div className="bg-white/40 rounded-2xl p-5 space-y-3 border border-red-50">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-bold text-gray-700">Fee Breakdown</p>
                                    {Number(t.price) === 0 && (
                                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">Free</span>
                                    )}
                                </div>

                                {Number(t.price) > 0 ? (
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Platform Fee ({settings?.feePercentage ?? 0}% + {currentCurrency.symbol}{settings?.fixedFee ?? 0})</span>
                                            <span>{currentCurrency.symbol}{fees.platform}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>VAT on Platform Fee ({settings?.vatRate ?? 0}%)</span>
                                            <span>{currentCurrency.symbol}{fees.vat}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Stripe Processing Fee ({settings?.stripeFeePercentage ?? 3}% + {currentCurrency.symbol}{settings?.fixedStripeFee ?? 0.3})</span>
                                            <span>{currentCurrency.symbol}{fees.stripe}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-gray-900 border-t border-red-100 pt-2 mt-1">
                                            <span>Total Fees</span>
                                            <span>{currentCurrency.symbol}{fees.total}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">No fees apply to free tickets.</p>
                                )}
                            </div>

                            {/* Fee Payment Toggle Section */}
                            <div className="bg-[#fffbeb] rounded-2xl p-5 space-y-4 border border-[#fef3c7]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-[#92400e]">Fee Payment</p>
                                        <p className="text-xs text-[#b45309] mt-0.5">
                                            {t.chargeCustomer ? 'Attendees pay the fees' : 'You cover the fees'}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleChange(i, "chargeCustomer", !t.chargeCustomer)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${!t.chargeCustomer ? 'bg-[#ea580c]' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!t.chargeCustomer ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <p className="text-sm font-bold text-[#92400e]">
                                    Customer will pay: {currentCurrency.symbol}
                                    {t.chargeCustomer
                                        ? (Number(t.price || 0) + Number(fees.total)).toFixed(2)
                                        : Number(t.price || 0).toFixed(2)
                                    }
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add Ticket Button */}
            <button
                type="button"
                onClick={addTicket}
                className="w-full border-2 border-dashed border-red-200 rounded-2xl py-4 text-sm font-bold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 group"
            >
                <div className="p-1 bg-red-100 rounded-full group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                Add Another Ticket Type
            </button>
        </div>
    );
}