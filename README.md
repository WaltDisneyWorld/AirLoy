# AirLoy · Miles that take you further

A polished, end-to-end **airline frequent-flyer loyalty program**. Members earn
miles on flights and across a partner coalition, climb four status tiers, track
exactly where they stand toward the next one, and redeem miles for award flights,
upgrades, and partner rewards — all in one beautifully clear, transparent program.

It models the UX patterns of a real frequent-flyer program with entirely
**original branding, copy, tiers, partners, and pricing logic** — no third-party
assets.

> Demo only. All carriers, partners, fares, members, and balances are fictional.

---

## ✨ Highlights

### One ledger, one truth
The whole app is **derived from a single source of truth**: the member and their
**activity ledger**. The miles balance, elite-qualifying progress, published-vs-projected
tier, and the miles-expiry clock are all *computed* — so when you redeem an award
in the Redeem flow, the balance, the status bars, and the expiry date all move at
once, everywhere, and survive a reload (`localStorage`).

### Member dashboard (`/dashboard`)
- A premium **digital membership card**, tinted to your status tier, with a
  deterministic barcode and your member number.
- Live miles balance with a hand-built **6-month earning sparkline** and a cash-value
  readout at the program's blended cent-per-mile rate.
- A **miles-expiry notice** — 18 months from your last activity, with the clock
  resetting on any earn or redemption.
- The **status tracker** (see below), quick actions, recent activity, and live promotions.

### Status & tiers (`/status`)
- Four original tiers — **Horizon → Cirrus → Aurora → Zenith** — each with real
  qualifying thresholds (miles **or** segments, **plus** dollars) and escalating benefits.
- The **status tracker**: a progress ring plus per-metric bars (qualifying miles,
  segments, dollars) that highlight the *closest* (binding) metric, and a clear
  "X qualifying miles from requalifying for Aurora" headline.
- **Published vs. projected** status — you keep this year's tier while your
  current-year flying tracks next year's.
- A full **benefits comparison** matrix and a **lifetime-miles** ("million-miler") track.

### Earn (`/earn`)
- An interactive **earning calculator**: pick a route, fare product, and round-trip,
  and see base miles, your status bonus, redeemable total, and the elite-qualifying
  miles / segments / dollars it credits.
- A **"what this trip earns at each tier"** comparison, and a **"log this flight"**
  button that posts real activity to your account.
- The full **earn-rate table** by fare, and the **partner coalition** — hotels, car,
  dining, the co-brand card, shopping, and transfers.

### Redeem (`/redeem`)
- **Award flight search** with **dynamic award pricing**: every route+cabin floats
  between a published *saver* floor and a *standard* ceiling based on demand for the
  date — shown across all four cabins, with a live **10-day price calendar**.
- Honest booking: a transparent miles + taxes breakdown, a balance-after check, and
  a real redemption that deducts miles and lands on your statement.
- A **rewards catalog** (cabin upgrades + partner rewards) with cents-per-mile value,
  and the published **saver award chart** by distance zone.

### Activity (`/activity`)
- Your **full statement** — every earn and redemption — filterable (earned / redeemed
  / flights / partners), searchable, and **exportable to CSV**, with a one-click
  **demo reset**.

### Join (`/join`)
- A complete **enrollment** experience with a generated member number, barcode, and
  welcome-bonus confirmation.

---

## 🧮 The loyalty engine (`src/lib/`)

Every number in the UI flows through the same internally-consistent rules, so the
seeded ledger can never drift from the engine that prices new activity.

| Module | What it does |
|--------|--------------|
| `distance.ts` | Great-circle (haversine) distance between real airport coordinates → award zones. No hard-coded mileage tables. |
| `earning.ts` | Flight earning: `distance × fare rate × (1 + tier bonus)`, a 500-mile per-segment floor, EQM/EQS/EQD with **no** bonus on qualifying miles, plus partner earning. |
| `awards.ts` | Dynamic award pricing: a saver/standard award chart with a deterministic, demand-driven live price, taxes & fees, cents-per-mile value, and a price calendar. |
| `status.ts` | The derivation layer: balance, program-year qualifying totals, published-vs-projected tier, progress to the next tier (with the binding metric), and the 18-month expiry clock. |
| `store.ts` | A tiny external store persisted to `localStorage`, with cross-tab sync. |

**Earning** — base miles scale with the fare you bought; your status tier multiplies
*redeemable* miles (Cirrus +25% → Zenith +100%) but never the *qualifying* miles.

**Qualification** — reach a tier by clearing its **miles _or_ segments** bar **and**
its **dollars** bar in a program year; keep that status the rest of the year and all
of the next.

**Awards** — the live price is monotonic between saver and standard, deterministic per
(route, date, cabin), and capped — verified by the smoke test across every route and cabin.

---

## 🚀 Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build
npm run smoke      # headless: validate the engines + server-render every screen
```

`npm run smoke` exercises the earning, award, and status engines on real data
(distances symmetric, redeemable ≥ base, EQM tier-independent, awards within the
saver→standard band, the seed account hitting its intended Aurora-requalifying
narrative, top-tier reachable) and server-renders every route — catching runtime
crashes and pricing regressions without a browser.

---

## 🧱 Tech & architecture

- **Vite + React 18 + TypeScript (strict)** and **Tailwind CSS** with a custom
  design system. No backend — state lives client-side and persists to `localStorage`.
- The membership card barcode, sparkline, progress ring, and meters are all
  hand-built **SVG** (no chart dependency).

```
src/
  data/        airports, tiers, fare products, partners, rewards, promotions,
               and the seed member + activity ledger (built via the real engine)
  lib/         distance, earning, awards, status (the derivation layer),
               persisted store, formatting, hooks
  components/
    ui/        Icon, MemberCard, Barcode, Meter (bar+ring), Sparkline, CountUp,
               Reveal, Modal, Stat, TierBadge
    layout/    TopNav, Footer, Logo
    member/    StatusTracker, ActivityList, PromoStrip
    earn/      EarnCalculator, PartnerGrid
    redeem/    AwardSearch, RewardsCatalog
  pages/       Home, Dashboard, Earn, Redeem, Status, Activity, Join
```

### Deploy on Vercel
`vercel.json` rewrites client routes to `index.html` so `/dashboard`, `/redeem`,
etc. deep-link. Build is `npm run build`, output `dist` (auto-detected). No
environment variables are required — the program runs entirely client-side.

---

## 🛡️ Transparency over dark patterns

The program is made appealing through genuine clarity — a real qualification model,
a published award chart, an honest "you only redeem what you can afford" check, and
a miles-expiry clock you can actually see and reset. No fake scarcity, no invented
countdowns, no personalized markups: the award price is the same for everyone.

### A note on branding
All carrier, partner, and member names are **original to AirLoy** and fictional.
The brand mark and membership card are original artwork; no real airline logos or
trademarks are used.
