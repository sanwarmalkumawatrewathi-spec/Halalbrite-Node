"use client";

import { FiEdit, FiTrash2, FiGlobe, FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import { IoBusinessOutline, IoLockClosedOutline } from "react-icons/io5";

const organisations = [
  {
    name: "Islamic Conference Society",
    website: "https://islamicconference.org",
    description:
      "We organize inspiring Islamic conferences and events across Europe, bringing together scholars and community members.",
    categories: "Educational conferences, workshops, and community gatherings",
  },
  {
    name: "Halal Food Network",
    website: "https://halalfoodnetwork.com",
    description:
      "Celebrating halal cuisine and bringing together food enthusiasts from all backgrounds through exciting festivals and events.",
    categories: "Food festivals, cooking workshops, and culinary experiences",
  },
  {
    name: "Local Masjid Community",
    website: "https://localmasjid.org",
    description:
      "Building strong community bonds through regular gatherings, iftar events, and educational programs for all ages.",
    categories: "Community iftars, Jummah gatherings, and family events",
  },
];

export default function OrganiserTab() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Organisation Profiles */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-semibold">Organisation Profiles</h2>
            <p className="text-sm text-gray-500">
              Manage your organisations that can be linked to events
            </p>
          </div>

          <button className="bg-red-500 text-white px-4 py-2 rounded-md text-sm">
            + Add Organisation
          </button>
        </div>

        <div className="space-y-4">
          {organisations.map((org, i) => (
            <div
              key={i}
              className="border rounded-xl p-4 flex gap-4 items-start"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-red-100 text-red-500">
                <IoBusinessOutline />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{org.name}</h3>
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <FiGlobe /> {org.website}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 border px-2 py-1 rounded text-xs">
                      <FiEdit /> Edit
                    </button>
                    <button className="flex items-center gap-1 border border-red-500 text-red-500 px-2 py-1 rounded text-xs">
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  {org.description}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Event Categories:</span>{" "}
                  {org.categories}
                </p>

                {/* Social Icons */}
                <div className="flex gap-3 mt-3 text-gray-500">
                  <FiFacebook className="cursor-pointer" />
                  <FiInstagram className="cursor-pointer" />
                  <FiTwitter className="cursor-pointer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <IoLockClosedOutline /> Change Password
          </h2>
          <p className="text-sm text-gray-500">
            Ensure your account is secure
          </p>
          </div>
          </div>
          </div>
  )}