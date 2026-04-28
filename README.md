# Danica IT — Native App

Production-grade rewrite of the Spark prototype. Next.js 16 (App Router) + Drizzle + Auth.js v5 + PayMongo, deployed on Vercel.

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | Next.js 16 App Router, React 19, Tailwind 4 |
| Auth | Auth.js v5 (Credentials, JWT sessions) |
| Database | Postgres + Drizzle ORM |
| Payments | PayMongo Checkout Sessions + saved Customer/PaymentMethod for renewals |
| Cron | Vercel Cron daily renewal job |
| Hosting | Vercel |

## Setup

```bash
npm install
cp .env.example .env.local
# fill in DATABASE_URL, AUTH_SECRET, PAYMONGO_*

npm run db:push      # apply schema to your Postgres
npm run seed         # insert 6 AI products + 3 token packs

npm run dev          # http://localhost:3000
```

Generate `AUTH_SECRET` with `openssl rand -base64 32`.

## Environment variables

```
DATABASE_URL=postgres://…
AUTH_SECRET=…
NEXTAUTH_URL=http://localhost:3000
APP_URL=http://localhost:3000

PAYMONGO_SECRET_KEY=sk_test_…
PAYMONGO_PUBLIC_KEY=pk_test_…
PAYMONGO_WEBHOOK_SECRET=whsec_…   # set after creating the webhook in PayMongo dashboard

CRON_SECRET=…                     # any random string, used by Vercel Cron auth
```

## PayMongo

| Endpoint | Purpose |
| --- | --- |
| `POST /api/paymongo/checkout` | Creates a hosted Checkout Session for one-time or first-charge subscription |
| `POST /api/paymongo/webhook` | Receives `checkout_session.payment.paid` etc. — verifies signature, idempotent on event id |
| `GET /api/cron/renewals` | Vercel Cron daily — charges saved PaymentMethod via Payment Intent attach |

Webhook URL after deploy: `https://<your-domain>/api/paymongo/webhook` — register in PayMongo dashboard, copy `whsec_…` into `PAYMONGO_WEBHOOK_SECRET`.

## Subscription flow

1. User clicks "Subscribe monthly" → `POST /api/paymongo/checkout` with `isSubscription: true`
2. We create a Checkout Session and persist a pending order with metadata `{ subscription: true, billingInterval, productId }`
3. PayMongo redirects user to hosted page; user pays; PayMongo redirects back to `/portal/dashboard/billing?status=success`
4. `checkout_session.payment.paid` webhook fires → we look up the order, capture `payment_method_id`, create a PayMongo Customer if needed, write a `subscriptions` row with `next_charge_at = +1 month`
5. Daily `/api/cron/renewals` (Vercel Cron) finds rows where `next_charge_at <= now`, creates a Payment Intent, attaches saved PM, marks success or increments failure count (3 → past_due)

## Routes

| Path | Role |
| --- | --- |
| `/` | Public landing |
| `/portal` | Sign in / sign up |
| `/portal/dashboard` | Consumer overview (token balance, active subs, recent orders) |
| `/portal/dashboard/products` | My subscriptions + buy more |
| `/portal/dashboard/usage` | Last 30 days token chart |
| `/portal/dashboard/billing` | Orders + subscriptions + cancel |
| `/portal/dashboard/api-keys` | Generate / revoke API keys |
| `/portal/dashboard/support` | Tickets |

## Demo card numbers (PayMongo test mode)

| Number | Outcome |
| --- | --- |
| `4343 4343 4343 4345` | Success (Visa) |
| `5455 5555 5555 5555` | Success (Mastercard) |
| `4571 7360 0000 0014` | Generic decline |

Any future expiry, any CVC, any postal code.

## License

MIT.
