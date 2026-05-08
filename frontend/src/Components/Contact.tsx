"use client";

import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: ''
  });

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const response = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ loading: false, success: true, error: '' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error: any) {
      setStatus({ loading: false, success: false, error: 'Connection failed. Please check your internet.' });
    }
  };
  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square w-3.5 h-3.5 sm:w-4 sm:h-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span className="text-xs sm:text-sm">We're Here to Help</span>
          </div>
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-red-100 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
            Have a question or need assistance? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="lg:col-span-2">
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-5 sm:p-6 md:p-8">
                <h2 className="text-red-900 mb-4 sm:mb-6 text-xl sm:text-2xl md:text-3xl">Send Us a Message</h2>

                {status.success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span className="text-sm sm:text-base font-medium">Thank you! Your message has been sent successfully. We'll get back to you soon.</span>
                  </div>
                )}

                {status.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-red-600"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>
                    <span className="text-sm sm:text-base font-medium">{status.error}</span>
                  </div>
                )}

                <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label data-slot="label" className="items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-gray-700 mb-1.5 sm:mb-2 block text-sm sm:text-base" htmlFor="name">Full Name *</label>
                      <input type="text" data-slot="input" className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 border px-3 py-1 bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-lg sm:rounded-xl text-sm sm:text-base" id="name" name="name" required placeholder="Your name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                      <label data-slot="label" className="items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-gray-700 mb-1.5 sm:mb-2 block text-sm sm:text-base" htmlFor="email">Email Address *</label>
                      <input type="email" data-slot="input" className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 border px-3 py-1 bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-lg sm:rounded-xl text-sm sm:text-base" id="email" name="email" required placeholder="your@email.com" value={formData.email} onChange={handleChange} />
                    </div>
                  </div>
                  <div>
                    <label data-slot="label" className="items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-gray-700 mb-1.5 sm:mb-2 block text-sm sm:text-base" htmlFor="subject">Subject *</label>
                    <input type="text" data-slot="input" className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 border px-3 py-1 bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-lg sm:rounded-xl text-sm sm:text-base" id="subject" name="subject" required placeholder="How can we help you?" value={formData.subject} onChange={handleChange} />
                  </div>
                  <div>
                    <label data-slot="label" className="items-center gap-2 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-gray-700 mb-1.5 sm:mb-2 block text-sm sm:text-base" htmlFor="message">Message *</label>
                    <textarea data-slot="textarea" className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full border bg-input-background px-3 py-2 transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-lg sm:rounded-xl resize-none text-sm sm:text-base" id="message" name="message" required rows={6} placeholder="Tell us more about your inquiry..." value={formData.message} onChange={handleChange}></textarea>
                  </div>
                  <button data-slot="button" disabled={status.loading} className="inline-flex text-[#fff] items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 shrink-0 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-10 px-6 has-[>svg]:px-4 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg sm:rounded-xl text-sm sm:text-base" type="submit">
                    {status.loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-4 h-4 sm:w-5 sm:h-5 mr-2"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path></svg>
                    )}
                    {status.loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">Contact Information</h3>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-5 h-5 sm:w-6 sm:h-6 text-red-600"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-gray-900 mb-1 text-sm sm:text-base">Email</h4>
                    <a href="mailto:contact@halalbrite.com" className="text-gray-600 hover:text-red-600 transition-colors text-sm sm:text-base break-all">contact@halalbrite.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-5 h-5 sm:w-6 sm:h-6 text-red-600"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-gray-900 mb-1 text-sm sm:text-base">Office</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Dublin, Ireland</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-5 h-5 sm:w-6 sm:h-6 text-red-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-gray-900 mb-1 text-sm sm:text-base">Business Hours</h4>
                    <p className="text-gray-600 text-sm sm:text-base">Monday - Friday<br />9:00 AM - 6:00 PM GMT</p>
                  </div>
                </div>
              </div>
            </div>
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6">
                <h3 className="text-red-900 mb-3 sm:mb-4 text-lg sm:text-xl md:text-2xl">Follow Us</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <a href="#" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook w-4 h-4 sm:w-5 sm:h-5 text-white"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm md:text-base truncate">Facebook</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter w-4 h-4 sm:w-5 sm:h-5 text-white"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm md:text-base truncate">Twitter</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram w-4 h-4 sm:w-5 sm:h-5 text-white"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm md:text-base truncate">Instagram</span>
                  </a>
                  <a href="#" className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-red-50 hover:bg-red-100 transition-colors">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin w-4 h-4 sm:w-5 sm:h-5 text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </div>
                    <span className="text-gray-700 text-xs sm:text-sm md:text-base truncate">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-4">
            <h2 className="text-red-900 mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">Quick answers to common questions about HalalBrite</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6">
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">How do I create an event?</h3>
                <p className="text-gray-600 text-sm sm:text-base">Simply sign up or log in to your account, click "Create Event" in the navigation menu, and follow our easy step-by-step wizard. You can create your first event in minutes!</p>
              </div>
            </div>
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6">
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">What are the platform fees?</h3>
                <p className="text-gray-600 text-sm sm:text-base">We charge 3% + €0.30 per paid ticket, plus 23% VAT on the platform fee. Free events have no platform fees! All fees are transparently shown during the event creation process.</p>
              </div>
            </div>
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6">
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">How do I receive payments?</h3>
                <p className="text-gray-600 text-sm sm:text-base">We use Stripe Connect for secure payments. Once you connect your Stripe account, payments from ticket sales are automatically transferred to your account.</p>
              </div>
            </div>
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6">
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">Can I cancel or refund tickets?</h3>
                <p className="text-gray-600 text-sm sm:text-base">If an event is canceled by the organiser you will receive a full refund. Organisers are responsible for their refund policies. Tickets can be transfered.</p>
              </div>
            </div>
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6">
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">Is my data secure?</h3>
                <p className="text-gray-600 text-sm sm:text-base">Absolutely! We use industry-standard encryption and security practices. Payment information is processed by Stripe and never stored on our servers.</p>
              </div>
            </div>
            <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl sm:rounded-2xl shadow-lg border-0">
              <div data-slot="card-content" className="[&amp;:last-child]:pb-6 p-4 sm:p-5 md:p-6">
                <h3 className="text-red-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl">How can I promote my event?</h3>
                <p className="text-gray-600 text-sm sm:text-base">Every event gets a shareable link. Use our built-in social sharing features to promote on Facebook, Twitter, Instagram, and more!</p>
              </div>
            </div>
          </div>
        </div>
        <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-2xl sm:rounded-3xl shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 sm:p-8 md:p-12 text-center text-white">
            <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl">Still Have Questions?</h2>
            <p className="text-red-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">We're here to help! Reach out to our support team and we'll get back to you as soon as possible.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button data-slot="button" className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 has-[>svg]:px-4 bg-white text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl px-6 sm:px-8 text-sm sm:text-base">Send a Message</button>
              <button data-slot="button" className="bg-white inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-10 has-[>svg]:px-4 border-2 border-white text-[rgb(231,0,11)] hover:bg-white/10 rounded-lg sm:rounded-xl px-6 sm:px-8 text-sm sm:text-base">Learn More About Us</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}