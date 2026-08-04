# ONYX Exchange — Supabase Backend

## Environment

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_APP_NAME=ONYX
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get URL and anon key from [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API.

## What's connected

| Feature | Table / RPC | Frontend |
|---------|-------------|----------|
| Auth & profiles | `auth.users`, `profiles` | `/login`, `/register`, `/dashboard/settings` |
| Balances | `balances` | Dashboard, portfolio, trade |
| Spot trading | `trades` + `debit_balance_for_trade` trigger | `/dashboard/trade` |
| Holdings | `holdings` | `/dashboard/portfolio` |
| Deposits | `deposits`, `platform_settings` | `/dashboard/deposit` |
| Withdrawals | `withdrawals`, `get_withdrawal_eligibility` RPC | `/dashboard/withdraw` |
| AI bots | `ai_trading_subscriptions` | `/dashboard/ai-trading` |
| Copy trading | `copy_trading_subscriptions` | `/dashboard/copy-trading` |
| Notifications | `notifications` | Created by DB triggers |

## Database flow

1. **Sign up** → `handle_new_user` trigger creates `profiles` row + zero USD `balances` row
2. **Deposit** → User submits pending deposit → admin approves → balance credited
3. **Trade** → Insert into `trades` → trigger debits/credits balance and updates `holdings`
4. **Withdraw** → Insert into `withdrawals` → admin processes
5. **AI subscribe** → Insert into `ai_trading_subscriptions` → trigger debits allocation from balance

## Local development

```bash
npm install
npm run dev
```

## Migrations

SQL migrations live in `supabase/migrations/`. The remote project already has the full schema; these files document ONYX-specific changes.

To pull full schema locally (optional):

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db pull
```

## Auth redirect URLs

In Supabase Dashboard → Authentication → URL Configuration, add:

- Site URL: `http://localhost:3000` (dev) or your production domain
- Redirect URLs: `http://localhost:3000/**`, `https://yourdomain.com/**`
