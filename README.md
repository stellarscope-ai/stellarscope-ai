<p align="center">
  <img src="public/logo.svg" alt="StellarScope AI" width="400" />
</p>

<h3 align="center">Ask. Explore. Understand.</h3>

<p align="center">
  The AI-powered on-chain intelligence agent for the Stellar ecosystem.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> ·
  <a href="#project-structure">Structure</a> ·
  <a href="#contributing">Contributing</a> ·
  <a href="#license">License</a>
</p>

---

## What is StellarScope AI?

StellarScope AI is an open-source web application where anyone can ask questions about Stellar blockchain activity, inspect evidence-backed answers, and create watchlists.

It is **not** a chatbot that guesses blockchain facts. It is a blockchain data application that uses AI to help users explore **verified data** — every claim links back to source transactions.

### Features (v0.1 MVP)

- Natural-language queries about Stellar accounts and transactions
- Account balance lookups with asset breakdowns
- Transaction history with summaries
- Asset activity analysis (volume, unique accounts, trends)
- Source links for every on-chain claim
- Account and asset watchlists with alert preferences

## Quick Start

```bash
# Clone
git clone https://github.com/stellarscope-ai/stellarscope-ai.git
cd stellarscope-ai

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development
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

## Development

```bash
pnpm build        # Build all packages
pnpm dev          # Start dev servers
pnpm test         # Run all tests
pnpm lint         # Lint all packages
pnpm typecheck    # Type-check all packages
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

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/chat` | AI chat interface |
| `/watchlists` | Watchlist management |
| `/watchlists/[id]` | Watchlist detail |
| `/api/health` | Health check |
| `/api/chat` | SSE chat endpoint |
| `/api/accounts/[id]` | Account lookup |
| `/api/accounts/[id]/transactions` | Transaction history |
| `/api/watchlists` | Watchlist CRUD |
| `/api/auth/login` | Magic link login |

## Tests

```bash
pnpm test           # 56 TypeScript tests
cargo test          # 18 Rust contract tests
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, coding standards, and PR guidelines.

## License

[MIT](LICENSE)

---

<p align="center">
  Better questions. Deeper insights.
</p>
