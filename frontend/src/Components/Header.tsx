

"use client";

import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
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

          {/* Events */}
          <Link
            href="/events"
            className="text-gray-700 text-sm font-medium hover:text-red-700"
          >
            Events
          </Link>

          {/* Post Event */}
          <Link href="/postEvent">
            <button className="flex items-center gap-2 border border-red-700 text-red-700 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-50">
              <span className="text-lg">+</span>
              Post an Event
            </button>
          </Link>

          {/* Profile Dropdown */}
          <div className="relative">

            {/* Top Click Area */}
            <div
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-200"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full" />

              <span className="text-sm font-medium text-gray-800">
                Ahmed Hassan
              </span>

              <FaChevronDown className="text-xs text-gray-600" />
            </div>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-[224px] bg-white border border-gray-300 rounded-md shadow-lg">

                {/* User Info */}
                <div className="px-4  border-b border-b-gray-300">
                  <p className="text-sm font-semibold text-gray-800 ">
                    Ahmed Hassan
                  </p>
                  <p className="text-xs text-gray-500">
                    ahmed@example.com
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-2">

                  <Link href={"/myaccount"}>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 w-full border-b border-b-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="text-gray-500" />
                    My Account
                  </button>
                  </Link>
                  <button
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FiLogOut className="text-gray-500"/>
                    Log Out
                  </button>

                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}