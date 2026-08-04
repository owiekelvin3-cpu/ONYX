# ONYX Exchange

Production-ready crypto exchange frontend built with Next.js 16, Tailwind CSS 4, and Supabase.

**Live stack:** Next.js App Router · Supabase Auth & Postgres · Vercel

## Features

- Landing page with markets and products
- Email registration with full KYC profile fields
- Dashboard: trade, portfolio, deposit, withdraw, AI bots, copy trading
- Supabase backend with balances, trades, holdings, deposits, withdrawals
- Responsive Binance-style UI (dark theme, gold accent)

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill in Supabase URL and anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `NEXT_PUBLIC_APP_NAME` | No | Display name (default: ONYX) |
| `NEXT_PUBLIC_APP_URL` | No | Canonical URL (auto-set on Vercel) |

See `.env.example` and `supabase/README.md` for backend setup.

## Supabase auth (production)

In Supabase Dashboard → **Authentication → URL Configuration**, add:

- **Site URL:** your Vercel domain (e.g. `https://onyx-exchange.vercel.app`)
- **Redirect URLs:** `https://your-domain.com/**`

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/owiekelvin3-cpu/ONYX)

Or via CLI:

```bash
npx vercel --prod
```

Set the Supabase env vars in Vercel → Project → Settings → Environment Variables.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |

## Project structure

```
src/
  app/           # Pages (landing, auth, dashboard, info pages)
  components/    # UI, landing, dashboard, auth
  lib/
    api/         # Supabase API helpers
    supabase/    # Client, server, middleware
supabase/
  migrations/    # SQL migrations
```

## License

Private — All rights reserved.
