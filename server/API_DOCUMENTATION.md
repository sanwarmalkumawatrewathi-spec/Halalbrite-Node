# Halalbrite MERN API Documentation & Postman Guide

## Base URL
`http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)
Testing these first is crucial as most other endpoints require a `Bearer Token`.

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| POST | `/register` | Register User | `{ "username": "name", "email": "a@b.com", "password": "123", "role": "organizer" }` |
| POST | `/login` | Auth & Get Token | `{ "email": "admin@halalbrite.com", "password": "adminpassword123" }` |
| GET | `/profile` | Get Profile | *Requires Bearer Token* |

> [!TIP]
> **Postman Test Script**: When you run the `Login` request in the attached collection, it automatically saves your token to a Postman environment variable called `{{token}}`.

---

## 2. Stripe Connect Administration (`/api/v1/admin/stripe`)
These APIs allow you to build custom dashboards or manage the platform finances.

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| GET | `/stats` | Overall Financials | Admin |
| GET | `/settings` | Get Stripe Config | Admin |
| POST | `/settings` | Update Config | Admin |
| GET | `/organizers` | Connected Accounts | Admin |
| GET | `/transactions` | Financial Ledger | Admin |
| POST | `/sync` | API Historical Sync | Admin |

**Example POST `/settings` Body:**
```json
{
  "isTestMode": true,
  "testSecretKey": "sk_test_...",
  "testPublishableKey": "pk_test_...",
  "feePercentage": 5.5,
  "currency": "GBP"
}
```

---

## 3. Event Management (`/api/events`)
| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| GET | `/` | List Events | *Supports query params like ?city=London&search=Islam* |
| POST | `/` | Create Event | `{ "title": "My Event", "category": "ID", "price": 10 ... }` |

---

---

## 4. Dashboard APIs (`/api/dashboard`)
These APIs power the User and Organizer panels as shown in the Figma designs.

### User/Attendee Panel (`/api/dashboard/user`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/profile` | Get user profile details |
| PUT | `/profile` | Update profile (firstName, lastName, phone, bio) |
| GET | `/addresses` | List saved addresses |
| POST | `/addresses` | Add a new address |
| PUT | `/addresses/:id` | Update a specific address |
| DELETE | `/addresses/:id` | Delete an address |
| PATCH | `/addresses/:id/default` | Set an address as default |
| GET | `/tickets` | List user bookings with event status |
| GET | `/saved` | List saved events and followed organizers |
| POST | `/save-event/:id` | Toggle save event status |
| POST | `/follow-organizer/:id` | Toggle follow organizer status |
| PUT | `/preferences` | Update email/notification preferences |
| POST | `/upgrade` | Upgrade account to Organizer |

### Organizer Panel (`/api/dashboard/organizer`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/stats` | Dashboard overview stats & 6-month charts |
| GET | `/events` | List events with sales/revenue metrics |
| GET | `/customers` | List all attendees for organizer's events |
| GET | `/payouts` | Fetch payout history and balance |
| GET | `/organisations` | List organisation profiles |
| POST | `/organisations` | Create new organisation profile |
| PUT | `/organisations/:id` | Update organisation details |
| DELETE | `/organisations/:id` | Delete organisation profile |

---

## How to Test on Postman

1.  **Import Collection**: Open Postman, click **Import**, and select the `postman_collection.json` file in the project root.
2.  **Set Environment**: 
    - Create a new Environment in Postman.
    - Add a variable `base_url` with value `http://localhost:5000/api`.
    - Add a variable `token` (leave value empty).
3.  **Login First**: Run the **Authentication > Login** request. This will populate your `{{token}}` variable.
4.  **Authorized Requests**: All protected requests in the collection are already configured to use the `{{token}}` variable under the **Authorization** tab.


---

## 4. Data Models (Replica Mapping)

### Stripe Connection Model (`rnv_hlb_stripe_connections`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `stripe_account_id` | String | Stripe Connect Account ID (`acct_...`). |
| `stripe_account_email`| String | Email associated with the Stripe account. |
| `account_country` | String | ISO country code (e.g., `IE`). |
| `account_currency` | String | Default currency for the account (e.g., `eur`). |
| `account_type` | String | Type of Connect account (`express`, `custom`). |
| `charges_enabled` | Boolean | Whether the account can accept payments. |
| `payouts_enabled` | Boolean | Whether the account can receive payouts. |
| `access_token` | String | OAuth access token. |
| `refresh_token` | String | OAuth refresh token. |
| `connection_status` | String | `active`, `inactive`, `suspended`, `pending`. |
| `connection_date` | Date | Date when the account was first connected. |
| `verification_status`| String | `verified`, `unverified`. |
| `capabilities` | String | List of enabled Stripe capabilities. |

### Payout Model (`rnv_hlb_payouts`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | ObjectId | MongoDB unique identifier. |
| `organizerId` | ObjectId | Reference to the User (Organizer). |
| `payout_id` | String | Stripe Payout ID (`po_...`). |
| `transfer_id` | String | Stripe Transfer ID (`tr_...`). |
| `amount` | Decimal | Gross amount of the payout. |
| `currency` | String | Payout currency (Default: `EUR`). |
| `destination` | String | Destination bank or account details. |
| `fee` | Decimal | Stripe/Platform fee for the payout. |
| `net_amount` | Decimal | Net amount received after fees. |
| `status` | String | Status (`pending`, `paid`, `failed`, `canceled`). |
| `paid_date` | Date | Date when the payout was processed. |
| `failure_code` | String | Technical error code from Stripe if failed. |
| `failure_message`| String | Human-readable error message. |
| `metadata` | Map | Flexible key-value storage for extra data. |
| `description` | String | Narrative description of the payout. |
| `arrival_date` | Date | Estimated date the funds arrive in the bank. |
| `created_at` | Date | Timestamp of record creation. |
| `updated_at` | Date | Timestamp of last modification. |

### Booking Model (`rnv_hlb_orders`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `bookingReference`| String | Human-readable ID (e.g., `HB-525F22C0`). |
| `eventSnapshot` | Object | Immutable copy of Event title, date, venue, and location. |
| `attendees` | [String] | List of names for bulk ticket registrations. |
| `customerPhone` | String | Contact phone number of the buyer. |
| `stripeSessionId` | String | Stripe Checkout Session ID. |
| `stripePaymentIntentId`| String | Stripe Payment Intent ID. |
| `totalAmount` | Decimal | Total gross amount paid. |
| `organizerEarnings`| Decimal | Net amount earned by the organizer. |

### Transaction Model (`rnv_hlb_transactions` / `wallet`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `order_id` | ObjectId | Reference to the Booking. |
| `organizer_id` | ObjectId | Reference to the Organizer. |
| `event_id` | ObjectId | Reference to the Event. |
| `type` | String | Type of entry (`sale`, `refund`, `payout`). |
| `amount` | Decimal | Gross transaction amount. |
| `platform_fee` | Decimal | Platform commission. |
| `organizer_amount` | Decimal | Net amount for the organizer. |
| `currency` | String | Transaction currency (Default: `gbp`). |
| `transaction_id` | String | Internal or Stripe transaction ID. |
| `stripe_transfer_id`| String | ID of the transfer to the organizer. |
| `description` | String | Detailed description of the ledger entry. |

> [!IMPORTANT]
> Some IDs (like `event_id` or `category_id`) in my example bodies are placeholders. Run the **List Categories** or **List Events** requests first to get real IDs from your database.
