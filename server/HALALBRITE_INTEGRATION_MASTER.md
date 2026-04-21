# 🚀 Halalbrite Integration Master Guide

This document is your **Source of Truth** for the Halalbrite ecosystem. It covers all backend APIs, Postman testing procedures, and best practices for implementing these features in your **Next.js frontend**.

---

## 📂 1. API Glossary
All endpoints are relative to: `http://localhost:5000/api`

### 🏗️ Administrative Management (`/api/v1/admin/stripe`)
These are high-level JSON APIs for your admin panel and financial dashboards.

| Method | Endpoint | Description | JSON Body Example |
| :--- | :--- | :--- | :--- |
| **GET** | `/stats` | Platform Financial Stats | N/A |
| **GET** | `/organizers` | List Connected Organizers | N/A |
| **GET** | `/settings` | Get Stripe Configuration | N/A |
| **POST** | `/settings` | Update Configuration | `{"isTestMode": true, "feePercentage": 5.5}` |
| **POST** | `/sync` | Force Background API Sync | N/A |

### 🎟️ Essential Application APIs
| Service | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/login` | Login and receive JWT |
| **Events** | `GET` | `/events` | Search & List Events |
| **Events** | `POST` | `/events` | Create new Event (Organizer only) |
| **Payments**| `GET` | `/payments/connect` | Get Stripe Connect OAuth URL |
| **Checkout** | `POST` | `/payments/checkout` | Create Order & Get clientSecret |

---

## 📮 2. Postman Testing Guide

### ⚡ Quick Start
1.  **Import**: Import the `postman_collection.json` file into Postman.
2.  **Authentication**: Run the `1. Authentication > Login` request first.
3.  **Automation**: The collection has a `Tests` script that automatically saves your token to the `{{token}}` environment variable. Every subsequent request will use this token automatically.

### 🔍 Pro-Tips for Postman
- **Environments**: Always use a Postman Environment with `base_url` set to `http://localhost:5000/api`.
- **Pre-request Scripts**: If you need to test different user roles (Admin vs Organizer), we have pre-configured folders for each role in the collection.

---

## ⚛️ 3. Next.js Frontend Implementation

### 🛠️ A. API Utility (Fetch Wrapper)
Create a file like `lib/api-client.ts` to manage your authorized requests.

```typescript
// lib/api-client.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch(endpoint: string, options: any = {}) {
  // Get token from your preferred storage (localStorage, Cookies, or Session)
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    "Authorization": `Bearer ${token}`,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API Request Failed");
  }

  return response.json();
}
```

### 📊 B. Implementing the Stripe Dashboard (Client Component)
```tsx
"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-client";

export default function StripeStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    apiFetch("/v1/admin/stripe/stats")
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p>Loading Statistics...</p>;

  return (
    <div>
      <h1>Platform Revenue: £{stats.platformRevenue}</h1>
      <p>Tickets Sold: {stats.ticketsSold}</p>
    </div>
  );
}
```

---

## ⚠️ Critical Implementation Notes

> [!WARNING]
> **Secret Keys**: Never store your Stripe Secret Keys on the frontend. Only the Backend (Node.js) should ever handle Secret Keys. The Next.js frontend should only ever receive the `testPublishableKey` or `livePublishableKey`.

> [!IMPORTANT]
> **CORS**: Ensure your server allows requests from your Next.js domain (e.g., `http://localhost:3000`). This is already configured in the `cors()` middleware in `server/src/index.js`.

> [!TIP]
> **Webhook Security**: When implementing webhooks in Next.js, always use the signature header verification matching the logic in `server/src/apis/payments/payment.routes.js`.

---

## 💳 4. Checkout Flow Implementation

To implement the "Complete Purchase" flow as seen in the designs, follow these steps:

### A. Initialize Checkout
Send the attendee details and ticket selection to get the fee breakdown and Stripe `clientSecret`.

**Endpoint**: `POST /api/payments/checkout`
**Request Body**:
```json
{
  "eventId": "65f1e...",
  "ticketType": "VIP Experience",
  "quantity": 1,
  "attendeeName": "Ahmed Hassan",
  "attendeeEmail": "ahmed@example.com"
}
```

### B. Stripe Elements Integration (Frontend)
Use the `clientSecret` returned from the API above to initialize Stripe Elements.

```tsx
// frontend/components/CheckoutForm.tsx
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const handleSubmit = async (event) => {
  event.preventDefault();
  const result = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: "http://localhost:3000/checkout/success",
    },
  });
};
```

---
**Document Version: 3.0 (Checkout & Financials Integrated)**
