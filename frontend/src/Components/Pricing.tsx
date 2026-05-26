'use client';

import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

export default function Pricing() {
  const { currentCurrency, convertPrice } = useCurrency();
  const [ticketPrice, setTicketPrice] = useState(25);
  const [fees, setFees] = useState({
    feePercentage: 3,
    fixedFee: 0.30,
    vatRate: 23,
    stripeFeePercentage: 3,
    fixedStripeFee: 0.30,
    currency: '€'
  });

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/admin/settings/fees`);
        const result = await response.json();
        if (result.success) {
          const currencySymbols: { [key: string]: string } = {
            'EUR': '€',
            'GBP': '£',
            'USD': '$',
            'AUD': 'A$',
          };

          setFees({
            ...result.data,
            currency: currencySymbols[result.data.currency] || result.data.currency
          });
        }
      } catch (error) {
        console.error("Failed to fetch fee settings:", error);
      }
    };
    fetchFees();
  }, []);

  const calculateFees = () => {
    const price = Number(ticketPrice);
    const convertedFixedFee = convertPrice(fees.fixedFee);
    const convertedFixedStripeFee = convertPrice(fees.fixedStripeFee);

    const hbFee = (price * (fees.feePercentage / 100)) + convertedFixedFee;
    const vat = hbFee * (fees.vatRate / 100);
    const stripeFee = (price * (fees.stripeFeePercentage / 100)) + convertedFixedStripeFee;

    const totalFees = hbFee + vat + stripeFee;
    const attendeePays = price + totalFees;
    const organizerReceives = price;

    return {
      hbFee: hbFee.toFixed(2),
      vat: vat.toFixed(2),
      stripeFee: stripeFee.toFixed(2),
      totalFees: totalFees.toFixed(2),
      attendeePays: attendeePays.toFixed(2),
      organizerReceives: organizerReceives.toFixed(2)
    };
  };

  const results = calculateFees();

  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-3.5 h-3.5 sm:w-4 sm:h-4">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span className="text-xs sm:text-sm">Simple & Transparent Pricing</span>
          </div>
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Our Pricing Structure</h1>
          <p className="text-base sm:text-lg md:text-xl text-red-100 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
            Fair fees for organizers and attendees alike. No hidden costs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-5 h-5 text-red-600">
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span className="text-red-900">Payments & Payouts</span>
            </div>
            <h2 className="text-red-900 mb-4">Transparent Pricing & Secure Payments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Simple, fair pricing with secure payment processing through Stripe</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket w-7 h-7 text-red-600">
                      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                      <path d="M13 5v2" />
                      <path d="M13 17v2" />
                      <path d="M13 11v2" />
                    </svg>
                  </div>
                  <h3 className="text-red-900">Platform Fee Structure</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-700">Free Events</span>
                      <span className="bg-green-600 text-white px-4 py-1 rounded-full">{currentCurrency.symbol}0.00</span>
                    </div>
                    <p className="text-gray-600 text-sm">No platform fees for free events. Host community events at no cost!</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-700">Paid Events</span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm">Halalbrite: {fees.feePercentage}% + {currentCurrency.symbol}{convertPrice(fees.fixedFee).toFixed(2)}</span>
                        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Stripe: {fees.stripeFeePercentage}% + {currentCurrency.symbol}{convertPrice(fees.fixedStripeFee).toFixed(2)}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">Per ticket sold. Includes payment processing fees.</p>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-gray-900 mb-4">Fee Calculator</h4>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-gray-700 text-sm">Ticket Price</label>
                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-gray-900">{currentCurrency.symbol}{Number(ticketPrice).toFixed(2)}</span>
                      </div>
                      <input type="range" min="1" max="2000" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500" value={ticketPrice} onChange={(e) => setTicketPrice(Number(e.target.value))} />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{currentCurrency.symbol}1</span><span>{currentCurrency.symbol}2000</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Ticket Price</span><span className="text-gray-900">{currentCurrency.symbol}{Number(ticketPrice).toFixed(2)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Halalbrite Fee</span><span className="text-red-600">{currentCurrency.symbol}{results.hbFee}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">VAT ({fees.vatRate}%)</span><span className="text-red-600">{currentCurrency.symbol}{results.vat}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Stripe Fee</span><span className="text-blue-600">{currentCurrency.symbol}{results.stripeFee}</span></div>
                      <div className="flex justify-between text-sm border-t pt-3"><span className="text-gray-600">Total Fees</span><span className="text-gray-900">{currentCurrency.symbol}{results.totalFees}</span></div>
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between"><span className="text-gray-900">Attendee Pays</span><span className="text-green-600">{currentCurrency.symbol}{results.attendeePays}</span></div>
                        <div className="flex justify-between"><span className="text-gray-900">Organizer Receives</span><span className="text-green-600">{currentCurrency.symbol}{results.organizerReceives}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield w-7 h-7 text-red-600">
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                    </svg>
                  </div>
                  <h3 className="text-red-900">Stripe Connect Integration</h3>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">We use Stripe Connect to ensure secure, reliable payment processing and instant payouts directly to your bank account.</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check w-5 h-5 text-red-600">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1">Bank-Level Security</h4>
                        <p className="text-gray-600 text-sm">All payment data is encrypted and processed securely by Stripe</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-5 h-5 text-red-600">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1">Automatic Payouts</h4>
                        <p className="text-gray-600 text-sm">Funds are automatically transferred to your account based on your Stripe payout schedule</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-dollar-sign w-5 h-5 text-red-600">
                          <line x1="12" x2="12" y1="2" y2="22" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1">No Hidden Fees</h4>
                        <p className="text-gray-600 text-sm">Our platform fee is all-inclusive. Stripe's processing fees are separate and standard</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up w-5 h-5 text-red-600">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                          <polyline points="16 7 22 7 22 13" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1">Real-Time Tracking</h4>
                        <p className="text-gray-600 text-sm">Monitor your earnings and payout status through your organizer dashboard</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 mb-8 overflow-hidden bg-white">
            <div data-slot="card-content" className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card w-7 h-7 text-red-600">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <h3 className="text-red-900 font-bold text-xl md:text-2xl">Payment Processing Fees</h3>
              </div>

              <div className="grid md:grid-cols-5 gap-6 text-sm text-gray-600 mb-8 leading-relaxed">
                <div className="md:col-span-5 space-y-4">
                  <p className="font-semibold text-gray-800">
                    The pricing plans above show our platform fees only. To accept payments online, you'll also need a payment processor.
                  </p>
                  <p>
                    Halalbrite does not directly handle or process customer payments. All transactions are facilitated through trusted, fully certified payment service providers. For example, Stripe is used to ensure fast, secure, and reliable transfers of funds from ticket purchasers directly to your nominated bank account.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h4 className="text-gray-900 font-bold mb-4 text-base">Example Stripe Fees</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-600 border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="py-3 px-4 font-bold text-gray-950">UK</th>
                        <th className="py-3 px-4 font-bold text-gray-950">US</th>
                        <th className="py-3 px-4 font-bold text-gray-950">Eurozone</th>
                        <th className="py-3 px-4 font-bold text-gray-950">Canada</th>
                        <th className="py-3 px-4 font-bold text-gray-950">Australia</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/30 transition-colors">
                        <td className="py-4 px-4 font-extrabold text-gray-900">1.5% + £0.20</td>
                        <td className="py-4 px-4 font-extrabold text-gray-900">2.9% + $0.30</td>
                        <td className="py-4 px-4 font-extrabold text-gray-900">1.5% + €0.25</td>
                        <td className="py-4 px-4 font-extrabold text-gray-900">2.9% + C$0.30</td>
                        <td className="py-4 px-4 font-extrabold text-gray-900">1.75% + A$0.30</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-400">
                  <span>* Fees may vary based on card type and region.</span>
                  <a
                    href="https://stripe.com/pricing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    Learn more about Stripe pricing →
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div data-slot="card" className="text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-gradient-to-br from-red-50 to-white">
            <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8">
              <h3 className="text-red-900 mb-6 text-center">How Payouts Work</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-red-600 font-bold">1</span>
                  </div>
                  <h4 className="text-gray-900 mb-2 font-bold text-lg">Ticket Sold</h4>
                  <p className="text-gray-600 text-sm">Customer purchases a ticket through Stripe's secure checkout</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-red-600 font-bold">2</span>
                  </div>
                  <h4 className="text-gray-900 mb-2 font-bold text-lg">Platform Fee Deducted</h4>
                  <p className="text-gray-600 text-sm">Halalbrite's platform and payment processing fees is automatically calculated.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-red-600 font-bold">3</span>
                  </div>
                  <h4 className="text-gray-900 mb-2 font-bold text-lg">Instant payouts to Stripe</h4>
                  <p className="text-gray-600 text-sm">Your earnings are instantly transferred to your Stripe dashboard - transfer to your bank.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-red-600 font-bold">4</span>
                  </div>
                  <h4 className="text-gray-900 mb-2 font-bold text-lg">Automatic Transfer</h4>
                  <p className="text-gray-600 text-sm">Funds are deposited to your connected bank account manually/automatically</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
