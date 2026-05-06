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
      if (!user) {
        router.push('/login-register');
      }
  }, [user, loading, isOrganizer, router]);

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
      <EventForm editId={editId} />
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
