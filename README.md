# TableTime — Multi-Restaurant Reservation Platform

TableTime is a full-stack, multi-tenant restaurant table reservation platform. It supports four roles:

- **Customers** — browse restaurants, check real-time availability, book a table as a guest (phone number only), and manage their reservations.
- **Restaurant owners / staff** — a live reservation board, floor-plan view, analytics, menu management, restaurant settings, and WhatsApp-based marketing automation.
- **Platform super-admin** — onboard restaurants, approve/suspend accounts, manage subscription tiers, view cross-restaurant analytics, and support-login into any restaurant's dashboard.
- **Marketing engine** — automation rules that send WhatsApp campaigns to customer segments (lapsed guests, birthdays, VIPs, no-show win-back) and track delivery/read/booked performance.

## Tech stack

- **Framework:** TanStack Start (React 19, TanStack Router), deployed on Netlify
- **Database:** Netlify Database (managed Postgres) via Drizzle ORM — see `db/schema.ts`
- **Styling:** Tailwind CSS 4
- **Charts:** Chart.js / react-chartjs-2
- **Auth:** custom email/password login for owners, staff, and the admin, using signed HMAC session cookies (no third-party auth provider)
- **WhatsApp integration:** mocked send/receive, logged to the `whatsapp_messages` table (see "WhatsApp integration" below)
- **Background jobs:** a scheduled Netlify Function for reservation reminders, and an inbound-webhook Netlify Function for CANCEL/CONFIRM/STOP replies

## Running locally

```bash
pnpm install
netlify dev --port 8889
```

The database seeds itself automatically on first request with two active demo restaurants and one pending
onboarding applicant. Demo logins:

| Role | URL | Email | Password |
|---|---|---|---|
| Restaurant owner | `/owner/login` | `owner@olivetable.dev` | `owner123` |
| Restaurant owner | `/owner/login` | `owner@sakurahouse.dev` | `owner123` |
| Platform admin | `/admin/login` | `admin@platform.dev` | `admin123` |

Customers don't need an account — book from the homepage with any phone number, then look reservations up again
at `/my-reservations` with that same number.

## WhatsApp integration

Real WhatsApp Business Platform (Meta Cloud API) or Twilio integration requires an approved business account and
credentials this environment doesn't have. Every place the spec calls for a WhatsApp send — booking confirmations,
reminders, cancellations, marketing campaigns — instead calls `sendWhatsappMessage()` in
`src/server/whatsapp.server.ts`, which logs the message to the `whatsapp_messages` table so the UI can show real
delivery status. `netlify/functions/whatsapp-webhook.mts` is a ready-made inbound webhook handler that parses
CANCEL/CONFIRM/STOP replies; point a real provider's webhook at it and swap the mock sender for an actual API call
once credentials (`WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, or Twilio equivalents) are available.

## Project structure

See `AGENTS.md` for the full directory breakdown and conventions.
