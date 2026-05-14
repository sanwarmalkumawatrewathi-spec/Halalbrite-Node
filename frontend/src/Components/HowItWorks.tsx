'use client';

import React, { useState, useEffect } from 'react';

export default function HowItWorks() {
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
          // Map currency code to symbol for display
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

    // Halalbrite Fee = (Price * Percentage) + Fixed
    const hbFee = (price * (fees.feePercentage / 100)) + fees.fixedFee;

    // VAT on Halalbrite Fee
    const vat = hbFee * (fees.vatRate / 100);

    // Stripe Fee = (Price * StripePercentage) + StripeFixed
    const stripeFee = (price * (fees.stripeFeePercentage / 100)) + fees.fixedStripeFee;

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
      <div
        className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="lucide lucide-zap w-3.5 h-3.5 sm:w-4 sm:h-4">
              <path
                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg><span className="text-xs sm:text-sm">Simple &amp; Transparent</span></div>
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">How Halalbrite Works</h1>
          <p className="text-base sm:text-lg md:text-xl text-red-100 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
            Whether you're attending or organizing events, we make it simple, secure, and seamless</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 flex-1">
        <div className="mb-12 sm:mb-16 md:mb-20">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
            <div
              className="inline-flex items-center gap-2 bg-red-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="lucide lucide-users w-4 h-4 sm:w-5 sm:h-5 text-red-600">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg><span className="text-red-900 text-[32px]">For Attendees</span></div>
            <h2 className="text-red-900 mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl">Your Journey to Amazing
              Events</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">Discover, book, and attend halal
              events in just a few clicks</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0 relative overflow-hidden">
              <div
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                1</div>
              <div data-slot="card-content"
                className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6 pt-14 sm:pt-16">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-search w-7 h-7 sm:w-8 sm:h-8 text-red-600">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg></div>
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">Discover Events
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Browse our curated
                  selection of halal events. Use filters to find events by category, location, date, or
                  price range.</p>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0 relative overflow-hidden">
              <div
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                2</div>
              <div data-slot="card-content"
                className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6 pt-14 sm:pt-16">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-ticket w-7 h-7 sm:w-8 sm:h-8 text-red-600">
                    <path
                      d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="M13 5v2" />
                    <path d="M13 17v2" />
                    <path d="M13 11v2" />
                  </svg></div>
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">Select Tickets
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Choose your ticket type
                  and quantity. You can select multiple ticket types for the same event in one purchase.
                </p>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0 relative overflow-hidden">
              <div
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                3</div>
              <div data-slot="card-content"
                className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6 pt-14 sm:pt-16">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-credit-card w-7 h-7 sm:w-8 sm:h-8 text-red-600">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg></div>
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">Secure Checkout
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Complete your purchase
                  securely through Stripe. Your payment information is encrypted and never stored on our
                  servers.</p>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0 relative overflow-hidden">
              <div
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                4</div>
              <div data-slot="card-content"
                className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6 pt-14 sm:pt-16">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-ticket w-7 h-7 sm:w-8 h-8 text-red-600">
                    <path
                      d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="M13 5v2" />
                    <path d="M13 17v2" />
                    <path d="M13 11v2" />
                  </svg></div>
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">Receive Ticket
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">Get your digital ticket
                  instantly via email. Simply show it at the event entrance for quick check-in.</p>
              </div>
            </div>
          </div>
          <div data-slot="card"
            className="text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-gradient-to-br from-red-50 to-white">
            <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8">
              <h3 className="text-red-900 mb-6 text-center">Additional Features</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-circle-check w-6 h-6 text-white">
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg></div>
                  <div>
                    <h4 className="text-gray-900 mb-2">Save Favorites</h4>
                    <p className="text-gray-600 text-sm">Bookmark events you're interested in and follow
                      your favorite organizers</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-share2 lucide-share-2 w-6 h-6 text-white">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                    </svg></div>
                  <div>
                    <h4 className="text-gray-900 mb-2">Share Events</h4>
                    <p className="text-gray-600 text-sm">Share events with friends via social media or
                      direct links</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" className="lucide lucide-users w-6 h-6 text-white">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg></div>
                  <div>
                    <h4 className="text-gray-900 mb-2">Track Attendance</h4>
                    <p className="text-gray-600 text-sm">View your upcoming and past events in your
                      account dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-20">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center"><svg
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="lucide lucide-calendar w-6 h-6 text-red-600">
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg></div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
        </div>
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-4"><svg
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="lucide lucide-chart-column w-5 h-5 text-red-600">
              <path d="M3 3v16a2 2 0 0 0 2 2h16" />
              <path d="M18 17V9" />
              <path d="M13 17V5" />
              <path d="M8 17v-3" />
            </svg><span className="text-red-900">For Organizers</span></div>
            <h2 className="text-red-900 mb-4">Host Successful Events with Ease</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Create, manage, and grow your events with our
              powerful organizer tools</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 relative overflow-hidden">
              <div
                className="absolute top-4 right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
                1</div>
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-6 pt-16">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4"><svg
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="lucide lucide-user-plus w-8 h-8 text-red-600">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" x2="19" y1="8" y2="14" />
                  <line x1="22" x2="16" y1="11" y2="11" />
                </svg></div>
                <h3 className="text-red-900 mb-3">Create Account</h3>
                <p className="text-gray-600 leading-relaxed">Sign up as an organizer or convert your account
                  to an organizer profile with just one click.</p>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 relative overflow-hidden">
              <div
                className="absolute top-4 right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
                2</div>
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-6 pt-16">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4"><svg
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="lucide lucide-shield w-8 h-8 text-red-600">
                  <path
                    d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                </svg></div>
                <h3 className="text-red-900 mb-3">Connect Stripe</h3>
                <p className="text-gray-600 leading-relaxed">Link/create your Stripe account to receive
                  secure payouts from ticket sales.</p>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 relative overflow-hidden">
              <div
                className="absolute top-4 right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
                3</div>
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-6 pt-16">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4"><svg
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="lucide lucide-file-text w-8 h-8 text-red-600">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg></div>
                <h3 className="text-red-900 mb-3">Create Event</h3>
                <p className="text-gray-600 leading-relaxed">Use our step-by-step wizard to create your
                  event with all details and ticket types.</p>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 relative overflow-hidden">
              <div
                className="absolute top-4 right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
                4</div>
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-6 pt-16">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4"><svg
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-share2 lucide-share-2 w-8 h-8 text-red-600">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
                </svg></div>
                <h3 className="text-red-900 mb-3">Promote Event</h3>
                <p className="text-gray-600 leading-relaxed">Share your event on social media and track
                  engagement through your dashboard.</p>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 relative overflow-hidden">
              <div
                className="absolute top-4 right-4 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
                5</div>
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-6 pt-16">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4"><svg
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="lucide lucide-dollar-sign w-8 h-8 text-red-600">
                  <line x1="12" x2="12" y1="2" y2="22" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg></div>
                <h3 className="text-red-900 mb-3">Get Paid</h3>
                <p className="text-gray-600 leading-relaxed">Receive automatic payouts to your Stripe
                  account as tickets are sold.</p>
              </div>
            </div>
          </div>
          <div data-slot="card"
            className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0">
            <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8">
              <h3 className="text-red-900 mb-6 text-center">Powerful Dashboard Features</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-chart-column w-8 h-8 text-red-600">
                      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                      <path d="M18 17V9" />
                      <path d="M13 17V5" />
                      <path d="M8 17v-3" />
                    </svg></div>
                  <h4 className="text-gray-900 mb-2">Analytics</h4>
                  <p className="text-gray-600 text-sm">Track ticket sales, revenue, and attendance in
                    real-time</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" className="lucide lucide-users w-8 h-8 text-red-600">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg></div>
                  <h4 className="text-gray-900 mb-2">Attendee Management</h4>
                  <p className="text-gray-600 text-sm">View and manage all attendees with check-in tools
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round" className="lucide lucide-file-text w-8 h-8 text-red-600">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                      <path d="M10 9H8" />
                      <path d="M16 13H8" />
                      <path d="M16 17H8" />
                    </svg></div>
                  <h4 className="text-gray-900 mb-2">Event Editor</h4>
                  <p className="text-gray-600 text-sm">Update event details and ticket availability
                    anytime</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trending-up w-8 h-8 text-red-600">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                      <polyline points="16 7 22 7 22 13" />
                    </svg></div>
                  <h4 className="text-gray-900 mb-2">Public Profile</h4>
                  <p className="text-gray-600 text-sm">Build your brand with a dedicated organizer profile
                    page</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-4"><svg
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="lucide lucide-dollar-sign w-5 h-5 text-red-600">
              <line x1="12" x2="12" y1="2" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg><span className="text-red-900">Payments &amp; Payouts</span></div>
            <h2 className="text-red-900 mb-4">Transparent Pricing &amp; Secure Payments</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Simple, fair pricing with secure payment processing
              through Stripe</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center"><svg
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" className="lucide lucide-ticket w-7 h-7 text-red-600">
                    <path
                      d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="M13 5v2" />
                    <path d="M13 17v2" />
                    <path d="M13 11v2" />
                  </svg></div>
                  <h3 className="text-red-900">Platform Fee Structure</h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3"><span
                      className="text-gray-700">Free Events</span><span
                        className="bg-green-600 text-white px-4 py-1 rounded-full">{fees.currency}0.00</span>
                    </div>
                    <p className="text-gray-600 text-sm">No platform fees for free events. Host
                      community events at no cost!</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3"><span
                      className="text-gray-700">Paid Events</span>
                      <div className="flex flex-col items-end gap-1"><span
                        className="bg-red-500 text-white px-4 py-1 rounded-full text-sm">Halalbrite:
                        {fees.feePercentage}% + {fees.currency}{fees.fixedFee.toFixed(2)}</span><span
                          className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Stripe:
                          {fees.stripeFeePercentage}% + {fees.currency}{fees.fixedStripeFee.toFixed(2)}</span></div>
                    </div>
                    <p className="text-gray-600 text-sm">Per ticket sold. Includes payment processing
                      fees.</p>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-gray-900 mb-4">Fee Calculator</h4>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2"><label
                        className="text-gray-700 text-sm">Ticket Price</label><span
                          className="bg-gray-100 px-3 py-1 rounded-lg text-gray-900">{fees.currency}{Number(ticketPrice).toFixed(2)}</span>
                      </div><input type="range" min="1" max="2000" step="1"
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(Number(e.target.value))} />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{fees.currency}1</span><span>{fees.currency}2000</span></div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 space-y-3">
                      <div className="flex justify-between text-sm"><span
                        className="text-gray-600">Ticket Price</span><span
                          className="text-gray-900">{fees.currency}{Number(ticketPrice).toFixed(2)}</span></div>
                      <div className="flex justify-between text-sm"><span
                        className="text-gray-600">Halalbrite Fee</span><span
                          className="text-red-600">{fees.currency}{results.hbFee}</span></div>
                      <div className="flex justify-between text-sm"><span
                        className="text-gray-600">VAT ({fees.vatRate}%)</span><span
                          className="text-red-600">{fees.currency}{results.vat}</span></div>
                      <div className="flex justify-between text-sm"><span
                        className="text-gray-600">Stripe Fee</span><span
                          className="text-blue-600">{fees.currency}{results.stripeFee}</span></div>
                      <div className="flex justify-between text-sm border-t pt-3"><span
                        className="text-gray-600">Total Fees</span><span
                          className="text-gray-900">{fees.currency}{results.totalFees}</span></div>
                      <div className="border-t pt-3 space-y-2">
                        <div className="flex justify-between"><span
                          className="text-gray-900">Attendee Pays</span><span
                            className="text-green-600">{fees.currency}{results.attendeePays}</span></div>
                        <div className="flex justify-between"><span
                          className="text-gray-900">Organizer Receives</span><span
                            className="text-green-600">{fees.currency}{results.organizerReceives}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center"><svg
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" className="lucide lucide-shield w-7 h-7 text-red-600">
                    <path
                      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </svg></div>
                  <h3 className="text-red-900">Stripe Connect Integration</h3>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">We use Stripe Connect to ensure secure,
                    reliable payment processing and instant payouts directly to your bank account.</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          className="lucide lucide-circle-check w-5 h-5 text-red-600">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg></div>
                      <div>
                        <h4 className="text-gray-900 mb-1">Bank-Level Security</h4>
                        <p className="text-gray-600 text-sm">All payment data is encrypted and
                          processed securely by Stripe</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          className="lucide lucide-clock w-5 h-5 text-red-600">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg></div>
                      <div>
                        <h4 className="text-gray-900 mb-1">Automatic Payouts</h4>
                        <p className="text-gray-600 text-sm">Funds are automatically transferred to
                          your account based on your Stripe payout schedule</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          className="lucide lucide-dollar-sign w-5 h-5 text-red-600">
                          <line x1="12" x2="12" y1="2" y2="22" />
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg></div>
                      <div>
                        <h4 className="text-gray-900 mb-1">No Hidden Fees</h4>
                        <p className="text-gray-600 text-sm">Our platform fee is all-inclusive.
                          Stripe's processing fees are separate and standard</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          className="lucide lucide-trending-up w-5 h-5 text-red-600">
                          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                          <polyline points="16 7 22 7 22 13" />
                        </svg></div>
                      <div>
                        <h4 className="text-gray-900 mb-1">Real-Time Tracking</h4>
                        <p className="text-gray-600 text-sm">Monitor your earnings and payout status
                          through your organizer dashboard</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round"
                          className="lucide lucide-credit-card w-5 h-5 text-red-600">
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <line x1="2" x2="22" y1="10" y2="10" />
                        </svg></div>
                      <div>
                        <h4 className="text-gray-900 mb-1">Stripe Processing Fees</h4>
                        <p className="text-gray-600 text-sm">Standard rate applies per
                          transaction. <a href="https://stripe.com/ie/connect/pricing"
                            target="_blank" rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 underline">View detailed
                            pricing</a></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div data-slot="card"
            className="text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0 bg-gradient-to-br from-red-50 to-white">
            <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8">
              <h3 className="text-red-900 mb-6 text-center">How Payouts Work</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-red-600">1</span></div>
                  <h4 className="text-gray-900 mb-2">Ticket Sold</h4>
                  <p className="text-gray-600 text-sm">Customer purchases a ticket through Stripe's secure
                    checkout</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-red-600">2</span></div>
                  <h4 className="text-gray-900 mb-2">Platform Fee Deducted</h4>
                  <p className="text-gray-600 text-sm">Halalbrite's platform fee is
                    automatically calculated</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-red-600">3</span></div>
                  <h4 className="text-gray-900 mb-2">Funds Held by Stripe</h4>
                  <p className="text-gray-600 text-sm">Your earnings are held securely by Stripe until
                    payout schedule</p>
                </div>
                <div className="text-center">
                  <div
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <span className="text-red-600">4</span></div>
                  <h4 className="text-gray-900 mb-2">Automatic Transfer</h4>
                  <p className="text-gray-600 text-sm">Funds are deposited to your connected bank account
                    when you decide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-4"><svg
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="lucide lucide-ticket w-5 h-5 text-red-600">
              <path
                d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2" />
              <path d="M13 17v2" />
              <path d="M13 11v2" />
            </svg><span className="text-red-900">Smart Tickets</span></div>
            <h2 className="text-red-900 mb-4">QR Code Tickets for Easy Check-In</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Modern, contactless, and secure ticket validation</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8 text-center">
                <div
                  className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" className="lucide lucide-ticket w-10 h-10 text-red-600">
                    <path
                      d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="M13 5v2" />
                    <path d="M13 17v2" />
                    <path d="M13 11v2" />
                  </svg></div>
                <h3 className="text-red-900 mb-3">Instant Delivery</h3>
                <p className="text-gray-600 leading-relaxed">Attendees receive their tickets immediately
                  after purchase via email. No waiting, no printing required.</p>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8 text-center">
                <div
                  className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" className="lucide lucide-shield w-10 h-10 text-red-600">
                    <path
                      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </svg></div>
                <h3 className="text-red-900 mb-3">Secure &amp; Unique</h3>
                <p className="text-gray-600 leading-relaxed">Each ticket has a unique code that can only be
                  used once, preventing fraud and unauthorized entry.</p>
              </div>
            </div>
            <div data-slot="card"
              className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-8 text-center">
                <div
                  className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    strokeLinejoin="round" className="lucide lucide-zap w-10 h-10 text-red-600">
                    <path
                      d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                  </svg></div>
                <h3 className="text-red-900 mb-3">Fast Check-In</h3>
                <p className="text-gray-600 leading-relaxed">Show your ticket and ID and your good to go</p>
              </div>
            </div>
          </div>
        </div>
        <div data-slot="card"
          className="bg-card text-card-foreground flex flex-col gap-6 rounded-3xl shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-12 text-center text-white">
            <h2 className="mb-4">Ready to Get Started?</h2>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">Whether you're looking to attend amazing
              events or host your own, Halalbrite makes it simple.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center"><button data-slot="button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 has-[>svg]:px-4 bg-white text-red-600 hover:bg-red-50 rounded-xl px-8"><svg
                xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" className="lucide lucide-calendar w-5 h-5 mr-2">
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
              </svg>Browse Events</button><button data-slot="button"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:text-accent-foreground dark:bg-input/30 dark: dark:hover:bg-input/50 h-10 has-[>svg]:px-4 border-2 border-white text-red-600 hover:bg-white/10 rounded-xl px-8 bg-[rgb(250,249,249)]"><svg
                  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeLinejoin="round" className="lucide lucide-zap w-5 h-5 mr-2">
                  <path
                    d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                </svg>Post an Event</button></div>
          </div>
        </div>
      </div>
    </main>
  );
}
