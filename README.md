<p align="center">
  <img src="public/logo.svg" alt="StellarScope AI" width="400" />
</p>

<h3 align="center">Ask. Explore. Understand.</h3>

<p align="center">
  The AI-powered on-chain intelligence agent for the Stellar ecosystem.
</p>

<p align="center">
  <a href="https://github.com/stellarscope-ai/stellarscope-ai/actions/workflows/ci.yml"><img src="https://github.com/stellarscope-ai/stellarscope-ai/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://github.com/stellarscope-ai/stellarscope-ai/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" /></a>
  <a href="https://github.com/stellarscope-ai/stellarscope-ai/issues"><img src="https://img.shields.io/github/issues/stellarscope-ai/stellarscope-ai.svg" alt="Issues" /></a>
  <a href="https://github.com/stellarscope-ai/stellarscope-ai/stargazers"><img src="https://img.shields.io/github/stars/stellarscope-ai/stellarscope-ai.svg" alt="Stars" /></a>
</p>

<p align="center">
  <a href="https://stellarscope-ai.vercel.app">Live Demo</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="#contributing">Contributing</a> ·
  <a href="#license">License</a>
</p>

---

## What is StellarScope AI?

StellarScope AI is an open-source web application where anyone can ask questions about Stellar blockchain activity, inspect evidence-backed answers, and create watchlists.

It is **not** a chatbot that guesses blockchain facts. It is a blockchain data application that uses AI to help users explore **verified data** — every claim links back to source transactions.

### Features

- Natural-language queries about Stellar accounts and transactions
- Account balance lookups with asset breakdowns
- Transaction history with summaries
- Asset activity analysis (volume, unique accounts, trends)
- Source links for every on-chain claim
- Account and asset watchlists with alert preferences
- Soroban smart contract for premium subscriptions

## Quick Start

```bash
git clone https://github.com/stellarscope-ai/stellarscope-ai.git
cd stellarscope-ai
pnpm install
cp .env.example .env.local
# Fill in .env.local with your Supabase and Google AI keys
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
stellarscope-ai/
├── apps/
│   └── web/                  # Next.js frontend + API routes
├── packages/
│   ├── shared/               # Shared types and schemas
│   ├── stellar-data/         # Horizon/RPC integration
│   ├── analytics/            # Deterministic calculations
│   └── ai/                   # LLM and tool orchestration
├── contracts/
│   └── watchlist/            # Soroban smart contract (Rust)
├── supabase/
│   └── migrations/           # Database schema
└── docs/
```

| Package | Purpose |
|---------|---------|
| `@stellarscope/shared` | Types, schemas, constants |
| `@stellarscope/stellar-data` | Horizon API client, account/tx fetching |
| `@stellarscope/analytics` | Deterministic metric calculations |
| `@stellarscope/ai` | Provider-agnostic LLM orchestration + tools |

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/chat` | AI chat interface |
| `/watchlists` | Watchlist management |
| `/api/health` | Health check |
| `/api/chat` | SSE chat endpoint |
| `/api/accounts/[id]` | Account lookup |
| `/api/accounts/[id]/transactions` | Transaction history |
| `/api/watchlists` | Watchlist CRUD |
| `/api/auth/login` | Magic link login |

## Development

```bash
pnpm build        # Build all packages
pnpm dev          # Start dev servers
pnpm test         # Run all tests
pnpm lint         # Lint all packages
pnpm typecheck    # Type-check all packages
cargo test        # Run Rust contract tests
```

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** Supabase (PostgreSQL)
- **AI:** Google Gemini (free tier), provider-agnostic
- **Blockchain:** Stellar Horizon API, Stellar SDK
- **Contracts:** Rust + Soroban
- **Testing:** Vitest + cargo test
- **Monorepo:** Turborepo + pnpm

## Roadmap

### v0.1 (Current) — Public Beta
- [x] Monorepo scaffold with 4 packages
- [x] Stellar Horizon integration
- [x] Analytics engine with activity comparison
- [x] AI chat interface with tool calling
- [x] Watchlist CRUD with Supabase auth
- [x] Soroban subscription contract
- [x] Full documentation

### v0.2 — Enhanced Analytics
- [ ] Transaction history pagination and filtering
- [ ] Asset activity dashboard with 7-day trends
- [ ] AI source citations with explorer links
- [ ] Real-time streaming via Horizon

### v0.3 — Alerts & Notifications
- [ ] Scheduled activity alerts
- [ ] Email notifications
- [ ] Telegram integration
- [ ] Alert history and delivery status

### v0.4 — Public Launch
- [ ] Public watchlist sharing
- [ ] Interactive API playground
- [ ] TypeScript SDK
- [ ] Soroban contract on mainnet

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, coding standards, and PR guidelines.

**Good first issues:** [label:good-first-issue](https://github.com/stellarscope-ai/stellarscope-ai/issues?q=is:issue+is:open+label:%22good+first+issue%22)

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## License

[MIT](LICENSE)

---

<p align="center">
  Better questions. Deeper insights.
</p>
