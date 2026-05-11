

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaChevronDown, FaUser, FaThLarge } from "react-icons/fa";
import { FiLogOut, FiX, FiCalendar, FiPlus } from "react-icons/fi";
import CustomModal from "./CustomModal";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isOrganizer, isAdministrator, isStripeConnected } = useAuth();
  const { currentCurrency, allCurrencies, setCurrency } = useCurrency();
  const router = useRouter();
  const [showStripeModal, setShowStripeModal] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Events", href: "/events" },
  ];

  const handlePostEvent = () => {
    if (isOrganizer && !isStripeConnected && !isAdministrator) {
      setShowStripeModal(true);
    } else {
      router.push('/post-an-event');
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full  bg-[#ffffffed] shadow-sm sticky top-0 z-[9999]" suppressHydrationWarning>
      {/* ye color heder k liye likha hai bg-white */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="  logoside">
            <img src="/images/logo.png" alt="Logo" className="w-full img-fluid" />
          </Link>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-6">

            {/* Events - Visible on all screens */}
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-0 gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all text-gray-700 hover:text-red-700 "
            >
              <span className="hidden sm:inline">Events</span>
              <FiCalendar className="w-5 h-5  sm:hidden" />
            </Link>

            {/* Currency Selector - Visible on all screens */}
            <div className="relative">
              <button
                onClick={() => setOpenCurrency(!openCurrency)}
                className="flex items-center gap-1.5 text-gray-700 text-sm font-medium hover:text-red-700 bg-gray-50 px-2 sm:px-3 py-1.5 rounded-full transition-all"
              >
                <span className="w-10 h-10  sm:w-5 sm:h-5 flex items-center justify-center bg-white rounded-full shadow-sm text-[18px] sm:text-[10px] font-bold text-red-600 border border-gray-100">
                  {currentCurrency.symbol}
                </span>
                <span className="hidden sm:inline">{currentCurrency.code}</span>
                <FaChevronDown className={`text-[10px] opacity-50 transition-transform hidden sm:block ${openCurrency ? 'rotate-180' : ''}`} />
              </button>

              {openCurrency && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
                  {allCurrencies.map((cur) => (
                    <button
                      key={cur.code}
                      onClick={() => {
                        setCurrency(cur.code);
                        setOpenCurrency(false);
                      }}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-all duration-200 ${currentCurrency.code === cur.code
                        ? 'text-red-700 bg-red-50 font-bold'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-red-600 font-medium'
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-[10px] border border-gray-100">
                          {cur.symbol}
                        </span>
                        <span>{cur.code}</span>
                      </div>
                      {currentCurrency.code === cur.code && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Post Event Button - Visible on all screens */}
            <button
              onClick={handlePostEvent}
              className="inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border-2 border-red-600 text-red-700 hover:bg-red-50 h-9 py-2 px-2 sm:px-4"
            >
              <FiPlus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Post an Event</span>
            </button>

            {/* Profile / Auth - Visible on all screens */}
            {user ? (
              <div className="relative">
                <div
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 text-[18px] cursor-pointer sm:w-9 sm:h-9 sm:text-[15px] bg-red-100  flex items-center justify-center rounded-full text-red-600 font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-800">{user.username}</span>
                  <FaChevronDown className="text-xs text-gray-600 sm:visible  hidden" />
                </div>

                {open && (
                  <div className="absolute right-0 mt-2 w-[224px] bg-white border border-gray-300 rounded-md shadow-lg py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800 truncate">{user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/myaccount" onClick={() => setOpen(false)}>
                        <button className="flex items-center cursor-pointer gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <FaUser className="text-gray-500" /> My Account
                        </button>
                      </Link>
                      {isOrganizer && (
                        <Link href="/organizer-dashboard" onClick={() => setOpen(false)}>
                          <button className="flex items-center cursor-pointer gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            <FaThLarge className="text-gray-500" /> Organiser Dashboard
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={() => { setOpen(false); logout(); }}
                        className="cursor-pointer flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut className="text-red-500" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login-register">
                <button className="cursor-pointer inline-flex text-white items-center justify-center gap-2 whitespace-nowrap rounded-md text-[12px] sm:text-sm font-medium transition-all bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 h-8 sm:h-9 px-3 sm:px-4">
                  Login / Sign Up
                </button>
              </Link>
            )}

            {/* Mobile Menu Button - Commented Out */}
            {/* 
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none z-[1001]"
                aria-label="Toggle menu"
              >
                <span className={`w-6 h-0.5 bg-red-600 rounded-full transition-all duration-300 transform ${isMenuOpen ? "rotate-45 translate-y-2" : "w-6"}`}></span>
                <span className={`w-4 h-0.5 bg-red-600 rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0" : "w-4 self-end mr-2"}`}></span>
                <span className={`w-6 h-0.5 bg-red-600 rounded-full transition-all duration-300 transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : "w-6"}`}></span>
              </button>
            </div>
            */}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay Removed */}

      {/* Mobile Sidebar Container Removed */}

      <CustomModal
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        onConfirm={() => {
          setShowStripeModal(false);
          router.push('/organizer-dashboard');
        }}
        title="Connect Stripe Account"
        message="Please connect your Stripe account in the Organiser Dashboard before posting an event."
        confirmText="Go to Dashboard"
        type="warning"
      />
    </header>
  );
}
