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
  const editId = searchParams.get('edit');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/authpage');
      } else if (!isOrganizer) {
        router.push('/');
      }
    }
  }, [user, loading, isOrganizer, router]);

  if (loading) {
    return (
      <div className="text-xl font-semibold text-red-600 animate-pulse text-center py-20">
        Loading...
      </div>
    );
  }

  if (!user || !isOrganizer) {
    return null;
  }

  if (!isStripeConnected) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-yellow-200 p-10 text-center space-y-6 max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600 text-4xl">
          ⚠️
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Stripe Connection Required</h1>
          <p className="text-gray-600">
            To ensure secure ticket payments and payouts, we require all organisers to connect a Stripe account before publishing events.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => router.push('/organizer-dashboard')}
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 transition"
          >
            Go to Dashboard to Connect
          </button>
          <button 
            onClick={() => router.push('/')}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className='mb-8'>
        <h2 className='text-red-900 text-3xl font-medium mb-3'>
          {editId ? 'Edit Event' : 'Create New Event'}
        </h2>
        <p className='text-[#1c1917]'>Fill in all the details below and click Review &amp; Publish when ready</p>
      </section>
      <EventForm editId={editId} />
    </>
  );
}

export default function PostEvent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      
      <main className="max-w-7xl mx-auto p-6 py-10">
        <Suspense fallback={
          <div className="text-xl font-semibold text-red-600 animate-pulse text-center py-20">
            Loading...
          </div>
        }>
          <PostEventFormContent />
        </Suspense>
      </main>
      
      <Footer/>
    </div>
  );
}
