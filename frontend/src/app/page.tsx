"use client";

import { useEffect, useState } from 'react';
import Eventpage from '@/app/eventpage/page'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import Herosections from '@/Components/Herosections'
import MapComponent from '@/Components/MapComponent'
import React from 'react'

export default function Page() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await fetch(`${baseUrl}/api/events`);
        const data = await response.json();
        // The API returns an array directly based on our previous findings
        const eventData = Array.isArray(data) ? data : data.data || [];
        setEvents(eventData);
      } catch (error) {
        console.error("Failed to fetch events for map:", error);
      }
    };
    fetchEvents();
  }, []);
 
  return (
    <div className="bg-[#fef3f6]">
      <Header/>
      <Herosections/>

      <Eventpage/>
      
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-red-900 mb-2">Event Map</h2>
        <p className="text-gray-600 mb-6">Explore events happening near you</p>
        <MapComponent events={events} />
      </div>

      <Footer/>
    </div>
  )
}
