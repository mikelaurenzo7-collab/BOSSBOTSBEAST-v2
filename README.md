# 🐲 BEAST_BOTS

**Every integration. One perfect bot. Infinite leverage.**

Production-ready sovereign AI workforce platform. Connect your tools once. Your autonomous agents run forever.

## Quick Start (Local)

```bash
git clone https://github.com/mikelaurenzo7-collab/BOSSBOTSBEAST-v2.git
cd BOSSBOTSBEAST-v2
pnpm install

# Add your keys
cp .env.example .env.local

# Run
cd apps/web && npm run dev
```

## Production Deployment (Vercel)

1. Push to GitHub
2. Import repo on Vercel
3. Add environment variables from `.env.example` (Clerk + Postgres + OAuth keys)
4. Deploy

The monorepo is configured with Turborepo + pnpm workspaces for fast builds.

## Features
- **Clerk Auth** — Multi-user, secure sign-in
- **32 Integrations** — Meta, Instagram, Notion, Slack, Linear, GitHub, Vercel, Stripe + 24 more
- **Swarm Commander** — Visual autonomous workflows (Linear → Slack + Notion in one click)
- **Encrypted Token Vault** — Per-user OAuth tokens in Vercel Postgres
- **Full Audit Trail** — Every execution logged
- **Real Execution Engine** — Uses live tokens for actual API calls

## Architecture
- Next.js 15 + React 19 (apps/web)
- Drizzle + Vercel Postgres (packages/db)
- Agent runtime + Workflow executor (packages/agents)
- Clerk for auth

Built with immense creativity, purpose, and attention to detail.

---

**Phase 3 Complete** — Polished, production-ready, error-handled, deployable.
