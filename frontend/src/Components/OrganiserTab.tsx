"use client";

import { FiEdit, FiTrash2, FiGlobe, FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import { IoBusinessOutline, IoLockClosedOutline } from "react-icons/io5";
import React, { useState, useEffect } from "react";

export default function OrganiserTab() {
  const [loading, setLoading] = useState(true);
  const [organisations, setOrganisations] = useState<any[]>([]);

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/dashboard/organizer/organisations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setOrganisations(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch organisations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading organisations...</div>;

  return (
    <div className="max-w-7xl mx-auto p-0 space-y-6">
      {/* Organisation Profiles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">Organisation Profiles</h2>
            <p className="text-sm text-gray-500">
              Manage your organisations that can be linked to events
            </p>
          </div>

          <button className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition">
            + Add Organisation
          </button>
        </div>

        <div className="space-y-4">
          {organisations.length > 0 ? (
            organisations.map((org, i) => (
              <div
                key={i}
                className="border border-gray-50 bg-gray-50/30 rounded-xl p-5 flex gap-5 items-start hover:bg-white hover:shadow-sm hover:border-gray-100 transition"
              >
                {/* Icon/Logo */}
                <div className="w-14 h-14 flex flex-shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 text-xl font-bold shadow-sm">
                  {org.logo ? (
                    <img src={org.logo} alt="" className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    <IoBusinessOutline />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-900">{org.name || org.username}</h3>
                      {org.website && (
                        <p className="text-sm text-red-600 font-medium flex items-center gap-1 mt-0.5">
                          <FiGlobe className="text-xs" /> {org.website}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 border border-gray-100 bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:text-gray-900 hover:border-gray-200 transition shadow-sm">
                        <FiEdit /> Edit
                      </button>
                      <button className="flex items-center gap-1.5 border border-red-50 border-red-50 bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:text-red-700 hover:border-red-100 transition shadow-sm">
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {org.description || 'No description provided for this organisation.'}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-4 items-center">
                    {/* Social Icons */}
                    <div className="flex gap-4 text-gray-400">
                      <FiFacebook className="cursor-pointer hover:text-[#1877F2] transition" />
                      <FiInstagram className="cursor-pointer hover:text-[#E4405F] transition" />
                      <FiTwitter className="cursor-pointer hover:text-[#1DA1F2] transition" />
                    </div>
                    
                    <div className="h-4 w-px bg-gray-200 ml-2 hidden sm:block"></div>
                    
                    <p className="text-xs text-gray-400 font-medium">
                      Created on {new Date(org.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
               <IoBusinessOutline className="text-4xl text-gray-200 mx-auto mb-3" />
               <p className="text-gray-500 font-medium">No organisations found.</p>
               <p className="text-xs text-gray-400 mt-1">Add an organisation to start branding your events.</p>
            </div>
          )}
        </div>
      </div>

      {/* Security Info Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-0">
          <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <IoLockClosedOutline className="text-red-500" /> Security
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account security and authentication settings
          </p>
          <button className="mt-4 text-sm font-bold text-red-600 hover:underline">
            Go to Security Settings →
          </button>
        </div>
      </div>
    </div>
  );
}