import EventForm from '@/Components/EventForm'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import React from 'react'

export default function postEvent() {
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
