"use client";

import { IoCheckmarkCircle } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";

const payouts = [
  {
    date: "Nov 1, 2025",
    amount: "€4,850",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    date: "Oct 1, 2025",
    amount: "€3,920",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    date: "Dec 1, 2025",
    amount: "€5,420",
    status: "pending",
    method: "Bank Transfer",
  },
];

const statusStyles: any = {
  paid: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function PayoutsTab() {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available */}
        <div className="rounded-xl p-5 text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow">
          <div className="flex justify-between">
            <p className="text-sm">Available Balance</p>
            <span>$</span>
          </div>
          <h2 className="text-xl font-semibold mt-2">€5,420.00</h2>
          <p className="text-xs mt-1">Ready to withdraw</p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-5 shadow">
          <p className="text-sm text-gray-500">Pending</p>
          <h2 className="text-lg font-semibold text-orange-500 mt-2">
            €1,240.00
          </h2>
          <p className="text-xs text-gray-500">Processing</p>
        </div>

        {/* Total */}
        <div className="bg-white rounded-xl p-5 shadow">
          <p className="text-sm text-gray-500">Total Paid Out</p>
          <h2 className="text-lg font-semibold text-green-600 mt-2">
            €17,560.00
          </h2>
          <p className="text-xs text-gray-500">Lifetime earnings</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow p-5">
        <div className="mb-4">
          <h2 className="font-semibold">Payout History</h2>
          <p className="text-sm text-gray-500">
            Track your payment disbursements
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="py-2">Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Method</th>
              </tr>
            </thead>

            <tbody>
              {payouts.map((p, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-3">{p.date}</td>
                  <td className="text-green-600">{p.amount}</td>
                  <td>
                    <span
                      className={`flex items-center gap-1 w-fit px-2 py-1 text-xs rounded-full ${statusStyles[p.status]}`}
                    >
                      {p.status === "paid" ? (
                        <IoCheckmarkCircle />
                      ) : (
                        <IoTimeOutline />
                      )}
                      {p.status}
                    </span>
                  </td>
                  <td>{p.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-sm text-gray-500">
            View detailed payout information and account settings
          </p>
          <button className="border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm">
            View Stripe Express Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
