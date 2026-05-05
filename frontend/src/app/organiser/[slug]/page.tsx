"use client";

import { useEffect, useState, use } from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { FaGlobe, FaFacebook, FaInstagram, FaTwitter, FaUsers, FaCalendarAlt, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

interface Organiser {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  slug?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  stats?: {
    followersCount: number;
    totalEvents: number;
  };
}

export default function OrganiserProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [organiser, setOrganiser] = useState<Organiser | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchOrganiser();
    fetchEvents("upcoming");
  }, [slug]);

  const fetchOrganiser = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const res = await fetch(`${API_URL}/api/organizers/${slug}`);
      const data = await res.json();
      setOrganiser(data.data || data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching organiser:", error);
      setLoading(false);
    }
  };

  const fetchEvents = async (type: "upcoming" | "past") => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const res = await fetch(`${API_URL}/api/organizers/${slug}/events?type=${type}`);
      const data = await res.json();
      setEvents(data.data || data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleTabChange = (tab: "upcoming" | "past") => {
    setActiveTab(tab);
    fetchEvents(tab);
  };

  const toggleFollow = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to follow organisers");
        return;
      }
      const res = await fetch(`${API_URL}/api/organizers/${slug}/follow`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setIsFollowing(data.isFollowing);
        fetchOrganiser(); // Refresh stats
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (loading) return <div className=" flex items-center justify-center">Loading...</div>;
  if (!organiser) return <div className=" flex items-center justify-center">Organiser not found</div>;

  const displayName = organiser.firstName ? `${organiser.firstName} ${organiser.lastName}` : organiser.username;
  const initials = organiser.username.substring(0, 2).toUpperCase();

  return (
    <div className=" bg-gray-50">
      <Header />

      {/* Red Banner Section */}
      <div className="bg-red-600 pt-16 pb-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

            {/* Profile Image / Logo */}
            <div className="relative">
              <div className="w-48 h-48 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 text-6xl font-bold border-4 border-white shadow-xl overflow-hidden">
                {organiser.avatar ? (
                  <img src={organiser.avatar} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                <div className="bg-red-50 p-2 rounded-full">
                  <FaUsers className="text-red-600 text-xl" />
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-4xl font-bold mb-2">{displayName}</h1>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm opacity-90 mb-6">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-lg" />
                  <span>{organiser.stats?.followersCount || 0} followers</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-lg" />
                  <span>{organiser.stats?.totalEvents || 0} events hosted</span>
                </div>
              </div>

              <p className="text-lg opacity-90 max-w-2xl mb-8 leading-relaxed">
                {organiser.bio || "No description provided."}
              </p>

              {/* Social Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                {organiser.socialLinks?.website && (
                  <a href={organiser.socialLinks.website} target="_blank" className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition">
                    <FaGlobe className="text-red-600" /> Website
                  </a>
                )}
                {organiser.socialLinks?.facebook && (
                  <a href={organiser.socialLinks.facebook} target="_blank" className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition">
                    <FaFacebook className="text-blue-600" /> Facebook
                  </a>
                )}
                {organiser.socialLinks?.instagram && (
                  <a href={organiser.socialLinks.instagram} target="_blank" className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition">
                    <FaInstagram className="text-pink-600" /> Instagram
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button
                  onClick={toggleFollow}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition transform hover:scale-105 ${isFollowing ? 'bg-white text-red-600' : 'bg-white text-red-600'}`}
                >
                  <FaUsers className="text-lg" /> {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="flex items-center gap-2 bg-white bg-opacity-20 border border-white border-opacity-30 text-white px-8 py-3 rounded-xl text-sm font-bold backdrop-blur-sm hover:bg-opacity-30 transition transform hover:scale-105">
                  <FaEnvelope className="text-lg" /> Contact Organiser
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-20">
        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* Tabs */}
          <div className="flex items-center gap-2 mb-10 bg-gray-50 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => handleTabChange("upcoming")}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition ${activeTab === "upcoming" ? 'bg-red-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => handleTabChange("past")}
              className={`px-8 py-3 rounded-xl text-sm font-bold transition ${activeTab === "past" ? 'bg-red-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Past Events
            </button>
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.length > 0 ? (
              events.map((event) => (
                <Link href={`/event/${event.slug || event._id}`} key={event._id} className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-56">
                    <img src={event.thumbnail || event.banner} alt={event.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-red-600 shadow-sm">
                      {event.category?.name || "Community"}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition">
                      {event.title}
                    </h3>
                    <div className="space-y-2.5 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                          <FaCalendarAlt size={14} />
                        </div>
                        <span>{new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at {event.startTime}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span>{event.location?.city}, {event.location?.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <p className="font-bold text-red-600">
                        {event.ticketTypes?.[0]?.price ? `From £${event.ticketTypes[0].price}` : 'Free'}
                      </p>
                      <span className="text-xs font-bold bg-red-50 text-red-600 px-4 py-2 rounded-xl group-hover:bg-red-600 group-hover:text-white transition">
                        Get Tickets
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <FaCalendarAlt className="mx-auto text-4xl mb-4 opacity-20" />
                <p className="text-lg font-medium">No events found in this category.</p>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
