# Architecture

StellarScope AI is a monorepo web application that uses AI to help users explore Stellar blockchain data.

## System Overview

```
User → Next.js (web app + API routes) → AI Orchestrator → Tools → Stellar Horizon
                                              ↓
                                         Analytics Engine
                                              ↓
                                         Supabase (PostgreSQL)
```

## Packages

### `@stellarscope/shared`
Shared TypeScript types and Zod validation schemas used across all packages.

**Key types:** `StellarAccount`, `StellarBalance`, `StellarTransaction`, `AssetInfo`, `Watchlist`, `ChatMessage`

### `@stellarscope/stellar-data`
Stellar Horizon API integration. Fetches accounts, transactions, and asset data.

**Key functions:** `getAccount()`, `getTransactionHistory()`, `getAssetDetails()`, `getAssetActivity()`

**Design rules:**
- All functions validate inputs before calling Horizon
- Returns structured data, never prose
- Every response includes `explorerUrl` for verification
- Typed errors: `AccountNotFoundError`, `AssetNotFoundError`, `HorizonApiError`

### `@stellarscope/analytics`
Deterministic calculations over Stellar data. No AI involvement — pure math.

**Key functions:** `summarizeBalances()`, `summarizeTransactions()`, `compareActivity()`, `getSevenDayComparison()`

**Design rules:**
- All calculations are deterministic and testable
- Handles zero-division explicitly (returns `null` for percent when baseline is 0)
- Never invents data — works only with what it receives

### `@stellarscope/ai`
Provider-agnostic AI orchestration with tool calling.

**Components:**
- `AIProvider` interface — swap between Gemini, Noop, or custom providers
- `Orchestrator` — manages tool call loops (up to 5 rounds)
- `Tools` — controlled set of functions the AI can call

**Design rules:**
- AI never receives private keys or transaction submission permission
- Tool calls are schema-validated
- Responses must include source links
- If data is insufficient, the AI says so explicitly

## Data Flow

### Chat Query
```
1. User asks: "What is the balance of GBX...?"
2. POST /api/chat receives message
3. Orchestrator sends to AI provider with tool definitions
4. AI selects get_account_summary tool
5. Tool calls getAccount() from stellar-data
6. Tool calls summarizeBalances() from analytics
7. Result returned to AI for explanation
8. AI streams response with source links
```

### Watchlist Alert
```
1. Scheduled worker checks watchlist items
2. Fetches current data from Horizon
3. Compares against alert thresholds
4. Sends notification (email/Telegram)
5. Records delivery in alert_history table
```

## Database

PostgreSQL via Supabase. 5 tables:

- `profiles` — user profiles (extends auth.users)
- `watchlists` — named collections
- `watchlist_items` — accounts and assets to monitor
- `alert_preferences` — threshold-based alerts
- `saved_queries` — chat history

All tables have Row Level Security (RLS) — users can only access their own data.

## Smart Contract

Soroban contract (`contracts/watchlist`) manages premium subscriptions on-chain.

- Tier 1 (Basic): 1 XLM / 30 days
- Tier 2 (Premium): 5 XLM / 30 days
- Functions: create, check, renew, upgrade, cancel
- All mutations require user auth (`require_auth()`)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `GOOGLE_AI_API_KEY` | For AI | Google Gemini API key |
| `AI_PROVIDER` | No | `google` or `noop` (default: `noop`) |
| `STELLAR_HORIZON_URL` | No | Horizon server URL |
| `SOROBAN_CONTRACT_ADDRESS` | For subs | Deployed contract address |