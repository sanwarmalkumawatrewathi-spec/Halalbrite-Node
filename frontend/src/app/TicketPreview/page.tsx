import Footer from "@/Components/Footer";
import Header from "@/Components/Header";
import React from "react";

export default function TicketPreview() {
  return (
    <>
    <Header/>
    <div className=" bg-gray-100 p-6">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-2">
          <button className="text-sm text-gray-600 hover:underline">
            ← Back to My Tickets
          </button>
          <button className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-red-600">
            Download PDF
          </button>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800">
          Ticket Preview
        </h1>
        <p className="text-sm text-gray-500">
          Your event ticket (PDF format)
        </p>
      </div>

      <div className="flex items-center justify-center mb-7">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-lg border-4 border-red-500 relative overflow-hidden">
        {/* Side perforation effect */}
        <div className="absolute left-0 top-0 h-full w-3 flex flex-col justify-between py-4">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="w-2 h-2 bg-white rounded-full border border-red-500 mx-auto"
            />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-3 flex flex-col justify-between py-4">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="w-2 h-2 bg-white rounded-full border border-red-500 mx-auto"
            />
          ))}
        </div>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-red-600 font-bold text-lg">HalalBrite</h2>
              <p className="text-xs text-gray-500">Event Ticket</p>
            </div>
            <p className="text-xs text-gray-400">TKT-87YQSC0E</p>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Annual Islamic Conference 2025
            </h1>
            <span className="inline-block mt-2 text-xs bg-red-500 text-white px-3 py-1 rounded-full">
              General Admission
            </span>
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">September 15, 2025</p>
            </div>
            <div>
              <p className="text-gray-500">Time</p>
              <p className="font-medium">2:00 PM - 6:00 PM</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-500">Location</p>
              <p className="font-medium">
                Community Center Hall, London
              </p>
            </div>
          </div>

          {/* Ticket Details */}
          <div className="border border-red-200 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-700">
              Ticket Details
            </p>
            <p className="text-xs text-gray-500">
              Access to all conference sessions and networking areas
            </p>
            <div className="flex justify-between text-sm mt-2">
              <span>1 ticket</span>
              <span className="font-medium">£ 25.00</span>
            </div>
          </div>

          {/* Ticket Holder */}
          <div className="border border-red-200 rounded-xl p-4">
            <p className="text-xs text-gray-500">Ticket Holder</p>
            <p className="font-medium">Ahmed Hassan</p>
          </div>

          {/* Booking Ref */}
          <div className="text-center text-sm">
            <p className="text-gray-500">Booking Reference</p>
            <p className="font-semibold tracking-wide">
              HALALB-2025-P91HVP
            </p>
          </div>

          {/* QR Placeholder */}
          <div className="flex flex-col items-center">
            <div className="border-4 border-red-500 rounded-xl p-4">
              <div className="w-32 h-32 bg-gray-800" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Please present this ticket at the event entrance
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-gray-400 pt-2 border-t">
            <p>
              For support or inquiries: support@halalbrite.com
            </p>
            <p>
              This ticket is non-refundable but transferable. Valid for
              one-time entry only.
            </p>
          </div>
        </div>
      </div>
    </div>

     <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-5 text-sm text-yellow-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-yellow-500 text-white text-xs">!</span>
            <p className="font-semibold">Important Information</p>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>This is a digital ticket. You can print it or display it on your mobile device.</li>
            <li>Each ticket contains a unique code for entry verification.</li>
            <li>Please arrive at least 15 minutes before the event start time.</li>
            <li>The ticket holder's name must match their ID for entry.</li>
            <li>Screenshots or photocopies may not be accepted. Please show the original PDF.</li>
          </ul>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
