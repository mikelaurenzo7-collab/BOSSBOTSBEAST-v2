# Vercel Deployment Guide for BOSSBOTSBEAST

1. Connect this repo to Vercel
2. In Vercel Dashboard → Storage → Create **Vercel Postgres**
3. Copy the `DATABASE_URL` and add it as an Environment Variable
4. Add other required env vars from `.env.example`
5. Deploy

BeastOS is fully optimized for Vercel serverless + Postgres.