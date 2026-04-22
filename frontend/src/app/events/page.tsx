"use client";
import EventCardGrid from '@/Components/EventCardGrid'
import FeaturedEvents from '@/Components/FeaturedEvents'
import FilterBar from '@/Components/FilterBar'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import dynamic from 'next/dynamic'
const MapComponent = dynamic(() => import('@/Components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-[500px] w-full bg-gray-100 animate-pulse rounded-2xl" />
});
import React from 'react'

export default function Event() {
  return (
    <div>
      <Header/>
      <section className='pt-14 pb-7'>
      <MapComponent/>
</section>

<FilterBar/>

<EventCardGrid/>



      <Footer/>
    </div>
  )
}
