# 🌿 Verdant — Climate Tech Investment Platform

A Next.js 14 + Supabase platform for connecting climate startups with investors, researchers, and talent.

## Features
- ✅ User signup & login (with role selection)
- ✅ Create & list climate startups
- ✅ Browse & filter startups by sector/stage
- ✅ Startup detail pages
- ✅ Founder dashboard

---

## Setup (5 steps, ~10 minutes)

### 1. Create Supabase project
1. Go to [supabase.com](https://supabase.com) → New project
2. Name it `verdant`, set a database password, choose a region close to you
3. Wait ~2 minutes for it to provision

### 2. Run the database schema
1. In Supabase dashboard → **SQL Editor**
2. Copy the entire contents of `supabase-schema.sql`
3. Paste and click **Run**

### 3. Configure environment variables
1. Copy `.env.example` to `.env.local`:
   ```
   cp .env.example .env.local
   ```
2. In Supabase → **Settings → API**:
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Run locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel
```
When prompted, add the two environment variables from step 3.

Or connect your GitHub repo in the [Vercel dashboard](https://vercel.com) and add the env vars in Project Settings → Environment Variables.

---

## Project Structure

```
verdant/
├── app/
│   ├── page.js              # Homepage
│   ├── auth/page.js         # Login + Signup
│   ├── dashboard/page.js    # User dashboard
│   ├── startups/
│   │   ├── page.js          # Browse all startups
│   │   ├── create/page.js   # Create a startup
│   │   └── [id]/page.js     # Startup detail
│   ├── layout.js
│   └── globals.css
├── components/
│   ├── Navbar.js
│   ├── StartupCard.js
│   └── StartupGrid.js
├── lib/
│   └── supabase/
│       ├── client.js        # Browser client
│       └── server.js        # Server client
├── middleware.js             # Auth route protection
└── supabase-schema.sql      # Database schema
```

---

## What's next (post-hackathon)
- [ ] AI Verdant Score (call Claude/GPT API on startup description)
- [ ] AI Climate Impact Calculator
- [ ] Investor ↔ Startup matchmaking
- [ ] Email notifications
