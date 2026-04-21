


"use client";

import Link from "next/link";
import { useState } from "react";

type TabType = "login" | "signup";
type RoleType = "attendee" | "organiser";

export default function Signuppage() {
  const [tab, setTab] = useState<TabType>("login");
  const [role, setRole] = useState<RoleType>("attendee");

  return (
    <div className=" flex flex-col items-center justify-center bg-gray-100 px-4 pb-4">
      
      {/* Logo */}
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-red-600">H</div>
        <h1 className="text-2xl font-semibold text-red-600">HalalBrite</h1>
        <p className="text-gray-500 mt-2">Connect with your community</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6">

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full mb-6 p-1">
          <button
            onClick={() => setTab("login")}
            className={`w-1/2 py-2 rounded-full text-sm ${
              tab === "login" ? "bg-white text-red-600 shadow" : "text-gray-500"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`w-1/2 py-2 rounded-full text-sm ${
              tab === "signup" ? "bg-white text-red-600 shadow" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* ================= SIGN UP ================= */}
        {tab === "signup" && (
          <>
            {/* Account Type */}
            <div className="bg-red-50 p-4 rounded-xl mb-4">
              <p className="text-sm font-medium mb-3">Choose Account Type</p>

              <div className="grid grid-cols-2 gap-3">
                {/* Attendee */}
                <button
                  onClick={() => setRole("attendee")}
                  className={`p-4 rounded-xl border text-left ${
                    role === "attendee"
                      ? "border-red-500 bg-white"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-red-500 mb-2">👤</div>
                  <p className="font-medium text-sm">Attendee</p>
                  <p className="text-xs text-gray-500">
                    Discover & attend events
                  </p>
                </button>

                {/* Organiser */}
                <button
                  onClick={() => setRole("organiser")}
                  className={`p-4 rounded-xl border text-left ${
                    role === "organiser"
                      ? "border-red-500 bg-white"
                      : "border-gray-200"
                  }`}
                >
                  <div className="text-gray-500 mb-2">🏢</div>
                  <p className="font-medium text-sm">Organiser</p>
                  <p className="text-xs text-gray-500">
                    Create & manage events
                  </p>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 hover:bg-gray-50">
            <span className="w-4 h-4 bg-black rounded-sm"></span>
            Continue with Apple
          </button>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 hover:bg-gray-50">
            <span className="w-4 h-4 bg-red-500 rounded-full"></span>
            Continue with Google
          </button>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full py-2 hover:bg-gray-50">
            <span className="w-4 h-4 bg-blue-600 rounded-sm"></span>
            Continue with Meta
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">
            {tab === "login"
              ? "Or continue with email"
              : "Or sign up with email"}
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full mt-1 px-4 py-2  rounded-lg focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label className="text-sm">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2  rounded-lg focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Confirm Password only in signup */}
          {tab === "signup" && (
            <div>
              <label className="text-sm">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}

          {/* Forgot (only login) */}
          {tab === "login" && (
            <div className="text-right">
              <button className="text-red-500 text-sm">
                Forgot password?
              </button>
            </div>
          )}

          {/* Terms (only signup) */}
          {tab === "signup" && (
            <p className="text-xs text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </p>
          )}

          {/* Submit */}
          <button className="w-full bg-red-600 text-white py-3 rounded-full font-medium hover:bg-red-700">
            {tab === "login" ? "Log In" : "Create Account"}
          </button>
        </div>
      </div>

      {/* Back */}
      <Link href={"/"}>
      <button className="mt-6 mb-2 text-red-500 text-sm">
        ← Back to Home
      </button>
      </Link>
      
    </div>
  );
}