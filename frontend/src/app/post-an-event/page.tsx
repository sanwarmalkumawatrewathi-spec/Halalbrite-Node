"use client";

import EventForm from '@/Components/EventForm'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import React, { useEffect, Suspense } from 'react'
import { useAuth } from '@/context/authContext'
import { useRouter, useSearchParams } from 'next/navigation'

function PostEventFormContent() {
  const { user, loading, isOrganizer, isStripeConnected } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams.get('edit');
  const editId = editParam && editParam !== 'null' && editParam !== 'undefined' ? editParam : null;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login-register');
      return;
    }

    if (!loading && user && !isOrganizer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [user, loading, isOrganizer]);

  if (loading) {
    return (
      <div className="text-xl font-semibold text-red-600 animate-pulse text-center py-20">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <section className='mb-8 '>
        <h2 className='text-red-900 text-3xl font-400 font-medium mb-3'>
          {editId ? 'Edit Event' : 'Create New Event'}
        </h2>
        <p className='text-[#1c1917]'>Fill in all the details below and click Review &amp; Publish when ready</p>
      </section>

      <div className="relative">
        {/* Restricted Overlay for Non-Organizers - Only on the Form */}
        {!isOrganizer && (
          <div className="fixed top-16 inset-x-0 bottom-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[3px]"></div>
            <div className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl border border-red-100 max-w-md w-full text-center transform scale-110">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-red-900 mb-2">Organiser Access Required</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                To create and publish events on Halalbrite, you need to upgrade your account to an Organiser profile.
              </p>
              <button
                onClick={() => router.push('/myaccount')}
                className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200/50 flex items-center justify-center gap-2"
              >
                Become an Organiser
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className={!isOrganizer ? 'opacity-40 pointer-events-none select-none blur-[3px]' : ''}>
          <EventForm editId={editId} />
        </div>
      </div>
    </>
  );
}

export default function PostEvent() {
  return (
    <div className=" bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto p-6 py-10">
        <Suspense fallback={
          <div className="text-xl font-semibold text-red-600 animate-pulse text-center py-20">
            Loading...
          </div>
        }>
          <PostEventFormContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
