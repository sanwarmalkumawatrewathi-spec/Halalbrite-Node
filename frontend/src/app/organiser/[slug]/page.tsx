"use client";

import { useEffect, useState, use, useRef } from "react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { FiGlobe, FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiLinkedin, FiUsers, FiCalendar, FiMail, FiMapPin } from "react-icons/fi";
import Link from "next/link";
import { getImageUrl } from "@/utils/imageUtils";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/authContext";
import EventCard from "@/Components/EventCard";

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
  categories?: string[];
  country?: string;
}

export default function OrganiserProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { formatPrice } = useCurrency();
  const { user, toggleFollowOrganizer } = useAuth();
  const [organiser, setOrganiser] = useState<Organiser | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFollowPrompt, setShowFollowPrompt] = useState(false);
  const [popupMessage, setPopupMessage] = useState<{ title?: string, content: string } | null>(null);
  const [showSavedLink, setShowSavedLink] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const followTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (followTimerRef.current) clearTimeout(followTimerRef.current);
    };
  }, []);

  useEffect(() => {
    fetchOrganiser();
    fetchEvents("upcoming");
  }, [slug]);

  useEffect(() => {
    if (user && organiser) {
      const isFollowingOrg = user.followedOrganizers?.includes(organiser._id);
      setIsFollowing(!!isFollowingOrg);
    } else {
      setIsFollowing(false);
    }
  }, [user, organiser]);

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
    setEventsLoading(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const res = await fetch(`${API_URL}/api/organizers/${slug}/events?type=${type}`);
      const data = await res.json();
      setEvents(data.data || data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleTabChange = (tab: "upcoming" | "past") => {
    setActiveTab(tab);
    fetchEvents(tab);
  };

  const toggleFollow = async () => {
    try {
      if (!user) {
        setPopupMessage({ title: "Login Required", content: "Please login to follow organisers" });
        return;
      }
      if (!organiser) return;
      const res = await toggleFollowOrganizer(organiser._id);
      if (res.success) {
        setIsFollowing(!!res.isFollowing);
        setOrganiser(prev => prev ? { ...prev, stats: { ...prev.stats!, followersCount: res.followersCount !== undefined ? res.followersCount : prev.stats!.followersCount } } : null);
        setShowSavedLink(true);
        if (followTimerRef.current) clearTimeout(followTimerRef.current);
        followTimerRef.current = setTimeout(() => {
          setShowSavedLink(false);
        }, 10000);
      } else {
        setPopupMessage({ title: "Action Failed", content: res.message || "Failed to follow organizer" });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingContact(true);
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const res = await fetch(`${API_URL}/api/organizers/${organiser?._id || slug}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await res.json();
      if (res.ok) {
        setShowSuccessModal(true);
        setShowContactModal(false);
        setContactForm({ fullName: "", email: "", subject: "", message: "" });
      } else {
        setPopupMessage({ title: "Failed to Send", content: data.message || "Failed to send message" });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setPopupMessage({ title: "Error", content: "An error occurred. Please try again." });
    } finally {
      setSubmittingContact(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col" suppressHydrationWarning>
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-red-600 font-semibold tracking-wide animate-pulse">Loading Organizer Profile...</p>
      </div>
      <Footer />
    </div>
  );

  if (!organiser) return (
    <div className="min-h-screen bg-gray-50 flex flex-col" suppressHydrationWarning>
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-gray-600 text-xl font-medium">Organiser not found</p>
        <Link href="/" className="text-red-600 hover:underline">← Back to Home</Link>
      </div>
      <Footer />
    </div>
  );

  const displayName = organiser.firstName ? `${organiser.firstName} ${organiser.lastName}` : organiser.username;
  const initials = organiser.username.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" suppressHydrationWarning>
      <Header />

      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#d32f2f] pt-12 pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
              
              {/* Organizer Logo */}
              <div className="relative shrink-0">
                <div className="w-40 h-40 md:w-48 md:h-48 bg-white/10 rounded-[2.5rem] border-[6px] border-white/20 shadow-2xl flex items-center justify-center text-white text-6xl font-bold overflow-hidden backdrop-blur-md">
                  {organiser.avatar ? (
                    <img src={getImageUrl(organiser.avatar)} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border-4 border-[#d32f2f]">
                  <FiUsers className="text-[#d32f2f] text-xl" />
                </div>
              </div>

              {/* Organizer Details */}
              <div className="flex-1 text-center md:text-left text-white pt-2">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">{displayName}</h1>
                
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-6 gap-y-3 mb-6 text-sm font-medium text-white/90">
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-lg" />
                    <span>{organiser.stats?.followersCount?.toLocaleString() || 0} followers</span>
                  </div>
                  {organiser.categories && organiser.categories.length > 0 && (
                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-lg" />
                      <span>{organiser.categories.join(", ")}</span>
                    </div>
                  )}
                </div>

                <p className="text-lg text-white/90 max-w-3xl mb-8 leading-relaxed font-medium">
                  {organiser.bio || "Welcome to our organiser profile. We host amazing events for the community."}
                </p>

                {/* Social Pills */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
                  {organiser.socialLinks?.website && (
                    <a href={organiser.socialLinks.website} target="_blank" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-sm hover:bg-gray-50 transition-all">
                      <FiGlobe className="text-[#d32f2f] text-sm" /> Website
                    </a>
                  )}
                  {organiser.socialLinks?.facebook && (
                    <a href={organiser.socialLinks.facebook} target="_blank" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-sm hover:bg-gray-50 transition-all">
                      <FiFacebook className="text-[#d32f2f] text-sm" /> Facebook
                    </a>
                  )}
                  {organiser.socialLinks?.twitter && (
                    <a href={organiser.socialLinks.twitter} target="_blank" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-sm hover:bg-gray-50 transition-all">
                      <FiTwitter className="text-[#d32f2f] text-sm" /> Twitter
                    </a>
                  )}
                  {organiser.socialLinks?.instagram && (
                    <a href={organiser.socialLinks.instagram} target="_blank" className="flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-sm hover:bg-gray-50 transition-all">
                      <FiInstagram className="text-[#d32f2f] text-sm" /> Instagram
                    </a>
                  )}
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap items-start justify-center md:justify-start gap-4">
                  <div className="flex flex-col items-center">
                    <button 
                      onClick={toggleFollow}
                      className="flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-xl text-sm font-bold shadow-xl shadow-black/10 hover:bg-gray-50 transition-all active:scale-95"
                    >
                      <FiUsers className="text-lg" /> {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    {showSavedLink && (
                      <Link
                        href="/myaccount?tab=saved"
                        className="text-xs text-red-600 hover:text-red-700 hover:underline font-semibold mt-2 animate-in fade-in slide-in-from-top-1 duration-200"
                      >
                        View saved content
                      </Link>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="flex items-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-xl text-sm font-bold shadow-xl shadow-black/10 hover:bg-gray-50 transition-all active:scale-95 h-[48px]"
                  >
                    <FiMail className="text-lg" /> Contact Organiser
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-24">
          
          {/* Tab Switcher */}
          <div className="inline-flex items-center bg-white p-1 rounded-2xl shadow-xl border border-gray-100 mb-12">
            <button
              onClick={() => handleTabChange("upcoming")}
              className={`px-8 py-3 rounded-xl text-sm font-extrabold transition-all ${activeTab === "upcoming" ? 'bg-[#d32f2f] text-white shadow-lg shadow-red-200' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => handleTabChange("past")}
              className={`px-8 py-3 rounded-xl text-sm font-extrabold transition-all ${activeTab === "past" ? 'bg-[#d32f2f] text-white shadow-lg shadow-red-200' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Past Events
            </button>
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {eventsLoading ? (
              <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-red-600 font-semibold tracking-wide animate-pulse">Loading {activeTab} events...</p>
              </div>
            ) : events.length > 0 ? (
              events.map((event) => (
                <EventCard
                  key={event._id}
                  id={event._id}
                  slug={event.slug}
                  title={event.title}
                  organizer={displayName}
                  organizerId={organiser._id}
                  organizerSlug={organiser.slug}
                  startDate={event.startDate}
                  endDate={event.endDate}
                  startTime={event.startTime}
                  endTime={event.endTime}
                  location={`${event.location?.city || "Online"}`}
                  price={event.price ?? event.ticketTypes?.[0]?.price ?? 0}
                  priceLabel={event.priceLabel}
                  image={event.thumbnail || event.banner}
                  category={event.category?.name || "Event"}
                />
              ))
            ) : (
              <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCalendar className="text-gray-300 text-3xl" />
                </div>
                <p className="text-xl font-bold text-gray-900 mb-2">No events found</p>
                <p className="text-gray-500 font-medium">This organiser hasn't scheduled any {activeTab} events yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#d32f2f] p-8 text-white relative">
              <button 
                onClick={() => setShowContactModal(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <FiMail className="rotate-45" />
              </button>
              <h2 className="text-2xl font-black mb-2">Contact {organiser.username}</h2>
              <p className="text-white/80 text-sm font-medium">Send a message directly to the event organiser.</p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={contactForm.fullName}
                    onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-[#d32f2f] focus:border-[#d32f2f] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-[#d32f2f] focus:border-[#d32f2f] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                <input
                  required
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  placeholder="Query regarding your events"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-[#d32f2f] focus:border-[#d32f2f] outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-semibold focus:ring-2 focus:ring-[#d32f2f] focus:border-[#d32f2f] outline-none transition-all resize-none"
                />
              </div>

              <button
                disabled={submittingContact}
                className="w-full bg-[#d32f2f] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submittingContact ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FiMail className="text-lg" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 text-center p-10">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce duration-1000">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Message Sent!</h3>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">
              Your message has been delivered to {organiser.username}. They will get back to you shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#d32f2f] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
            >
              Great, thanks!
            </button>
          </div>
        </div>
      )}



      {/* Error/Information Popup Modal */}
      {popupMessage && (
        <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 text-center p-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[#d32f2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{popupMessage.title || "Notice"}</h3>
            <p className="text-gray-500 font-medium mb-6 leading-relaxed text-sm">
              {popupMessage.content}
            </p>
            <button
              onClick={() => setPopupMessage(null)}
              className="w-full bg-[#d32f2f] text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-red-100 hover:bg-red-700 transition-all active:scale-95"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
