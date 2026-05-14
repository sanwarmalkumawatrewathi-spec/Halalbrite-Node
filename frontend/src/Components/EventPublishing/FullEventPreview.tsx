"use client";

import React from 'react';
import { FiCalendar, FiClock, FiShare2, FiHeart, FiX, FiCheck, FiEdit3 } from 'react-icons/fi';
import { Calendar, Clock, Share2, Heart, Users } from "lucide-react";
import { LocationIcon } from '@/Components/Icons';
import { getImageUrl } from "@/utils/imageUtils";

interface FullEventPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
  eventData: any;
  tickets: any[];
  organisations: any[];
}

export default function FullEventPreview({ isOpen, onClose, onPublish, eventData, tickets, organisations }: FullEventPreviewProps) {
  if (!isOpen) return null;

  const scrollToSection = (id: string) => {
    onClose();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "TBA";
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const selectedOrg = organisations.find(o => o._id === eventData.organizerProfile);
  const bannerImage = eventData.banner;
  const displayImage = typeof bannerImage === 'string' && bannerImage.startsWith('blob:') 
    ? bannerImage 
    : (getImageUrl(bannerImage) || "/images/noimage.jpg");

  return (
    <div className="fixed inset-0 z-[300] bg-white overflow-y-auto animate-in fade-in duration-300">
      
      {/* Top Bar / Controls */}
      <div className="sticky top-0 z-[310] bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
            <span className="font-bold text-gray-900">Halalbrite</span>
          </div>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <div className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-2 uppercase">
            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            Preview Mode
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2"
          >
            <FiEdit3 className="text-lg" /> Edit Details
          </button>
          <button 
            onClick={onPublish}
            className="px-8 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-200 active:scale-95"
          >
            <FiCheck className="text-lg" /> Publish Event
          </button>
        </div>
      </div>

      <div className="bg-[#fef3f6] min-h-screen pb-20">
        
        {/* Hero Section (Mimics EventDetails) */}
        <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden group cursor-pointer" onClick={onClose}>
          <img
            src={displayImage}
            alt={eventData.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e: any) => {
              e.target.onerror = null;
              e.target.src = "/images/noimage.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all">
            <div className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-white/30 shadow-2xl">
              <FiEdit3 /> Click anywhere to edit header
            </div>
          </div>

          <div className="absolute bottom-10 left-0 right-0 max-w-7xl mx-auto px-6 text-white">
            <span className="bg-[#eeeceb] text-red-600 text-xs px-4 py-1 rounded-[8px] font-bold tracking-wide">
              {eventData.categoryName || "Event"}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mt-4 max-w-3xl leading-tight mb-3">
              {eventData.title || "Untitled Event"}
            </h1>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="opacity-80" />
                <span className="font-medium">
                  <span className="opacity-80">Start:</span> {formatDate(eventData.startDate)} • {eventData.startTime || "TBA"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="opacity-80" />
                <span className="font-medium">
                  <span className="opacity-80">End:</span> {formatDate(eventData.endDate)} • {eventData.endTime || "TBA"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Organizer Section */}
        <section className="max-w-7xl mx-auto px-6 mt-8 relative group cursor-pointer" onClick={onClose}>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-red-100">
            <div className="absolute top-4 right-8 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-red-600 font-bold text-sm">
              <FiEdit3 /> Edit Organizer
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-red-100 shadow-md bg-white">
                  {selectedOrg?.logo ? (
                    <img src={getImageUrl(selectedOrg.logo)} alt="Org" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-red-50 flex items-center justify-center text-red-700 font-bold">OR</div>
                  )}
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Organised by</p>
                  <h3 className="text-red-900 text-xl font-bold">{eventData.organizerName || "Organizer"}</h3>
                  <p className="text-gray-500 text-sm">0 followers (Preview)</p>
                </div>
              </div>
              <button className="px-6 py-2 border-2 border-red-500 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all">
                Follow
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 relative group cursor-pointer border-2 border-transparent hover:border-red-100 transition-all" onClick={onClose}>
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-red-600 font-bold text-sm">
                  <FiEdit3 /> Edit Description
                </div>
                <h2 className="text-2xl font-bold text-red-900 mb-6">Event Overview</h2>
                <div className="prose prose-red max-w-none text-gray-700 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: eventData.description || "No description provided." }} />
                </div>
              </div>

              {/* Tickets Section Mockup */}
              <div className="bg-white rounded-3xl shadow-xl p-8 relative group cursor-pointer border-2 border-transparent hover:border-red-100 transition-all" onClick={onClose}>
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-red-600 font-bold text-sm">
                  <FiEdit3 /> Edit Tickets
                </div>
                <h2 className="text-2xl font-bold text-red-900 mb-6">Tickets</h2>
                <div className="space-y-4">
                  {tickets.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-red-100 transition-all">
                      <div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-sm text-gray-500">{t.quantity} available</p>
                      </div>
                      <div className="text-xl font-bold text-red-600">
                        {t.price === 0 ? "FREE" : `$${t.price}`}
                      </div>
                    </div>
                  ))}
                  {tickets.length === 0 && <p className="text-gray-400 italic">No tickets added yet.</p>}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
                <div>
                  <h4 className="text-lg font-bold text-red-900 mb-4">Event Details</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-red-600" />
                      <div className="text-sm">
                        <span className="font-bold text-gray-900">Start:</span> {formatDate(eventData.startDate)} • {eventData.startTime || "TBA"}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-red-600" />
                      <div className="text-sm">
                        <span className="font-bold text-gray-900">End:</span> {formatDate(eventData.endDate)} • {eventData.endTime || "TBA"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <LocationIcon size={18} className="text-red-600" />
                    <h4 className="font-bold text-gray-900">Location</h4>
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    <p className="font-bold text-gray-900 mb-1">{eventData.venue || "Venue TBA"}</p>
                    {eventData.eventType === 'online' ? (
                      <p className="text-red-600 font-medium">Online Event - Link shared after booking</p>
                    ) : (
                      <p>{eventData.location?.address || "Address not specified"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <button className="w-full py-3 rounded-2xl bg-gray-50 text-gray-900 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all border border-gray-100">
                    <Share2 size={18} /> Share Event
                  </button>
                  <button className="w-full py-3 rounded-2xl bg-gray-50 text-gray-900 text-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all border border-gray-100">
                    <Heart size={18} /> Save Event
                  </button>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
