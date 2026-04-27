

"use client";

import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaUser, FaThLarge } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import { useAuth } from "@/context/authContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [openCurrency, setOpenCurrency] = useState(false);
  const { user, logout, isOrganizer, isAdministrator, isStripeConnected } = useAuth();
  const { currentCurrency, allCurrencies, setCurrency } = useCurrency();
  const router = useRouter();

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link href="/">
          <div className="w-16 sm:w-20 h-12 sm:h-16 flex items-center cursor-pointer">
            <svg
              viewBox="0 0 100 120"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <text
                x="50"
                y="60"
                textAnchor="middle"
                fill="#DC2626"
                fontSize="60"
                fontFamily="cursive"
                fontWeight="700"
              >
                H
              </text>
              <circle cx="50" cy="38" r="3" fill="#EF4444" />
              <text
                x="50"
                y="92"
                textAnchor="middle"
                fill="#DC2626"
                fontSize="20"
                fontWeight="700"
              >
                HalalBrite
              </text>
            </svg>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">

          <div className="relative">
            <button 
              onClick={() => setOpenCurrency(!openCurrency)}
              className="flex items-center gap-1.5 text-gray-700 text-sm font-medium hover:text-red-700 bg-gray-50 px-3 py-1.5 rounded-full transition-all"
            >
              <span className="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm text-[10px] font-bold text-red-600 border border-gray-100">
                {currentCurrency.symbol}
              </span>
              {currentCurrency.code}
              <FaChevronDown className={`text-[10px] opacity-50 transition-transform ${openCurrency ? 'rotate-180' : ''}`} />
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
                    className={`flex items-center justify-between w-full px-4 py-3 text-sm transition-all duration-200 ${
                      currentCurrency.code === cur.code 
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

          {/* Events */}
          <Link
            href="/events"
            className="text-gray-700 text-sm font-medium hover:text-red-700"
          >
            Events
          </Link>

          {/* Post Event */}
          <button 
            onClick={() => {
              if (isOrganizer && !isStripeConnected && !isAdministrator) {
                alert("Please connect your Stripe account in the Organiser Dashboard before posting an event.");
                router.push('/OrganiserDashboard');
              } else {
                router.push('/post-an-event');
              }
            }}
            className="flex items-center gap-2 border border-red-700 text-red-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-50"
          >
            <span className="text-lg">+</span>
            Post an Event
          </button>

          {/* Profile / Auth */}
          {user ? (
            <div className="relative">
              {/* Top Click Area */}
              <div
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 bg-red-100 flex items-center justify-center rounded-full text-red-600 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="text-sm font-medium text-gray-800">
                  {user.username}
                </span>

                <FaChevronDown className="text-xs text-gray-600" />
              </div>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 mt-2 w-[224px] bg-white border border-gray-300 rounded-md shadow-lg py-1">
                  {/* User Info */}
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link href="/myaccount" onClick={() => setOpen(false)}>
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <FaUser className="text-gray-500" />
                        My Account
                      </button>
                    </Link>
                    {isOrganizer && (
                      <Link href="/OrganiserDashboard" onClick={() => setOpen(false)}>
                        <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <FaThLarge className="text-gray-500" />
                          Organiser Dashboard
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="text-red-500" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/authpage">
              <button className="bg-red-600 text-white px-5 py-1.5 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                Login / Sign Up
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}