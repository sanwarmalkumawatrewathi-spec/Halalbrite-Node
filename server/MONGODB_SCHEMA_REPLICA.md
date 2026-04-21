# HalalBrite MongoDB Schema Replica (Final State)

This document details the final state of the MongoDB collections after achieving 1:1 parity with the legacy SQL schema. All core tables have been replicated using **snake_case** to match the original database architecture.

---

## 1. Bookings Collection (`rnv_hlb_orders`)
**Purpose:** Replaces the legacy orders table with immutable event snapshots.

| Field | Type | Legacy Column Match |
| :--- | :--- | :--- |
| `booking_reference` | String | `booking_reference` |
| `user_id` | ObjectId | `customer_id` (Mapped to User) |
| `organizer_id` | ObjectId | `organizer_id` |
| `event_id` | ObjectId | `event_id` |
| `event_name` | String | `event_name` |
| `event_date` | Date | `event_date` |
| `event_time` | String | `event_time` |
| `event_venue` | String | `event_venue` |
| `event_location` | String | `event_location` |
| `ticket_id` | String | `ticket_id` |
| `ticket_name` | String | `ticket_name` |
| `quantity` | Number | `quantity` |
| `customer_name` | String | `customer_name` |
| `customer_email` | String | `customer_email` |
| `customer_phone` | String | `customer_phone` |
| `attendee_names` | [String] | `attendee_names` (Parsed from longtext) |
| `amount_total` | Number | `amount_total` |
| `organizer_amount` | Number | `organizer_amount` |
| `currency` | String | `currency` |
| `payment_status` | String | `payment_status` |
| `stripe_session_id` | String | `stripe_session_id` |
| `stripe_payment_intent_id`| String | `stripe_payment_intent_id` |

---

## 2. Users Collection (`rnv_hlb_stripe_connections`)
**Purpose:** Stores organizer authentication and Stripe Connect account status.

| Field | Type | Legacy Column Match |
| :--- | :--- | :--- |
| `stripe_account_id` | String | `stripe_account_id` |
| `stripe_account_email` | String | `stripe_account_email` |
| `account_country` | String | `account_country` |
| `account_currency` | String | `account_currency` |
| `account_type` | String | `account_type` |
| `charges_enabled` | Boolean | `charges_enabled` |
| `payouts_enabled` | Boolean | `payouts_enabled` |
| `access_token` | String | `access_token` |
| `refresh_token` | String | `refresh_token` |
| `connection_status` | String | `connection_status` |
| `verification_status` | String | `verification_status` |
| `capabilities` | String | `capabilities` |

---

## 3. Payouts Collection (`rnv_hlb_payouts`)
**Purpose:** Tracks transfers from the platform to organizer bank accounts.

| Field | Type | Legacy Column Match |
| :--- | :--- | :--- |
| `organizer_id` | ObjectId | `organizer_id` |
| `payout_id` | String | `payout_id` |
| `transfer_id` | String | `transfer_id` |
| `amount` | Number | `amount` |
| `fee` | Number | `fee` |
| `net_amount` | Number | `net_amount` |
| `currency` | String | `currency` |
| `status` | String | `status` |
| `paid_date` | Date | `paid_date` |
| `arrival_date` | Date | `arrival_date` |
| `failure_code` | String | `failure_code` |
| `failure_message` | String | `failure_message` |

---

## 4. Transactions Collection (`rnv_hlb_wallet` / `transactions`)
**Purpose:** The internal financial ledger for the platform.

| Field | Type | Legacy Column Match |
| :--- | :--- | :--- |
| `order_id` | ObjectId | `order_id` |
| `organizer_id` | ObjectId | `organizer_id` |
| `event_id` | ObjectId | `event_id` |
| `type` | String | `type` (sale, refund, payout) |
| `amount` | Number | `amount` |
| `platform_fee` | Number | `platform_fee` |
| `organizer_amount` | Number | `organizer_amount` |
| `currency` | String | `currency` |
| `transaction_id` | String | `transaction_id` |
| `description` | String | `description` |
