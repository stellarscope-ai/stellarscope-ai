# Deployment Guide

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- A Supabase project (free tier works)
- A Google AI API key (free tier available)
- (Optional) Rust + Soroban CLI for contract deployment

## Local Development

```bash
git clone https://github.com/stellarscope-ai/stellarscope-ai.git
cd stellarscope-ai
pnpm install
cp .env.example .env.local
# Fill in .env.local with your keys
pnpm dev
```

Open http://localhost:3000

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your URL and keys
3. Run the migration:
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase/migrations/00001_initial_schema.sql`
   - Run the query
4. Enable Email auth:
   - Go to Authentication → Providers
   - Enable Email (magic link)

## Vercel Deployment

1. Push your repo to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GOOGLE_AI_API_KEY`
   - `AI_PROVIDER=google`
   - `STELLAR_HORIZON_URL=https://horizon.stellar.org` (mainnet)
4. Deploy

## Railway Deployment

1. Push your repo to GitHub
2. Create project in [railway.app](https://railway.app)
3. Connect GitHub repo
4. Add environment variables (same as Vercel)
5. Railway auto-detects Next.js and deploys

## Soroban Contract Deployment

```bash
cd contracts/watchlist

# Build
soroban contract build

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/watchlist.wasm \
  --source alice \
  --network testnet

# Note the contract address and add to .env.local:
# SOROBAN_CONTRACT_ADDRESS=C...
```

## Environment Variables Reference

| Variable | Where to get it |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `GOOGLE_AI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `STELLAR_HORIZON_URL` | `https://horizon.stellar.org` (mainnet) or `https://horizon-testnet.stellar.org` (testnet) |
| `SOROBAN_CONTRACT_ADDRESS` | After deploying the contract |

## Post-Deployment Checklist

- [ ] Landing page loads at production URL
- [ ] `/api/health` returns `{ "status": "ok" }`
- [ ] Chat interface works (requires `AI_PROVIDER=google`)
- [ ] Account lookups return real Stellar data
- [ ] Watchlist creation requires login
- [ ] Supabase RLS policies are active
- [ ] Error tracking is configured (Sentry recommended)