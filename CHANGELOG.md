# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - Unreleased

### Added

- Monorepo scaffold (Turborepo + pnpm)
- Next.js web application with branded landing page
- Shared types and Zod schemas (`@stellarscope/shared`)
- Stellar Horizon integration (`@stellarscope/stellar-data`)
  - `getAccount()`, `getAccountBalances()`, `getTransactionHistory()`, `getTransactionDetails()`
  - `getAssetDetails()`, `getAssetActivity()`
  - Input validation, typed error hierarchy
- Analytics engine (`@stellarscope/analytics`)
  - `summarizeBalances()`, `summarizeTransactions()`, `compareActivity()`
  - `getSevenDayComparison()` for 7-day activity trends
  - `percentChange()` with zero-division handling
- AI orchestration (`@stellarscope/ai`)
  - Provider-agnostic `AIProvider` interface
  - Google Gemini integration with streaming
  - Multi-step tool call orchestration
  - 4 tools: account summary, transaction history, transaction details, asset activity
- Chat interface
  - SSE streaming chat API
  - ChatPanel, ChatMessage, ChatInput components
- Watchlists
  - Supabase Auth (email magic link)
  - Watchlist CRUD API
  - Watchlist list and detail pages
- Soroban subscription contract
  - Create, renew, upgrade, cancel subscriptions
  - Tier pricing (Basic: 1 XLM, Premium: 5 XLM)
  - 18 Rust unit tests
- Supabase database schema with RLS policies
- GitHub Actions CI pipeline
- Issue templates, PR template, contributing guide
- Documentation: architecture, API reference, deployment guide
- Sentry error tracking setup
- Docker configuration
- 56 TypeScript tests + 18 Rust tests