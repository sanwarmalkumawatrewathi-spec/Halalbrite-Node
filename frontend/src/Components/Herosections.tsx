import React from 'react'
import { IoSearch } from "react-icons/io5";
import { TbCalendarEvent } from "react-icons/tb";
export default function Herosections() {
  return (
    <section
      className="relative max-w-7xl mx-auto h-[442px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url('/heroimage.jpg')", // 👈 put image in public/images
      }}
    >
      {/* Overlay (dark effect) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative text-center text-white px-4 max-w-3xl">
        <h1 className="text-xl md:text-5xl font-bold mb-4">
          Discover. Host. Connect.
        </h1>

        <p className="text-lg md:text-[22px] mb-8">
          Your hub for events that respect your values and build <br /> community.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center gap-2 border-2 border-red-700 text-red-700 bg-white px-4 py-2 rounded-md font-[14px] hover:bg-red-50">
            <IoSearch /> Find Events
          </button>

          <button className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md font-[14px] hover:bg-red-700">
            <TbCalendarEvent />   Post an Event
          </button>
        </div>

        {/* Location Dropdown */}
       <div className="mt-6 relative inline-block">

  {/* Trigger */}
  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md text-gray-500 text-sm cursor-pointer">
    <span>📍</span>
    <span>find events in..</span>
    <span className="ml-2 text-xs">▾</span>
  </div>

  
</div>
      </div>
    </section>
  )
}
