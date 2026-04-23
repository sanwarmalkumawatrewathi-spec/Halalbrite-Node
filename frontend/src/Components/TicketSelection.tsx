"use client";
import { useState, useEffect } from "react";
import { useCurrency } from "@/context/CurrencyContext";

type Ticket = {
  _id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
  chargeCustomer?: boolean;
};

type TicketSelectionProps = {
  tickets?: Ticket[];
  eventId?: string;
};

export default function TicketSelection({ tickets, eventId }: TicketSelectionProps) {
  const [qty, setQty] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const { currentCurrency, formatPrice } = useCurrency();
  
  const displayTickets = tickets || [];

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

  const handleChange = (id: string, type: "inc" | "dec") => {
    setQty((prev) => {
      const current = prev[id] || 0;
      if (type === "inc") return { ...prev, [id]: current + 1 };
      if (type === "dec") return { ...prev, [id]: Math.max(0, current - 1) };
      return prev;
    });
  };

  const calcFees = (price: number) => {
    if (!settings || price === 0) return { platform: 0, vat: 0, stripe: 0, totalFees: 0, grandTotal: price };
    
    const feePercentage = settings.feePercentage || 0;
    const fixedFee = settings.fixedFee || 0;
    const vatRate = settings.vatRate || 0;
    const stripePercentage = settings.stripeFeePercentage || 3;
    const fixedStripe = settings.fixedStripeFee || 0.3;

    const platform = price * (feePercentage / 100) + fixedFee;
    const vat = platform * (vatRate / 100);
    const stripe = price * (stripePercentage / 100) + fixedStripe;
    const totalFees = platform + vat + stripe;

    return {
        platform: platform,
        vat: vat,
        stripe: stripe,
        totalFees: totalFees,
        grandTotal: price + totalFees
    };
  };

  const handleBuyNow = (ticket: Ticket) => {
    const quantity = qty[ticket._id] || 0; 
    if (quantity <= 0) {
      alert("Please select at least one ticket.");
      return;
    }
    if (!eventId) return;

    // Navigate to checkout page with ticket details and selected currency
    const params = new URLSearchParams({
      ticket: ticket.name,
      qty: quantity.toString(),
      currency: currentCurrency.code
    });
    window.location.href = `/checkout/${eventId}?${params.toString()}`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-red-50 p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
        Select Tickets
      </h2>

      <div className="space-y-6">
        {displayTickets.map((ticket, index) => {
          const count = qty[ticket._id] || 0;
          const isProcessing = loading === ticket._id;
          const feeData = calcFees(ticket.price);
          
          // Display price with fees if ticket.chargeCustomer is true or undefined (default)
          const showFees = ticket.price > 0;

          return (
            <div
              key={ticket._id}
              className="group bg-white p-6 rounded-3xl border border-gray-100 hover:border-red-100 hover:shadow-xl hover:shadow-red-50/50 transition-all duration-300"
            >
              {/* TOP INFO */}
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-gray-900">{ticket.name}</h3>
                  <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="md:text-right">
                  <div className="flex flex-wrap items-baseline md:justify-end gap-2">
                    <span className="font-bold text-2xl text-gray-900">
                      {formatPrice(ticket.price)}
                    </span>
                    {showFees && (
                      <span className="text-xs text-gray-400 font-medium">
                        + fees (incl. VAT) {formatPrice(feeData.totalFees)}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-red-600 mt-1 uppercase tracking-wider">
                    {ticket.quantity} remaining
                  </p>
                </div>
              </div>

              {/* ACTION ROW */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* COUNTER */}
                <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                  <button
                    onClick={() => handleChange(ticket._id, "dec")}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                  >
                    -
                  </button>
                  <div className="w-12 h-10 flex items-center justify-center font-bold text-gray-900">
                    {count}
                  </div>
                  <button
                    onClick={() => handleChange(ticket._id, "inc")}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                  >
                    +
                  </button>
                </div>

                {/* BUY BUTTON */}
                <button
                  disabled={isProcessing}
                  onClick={() => handleBuyNow(ticket)}
                  className={`flex-1 relative overflow-hidden py-4 rounded-2xl font-bold text-white transition-all duration-300 transform active:scale-95 flex items-center justify-center ${
                    isProcessing ? "bg-gray-400" : "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-100"
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Buy Now"
                  )}
                </button>

                {/* TOTAL SUMMARY IF QTY > 0 */}
                {count > 0 && showFees && (
                    <div className="bg-red-50/50 border border-red-100 rounded-2xl px-6 py-3.5 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-0.5">Total + fees</span>
                        <span className="font-bold text-lg text-gray-900">
                            {formatPrice(feeData.grandTotal * count)}
                        </span>
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-xs font-medium">Secure payment powered by Stripe</span>
        </div>
      </div>
    </div>
  );
}
