"use client";

type Card = {
  brand: "visa" | "mastercard" | "amex";
  last4: string;
  expiry: string;
  name: string;
  isDefault?: boolean;
};

const cards: Card[] = [
  {
    brand: "visa",
    last4: "4242",
    expiry: "12/2027",
    name: "John Doe",
    isDefault: true,
  },
  {
    brand: "mastercard",
    last4: "5555",
    expiry: "08/2026",
    name: "John Doe",
  },
  {
    brand: "amex",
    last4: "0005",
    expiry: "03/2028",
    name: "John Doe",
  },
];

export default function PaymentTab() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold">Payment Methods</h1>
          <p className="text-sm text-gray-500">
            Manage your saved payment cards
          </p>
        </div>

        <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2">
          💳 Add New Card
        </button>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between"
          >
            {/* Left */}
            <div className="flex items-center gap-4">
              {/* Card Icon */}
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-lg text-white text-lg
                ${
                  card.brand === "visa"
                    ? "bg-blue-600"
                    : card.brand === "mastercard"
                    ? "bg-orange-500"
                    : "bg-purple-600"
                }`}
              >
                💳
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-medium">
                    {card.brand.charAt(0).toUpperCase() +
                      card.brand.slice(1)}{" "}
                    ending in {card.last4}
                  </h2>

                  {card.isDefault && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  Expires {card.expiry}
                </p>
                <p className="text-sm text-gray-500">
                  {card.name}
                </p>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {!card.isDefault && (
                <button className="border border-red-500 text-red-500 px-3 py-1.5 rounded-md text-sm">
                  Set Default
                </button>
              )}

              <button className="border border-gray-300 px-3 py-1.5 rounded-md text-sm">
                Edit
              </button>

              <button className="border border-gray-300 text-red-500 px-3 py-1.5 rounded-md text-sm">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 flex gap-3">
        <span>ℹ️</span>
        <div>
          <p>
            Your payment information is securely stored and encrypted. We use
            Stripe for payment processing.
          </p>
          <p className="mt-1">
            Setting a default card will automatically use it for future ticket
            purchases.
          </p>
        </div>
      </div>
    </div>
  );
}