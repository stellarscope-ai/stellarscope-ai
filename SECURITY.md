# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |
| < 0.1   | No        |

## Reporting a Vulnerability

Please **do not** report security vulnerabilities through public GitHub issues.

Instead, report them via one of the following:

1. **GitHub Security Advisories:** https://github.com/stellarscope-ai/stellarscope-ai/security/advisories/new
2. **Email:** security@stellarscope-ai.org (if available)

Include in your report:

- Type of vulnerability
- Full paths of affected source files
- Step-by-step instructions to reproduce
- Impact assessment (what can an attacker do?)

## Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 1 week
- **Fix or mitigation:** Within 30 days (critical issues faster)

## Scope

In scope:
- The web application and API endpoints
- Stellar data layer (Horizon integration)
- Soroban smart contracts
- Database access (Supabase/PostgreSQL)
- AI tool orchestration

Out of scope:
- Social engineering attacks
- Denial of service
- Issues in third-party dependencies (report to the dependency)
