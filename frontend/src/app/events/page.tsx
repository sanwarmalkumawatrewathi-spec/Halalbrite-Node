import EventCardGrid from '@/Components/EventCardGrid'
import FeaturedEvents from '@/Components/FeaturedEvents'
import FilterBar from '@/Components/FilterBar'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import MapComponent from '@/Components/MapComponent'
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
