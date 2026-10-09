# Contributing to StellarScope AI

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/<your-username>/stellarscope-ai.git`
3. Install dependencies: `pnpm install`
4. Copy environment variables: `cp .env.example .env.local`
5. Create a branch: `git checkout -b feat/your-feature`

## Development Setup

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Rust + cargo (for Soroban contracts)

### Commands

```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all packages
pnpm test         # Run all tests
pnpm lint         # Lint all packages
pnpm typecheck    # Type-check all packages
```

### Running a single package

```bash
pnpm --filter @stellarscope/stellar-data test
pnpm --filter @stellarscope/ai dev
```

## Project Structure

- `apps/web` — Next.js application (frontend + API routes)
- `packages/shared` — Shared types and Zod schemas
- `packages/stellar-data` — Stellar Horizon integration
- `packages/analytics` — Deterministic calculations
- `packages/ai` — LLM orchestration and tool definitions
- `contracts/watchlist` — Soroban smart contract

## Coding Standards

- **TypeScript** with strict mode
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`
- No comments unless requested
- Keep functions small and focused
- Validate at system boundaries (API input, user data), not internally
- Never expose secrets or keys in code or logs

## Pull Request Process

1. Ensure all checks pass: `pnpm lint && pnpm typecheck && pnpm test`
2. Keep PRs focused — one feature or fix per PR
3. Write a clear PR description explaining what and why
4. Link the related issue: `Closes #123`
5. Add screenshots for UI changes
6. Request review from a maintainer

## Issue Guidelines

- Use the provided issue templates
- Include reproduction steps for bugs
- For features, describe the problem before the solution
- Label issues appropriately

## Questions?

Open a [discussion](https://github.com/stellarscope-ai/stellarscope-ai/discussions) or ask in an issue.
