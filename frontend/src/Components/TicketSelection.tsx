"use client";

import React, { useState } from "react";

type Ticket = {
  id: number;
  title: string;
  price: number;
  desc: string;
  remaining: number;
};

const ticketsData: Ticket[] = [
  {
    id: 1,
    title: "General Admission",
    price: 25,
    desc: "Access to all sessions • Lunch included • Conference materials",
    remaining: 47,
  },
  {
    id: 2,
    title: "VIP Pass",
    price: 50,
    desc: "Priority seating • VIP networking session • Lunch included • Conference materials • Gift bag",
    remaining: 12,
  },
  {
    id: 3,
    title: "Student Ticket",
    price: 15,
    desc: "Access to all sessions • Lunch included • Valid student ID required",
    remaining: 35,
  },
];

  export default function TicketSelection(){
  const [qty, setQty] = useState<{ [key: number]: number }>({});

  const handleChange = (id: number, type: "inc" | "dec") => {
    setQty((prev) => {
      const current = prev[id] || 0;
      if (type === "inc") return { ...prev, [id]: current + 1 };
      if (type === "dec") return { ...prev, [id]: Math.max(0, current - 1) };
      return prev;
    });
  };

  return (
    <div className="rounded-2xl max-w-6xl mx-auto  p-6 bg-white shadow-lg ">
      <h2 className="text-red-900 font-semibold mb-4">Select Tickets</h2>

      <div className="space-y-4">
        {ticketsData.map((ticket, index) => {
          const count = qty[ticket.id] || 0;
          const total = ticket.price * count + (count > 0 ? 2.32 : 0);

          return (
            <div
              key={ticket.id}
              className="bg-white p-4 rounded-xl border border-gray-300  flex flex-col gap-4"
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-sm">{ticket.title}</h3>
                  <p className="text-sm text-gray-600">{ticket.desc}</p>
                </div>

                <div className="text-right">
                  <p className="font-medium">€{ticket.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {ticket.remaining} remaining
                  </p>
                </div>
              </div>

              {/* ACTION ROW */}
              <div className="flex items-center gap-4">
                {/* COUNTER */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleChange(ticket.id, "dec")}
                    className="w-10 h-10 rounded-md border bg-gray-100"
                  >
                    -
                  </button>

                  <div className="w-10 h-10 flex items-center justify-center border  rounded-md">
                    {count}
                  </div>

                  <button
                    onClick={() => handleChange(ticket.id, "inc")}
                    className="w-10 h-10 rounded-md border bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* BUY BUTTON */}
                <button
                  className={`flex-1 py-3 rounded-lg font-medium text-white ${
                    index === 0
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-400 hover:bg-red-500"
                  }`}
                >
                  Buy Now
                </button>

                {/* TOTAL */}
                {count > 0 && (
                  <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                    Total + fees: €{total.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <p className="text-center text-sm text-gray-500 mt-6">
        Secure payment powered by Stripe
      </p>
    </div>
  );
};

