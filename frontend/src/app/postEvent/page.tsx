"use client";

import EventForm from '@/Components/EventForm'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import React, { useEffect } from 'react'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'

export default function PostEvent() {
  const { user, loading, isOrganizer } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/authpage');
      } else if (!isOrganizer) {
        // If logged in but not an organizer, maybe redirect to home or show error
        // The user specifically said "only for Organizer and logged in"
        router.push('/');
      }
    }
  }, [user, loading, isOrganizer, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-red-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user || !isOrganizer) {
    return null; // Will redirect via useEffect
  }

  return (
    <div>
      <Header/>
      <section className='max-w-7xl mx-auto p-6'>
        <h2 className='text-red-900 text-3xl font-medium mb-3'>Create New Event</h2>
        <p className='text-[#1c1917]'>Fill in all the details below and click Review & Publish when ready</p>
      </section>
      <EventForm/>
      <Footer/>
    </div>
  )
}
