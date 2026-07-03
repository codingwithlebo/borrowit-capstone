# Borrowit — Founder Capstone

## Overview
A neighbourhood tool and equipment lending marketplace built for the Melsoft Academy Founder Capstone. People near you have drills, mixers, tents, and bikes sitting idle. You need them for a day. Borrowit connects you.

The brief came from a founder named Thabo. I scoped ruthlessly, refused two dark patterns he asked for, and shipped four things done properly instead of ten things half-built.

**Live URL:** https://borrowit-capstone.netlify.app/
**GitHub:** https://github.com/codingwithlebo/borrowit-capstone

---

## Technologies Used
- React 18
- TypeScript (strict mode, no `any`)
- Vite
- Unsplash (photography)

## Project Structure
src/
├── data/
│   ├── types.ts        — domain model (Item, Owner, AppRoute, FilterState)
│   └── items.ts        — 8 mock items typed as if a real API is coming
├── App.tsx             — all pages and components
└── main.tsx            — entry point

## What's Built
- **Browse screen** — search by keyword, filter by category and pricing model
- **Item detail** — photo, owner info, ratings, distance, Book Now
- **2-step booking flow** — pick dates with live cost → contact details → confirmation
- **Auth screen** — optional sign in / sign up (not forced — see FOUNDER-RESPONSE.md)

## What Was Cut and Why
Messaging, map, wishlist, referral codes, dark mode, real-time updates, offline support. Every cut is documented with reasoning in `DECISION-LOG.md`.

## Getting Started
```bash
npm install
npm run dev
npm run typecheck
```

## Deliverables
- `FOUNDER-RESPONSE.md` — my professional pushback to Thabo
- `DECISION-LOG.md` — 8 real decisions with tradeoffs
- `AI-USAGE.md` — 3 AI moments including one where AI was confidently wrong

## Author
Malebo Nkuna
Completion Date: 3 July 2026