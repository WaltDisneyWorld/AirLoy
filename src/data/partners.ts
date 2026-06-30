import type { Partner } from "../types";

// Earning partners across the AirLoy coalition. All brands are original to the
// demo. Rates are illustrative but internally consistent with the earn engine
// (lib/earning.ts).
export const PARTNERS: Partner[] = [
  {
    id: "lumen",
    name: "Lumen Hotels & Resorts",
    category: "hotel",
    rate: "500 + 3 miles / $1",
    milesPerDollar: 3,
    flatBonus: 500,
    unit: "stay",
    blurb: "Earn on the room rate plus a flat bonus every completed stay.",
    accent: "from-aero-400 to-aero-600",
  },
  {
    id: "cedarwood",
    name: "Cedarwood Suites",
    category: "hotel",
    rate: "400 + 2 miles / $1",
    milesPerDollar: 2,
    flatBonus: 400,
    unit: "stay",
    blurb: "Extended-stay comfort with steady mileage on every night.",
    accent: "from-emerald-400 to-emerald-600",
  },
  {
    id: "veloce",
    name: "Veloce Car Rental",
    category: "car",
    rate: "1,000 / rental",
    milesPerDollar: 0,
    flatBonus: 1000,
    unit: "rental",
    blurb: "A flat thousand miles on every qualifying rental, any length.",
    accent: "from-rose-400 to-rose-600",
  },
  {
    id: "tablejoy",
    name: "TableJoy Dining",
    category: "dining",
    rate: "5 miles / $1",
    milesPerDollar: 5,
    flatBonus: 0,
    unit: "$ at the table",
    blurb: "Register a card and earn at thousands of partner restaurants.",
    accent: "from-orange-400 to-orange-600",
  },
  {
    id: "summit-card",
    name: "AirLoy Summit Card",
    category: "card",
    rate: "2 miles / $1 · 3× on travel",
    milesPerDollar: 2,
    flatBonus: 0,
    unit: "$ spent",
    blurb: "The co-brand card: 3× miles on travel and dining, 2× everywhere else.",
    accent: "from-ink-700 to-ink-950",
  },
  {
    id: "marketplace",
    name: "AirLoy Marketplace",
    category: "shopping",
    rate: "up to 8 miles / $1",
    milesPerDollar: 4,
    flatBonus: 0,
    unit: "$ online",
    blurb: "Shop hundreds of online stores through the mileage portal.",
    accent: "from-violet-400 to-violet-600",
  },
];

export const PARTNER_BY_ID: Record<string, Partner> = Object.fromEntries(
  PARTNERS.map((p) => [p.id, p])
);
