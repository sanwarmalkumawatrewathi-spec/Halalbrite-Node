

"use client";

import { FaTimes } from "react-icons/fa";

export default function TicketSection({ tickets, setTickets }: { tickets: any[], setTickets: any }) {
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

    // 💰 Fee calculation
    const calcFees = (price: number) => {
        const platform = price * 0.03 + 0.3;
        const vat = platform * 0.23;
        const stripe = price * 0.015 + 0.2;
        const total = platform + vat + stripe;

        return {
            platform: platform.toFixed(2),
            vat: vat.toFixed(2),
            stripe: stripe.toFixed(2),
            total: total.toFixed(2),
        };
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Ticket Types</h3>

            {tickets.map((t, i) => {
                const fees = calcFees(Number(t.price || 0));

                return (
                    <div
                        key={i}
                        className="relative bg-red-50 border border-gray-300 rounded-2xl p-5 space-y-4"
                    >
                        {/* ❌ Remove Button */}
                        {tickets.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeTicket(i)}
                                className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100"
                            >
                                <FaTimes size={12} />
                            </button>
                        )}

                        <p className="text-sm font-semibold text-red-500">
                            Ticket {i + 1}
                        </p>


                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Ticket Name
                            </label>

                            <input
                                value={t.name}
                                onChange={(e) => handleChange(i, "name", e.target.value)}
                                placeholder="General Admission"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-200 outline-none"
                            />
                        </div>


                        {/* Description */}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">
                                Discription
                            </label>
                            <input
                                value={t.description}
                                onChange={(e) =>
                                    handleChange(i, "description", e.target.value)
                                }
                                placeholder="Description"
                                className="w-full border rounded-lg px-3 py-2 text-sm mt-2"
                            />
                        </div>

                        {/* Price + Quantity */}
                        <div className="grid grid-cols-2 gap-4">

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Price (€)
                                </label>

                                <input
                                    type="number"
                                    value={t.price}
                                    onChange={(e) =>
                                        handleChange(i, "price", e.target.value)
                                    }
                                    placeholder="25"
                                    className="w-full border rounded-xl px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-red-200 outline-none"
                                />
                            </div>


                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">
                                    Quantity
                                </label>

                                <input
                                    type="number"
                                    value={t.quantity}
                                    onChange={(e) =>
                                        handleChange(i, "quantity", e.target.value)
                                    }
                                    placeholder="100"
                                    className="w-full border rounded-xl px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-red-200 outline-none"
                                />
                            </div>
                        </div>

                        {/* Sale Period */}
                        <div className="bg-blue-50 border rounded-xl p-4 space-y-3">
                            <p className="text-sm font-medium text-blue-600">
                                Ticket Sale Period
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Sale Start
                                    </label>

                                    <input
                                        type="date"
                                        value={t.saleStartDate}
                                        onChange={(e) =>
                                            handleChange(i, "saleStartDate", e.target.value)
                                        }
                                        className="  w-full border rounded-xl px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    />
                                </div>


                                <input
                                    type="time"
                                    value={t.saleStartTime}
                                    onChange={(e) =>
                                        handleChange(i, "saleStartTime", e.target.value)
                                    }
                                    className="border rounded-lg px-3 py-2 text-sm"
                                />




                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">
                                        Sale End
                                    </label>
                                    <input
                                        type="date"
                                        value={t.saleEndDate}
                                        onChange={(e) =>
                                            handleChange(i, "saleEndDate", e.target.value)
                                        }
                                       className="w-full border rounded-xl px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-200 outline-none"
                                    /></div>
                                <input
                                    type="time"
                                    value={t.saleEndTime}
                                    onChange={(e) =>
                                        handleChange(i, "saleEndTime", e.target.value)
                                    }
                                    className="border rounded-lg px-3 py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Fee Breakdown */}
                        <div className="bg-gray-100 border rounded-xl p-4 text-sm space-y-1">
                            <p className="font-medium">Fee Breakdown</p>
                            <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>€{fees.platform}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>VAT (23%)</span>
                                <span>€{fees.vat}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Stripe Fee</span>
                                <span>€{fees.stripe}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>Total Fees</span>
                                <span>€{fees.total}</span>
                            </div>
                        </div>

                        {/* Fee Toggle */}
                        <div className="flex items-center justify-between border rounded-xl p-3 bg-yellow-50">
                            <div>
                                <p className="text-sm font-medium">Fee Payment</p>
                                <p className="text-xs text-gray-500">
                                    Attendees pay the fees
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                checked={t.chargeCustomer}
                                onChange={() =>
                                    handleChange(i, "chargeCustomer", !t.chargeCustomer)
                                }
                            />
                        </div>
                    </div>
                );
            })}

            {/* Add Ticket */}
            <button
                type="button"
                onClick={addTicket}
                className="w-full border border-dashed rounded-xl py-3 text-sm text-red-500 hover:bg-red-50"
            >
                + Add Another Ticket Type
            </button>
        </div>
    );
}