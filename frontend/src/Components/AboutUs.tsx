import React from 'react';

export default function AboutUs() {
  return (
    <main className="flex-1 w-full bg-gray-50 pb-20">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart w-3.5 h-3.5 sm:w-4 sm:h-4"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            <span className="text-[16px]">Built by Muslims to Empower Muslim Communities</span>
          </div>
          <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">About Halalbrite</h1>
          <p className="text-red-100 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0 text-[20px]">We're on a mission to connect Muslim communities worldwide through seamless event experiences. Halalbrite is more than just a ticketing platform—it's a bridge that brings people together.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
        {/* Our Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl pb-6 p-5 sm:p-6 md:p-8 border border-gray-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
            </div>
            <h3 className="text-red-900 mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              To provide Muslim event organisers and communities with a trusted, secure, reliable and halal-compliant platform that makes event management simple, transparent, and accessible. We believe that we can be reliant on out own platforms and not depend on platforms that don't share our values. Built by Muslims for Muslims.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl pb-6 p-5 sm:p-6 md:p-8 border border-gray-100">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>
            </div>
            <h3 className="text-red-900 mb-3 sm:mb-4 text-xl sm:text-2xl md:text-3xl font-bold">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              To become the leading Muslim event platform connecting Muslim communities globally, fostering unity and collaboration through memorable experiences. We envision a world where organising and attending halal events is effortless, secure, and inspiring for everyone involved.
            </p>
          </div>
        </div>

        {/* Why Choose Halalbrite */}
        <div className="text-center max-w-3xl mx-auto mb-12 mt-8">
          <h2 className="text-3xl font-bold text-red-900 mb-4">Why Choose Halalbrite?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We've built a platform that understands the unique needs of Muslim event organisers and attendees. With Muslim awareness and Boycotts rising we are looking for alternatives to the status-quo. Why rely on others when we can be self reliant!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl pb-6 p-5 sm:p-6 md:p-8 border border-gray-100 text-center flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e7000b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <h4 className="text-lg sm:text-xl mb-3">Halal-Compliant</h4>
            <p className="text-gray-500 text-sm">Built to help the Muslim Community. Transparent fees, secure payments, and ethical business practices.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl pb-6 p-5 sm:p-6 md:p-8 border border-gray-100 text-center flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e7000b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <h4 className="text-lg sm:text-xl mb-3">Easy to Use</h4>
            <p className="text-gray-500 text-sm">Intuitive interface for both organisers and attendees. Create events in minutes, buy tickets in seconds.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl pb-6 p-5 sm:p-6 md:p-8 border border-gray-100 text-center flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e7000b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h4 className="text-lg sm:text-xl mb-3">Ecosystem</h4>
            <p className="text-gray-500 text-sm">By Muslims for Muslims - Supporting Spread Halal events.</p>
          </div>
        </div>

        {/* Built for Modern Event Management */}
        <div className="bg-red-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-16 relative overflow-hidden">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Built for Modern Event Management</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 md:gap-y-8">
            <div className="flex gap-4">
              <div className="mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-200"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Stripe-Powered Payments</h4>
                <p className="text-red-100 text-sm leading-relaxed">Secure payment processing with direct payouts to organisers via Stripe Connect.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-200"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Digital Tickets</h4>
                <p className="text-red-100 text-sm leading-relaxed">Instant digital tickets for seamless event check-ins.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-200"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Real-Time Analytics</h4>
                <p className="text-red-100 text-sm leading-relaxed">Comprehensive dashboard with sales tracking, attendee insights, and revenue analytics.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-200"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Multi-Ticket Support</h4>
                <p className="text-red-100 text-sm leading-relaxed">Create multiple ticket types with flexible pricing and descriptions.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-200"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Interactive Maps</h4>
                <p className="text-red-100 text-sm leading-relaxed">Help attendees discover nearby events with our integrated location features.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-200"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg></div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Social Sharing</h4>
                <p className="text-red-100 text-sm leading-relaxed">Amplify your events with built-in sharing to major social platforms.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ready to Start Your Journey */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl mb-8">
          <h2 className="mb-3 sm:mb-4 font-bold text-[36px]">Ready to Start Your Journey?</h2>
          <p className="text-red-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
            Whether you're organizing your first community Iftar or managing a major Islamic conference, Halalbrite has everything you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/post-an-event" className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive h-10 has-[>svg]:px-4 bg-white text-red-600 hover:bg-red-50 rounded-xl px-6 sm:px-8 text-sm sm:text-base">
              Create Your First Event
            </a>
            <a href="/events" className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-white hover:text-accent-foreground dark:bg-input/30 dark: dark:hover:bg-input/50 h-10 has-[>svg]:px-4 border-2 border-white text-[#e7000b] hover:bg-white/10 rounded-xl px-6 sm:px-8 text-sm sm:text-base">
              Browse Events
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}