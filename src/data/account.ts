import type { Activity, Member, TierId } from "../types";
import { flightEarn, partnerEarn } from "../lib/earning";
import { FARE_BY_ID } from "./fares";
import { PARTNER_BY_ID } from "./partners";
import { airportLabel } from "./airports";

// ─────────────────────────────────────────────────────────────────────────────
// The demo member and the seed activity ledger. Every flight entry is run
// through the real earning engine, so the seeded miles, EQM, segments and
// dollars are exactly what the program's own rules produce — the ledger can't
// drift from the engine.
//
// Story: Maya holds Aurora status (earned in 2025) and is requalifying through
// 2026 — a couple of thousand qualifying miles short of locking Aurora in again.
// ─────────────────────────────────────────────────────────────────────────────

export const MEMBER: Member = {
  id: "AL-4072 188",
  firstName: "Maya",
  lastName: "Okonkwo",
  email: "maya.okonkwo@example.com",
  homeAirport: "SFO",
  joinedISO: "2018-03-22T00:00:00",
  tierId: "aurora",
  lifetimeMiles: 612_000,
  accent: "from-aero-500 to-gold-400",
};

let seq = 0;
const id = (p: string) => `seed-${p}-${++seq}`;

function flight(date: string, from: string, to: string, fareId: string, tierId: TierId): Activity {
  const e = flightEarn(from, to, fareId, tierId);
  return {
    id: id("f"),
    date,
    kind: "flight",
    description: `${airportLabel(from)} → ${airportLabel(to)}`,
    miles: e.redeemable,
    eqm: e.eqm,
    eqs: e.eqs,
    eqd: e.eqd,
    fromCode: from,
    toCode: to,
    fareProductId: fareId,
    cabin: FARE_BY_ID[fareId].cabin,
    seed: true,
  };
}

function partner(date: string, partnerId: string, spend: number, stays: number, description: string): Activity {
  const p = PARTNER_BY_ID[partnerId];
  return {
    id: id("p"),
    date,
    kind: "partner",
    description,
    miles: partnerEarn(p, spend, stays),
    partnerId,
    cashUsd: spend,
    seed: true,
  };
}

function bonus(date: string, milesAmt: number, description: string): Activity {
  return { id: id("b"), date, kind: "bonus", description, miles: milesAmt, seed: true };
}

function award(date: string, from: string, to: string, cost: number, taxes: number, description: string): Activity {
  return {
    id: id("a"),
    date,
    kind: "award",
    description,
    miles: -cost,
    fromCode: from,
    toCode: to,
    cashUsd: taxes,
    seed: true,
  };
}

function redeem(date: string, kind: "upgrade" | "partner-redeem", cost: number, description: string, copay?: number): Activity {
  return { id: id("r"), date, kind, description, miles: -cost, cashUsd: copay, seed: true };
}

// Built oldest → newest, then sorted newest-first for display.
const ENTRIES: Activity[] = [
  // ── 2025 — the year Maya earned Aurora (then holding Cirrus, +25%) ──────────
  bonus("2025-01-01T09:00:00", 45_000, "Balance brought forward"),
  flight("2025-02-10T07:30:00", "SFO", "LHR", "business", "cirrus"),
  flight("2025-02-16T11:10:00", "LHR", "SFO", "business", "cirrus"),
  partner("2025-02-12T20:00:00", "lumen", 1_240, 1, "Lumen Hotels & Resorts · London"),
  flight("2025-05-05T23:55:00", "SFO", "SIN", "business", "cirrus"),
  flight("2025-05-14T06:40:00", "SIN", "SFO", "business", "cirrus"),
  award("2025-07-18T10:00:00", "SFO", "HND", 95_000, 88.4, "Award flight · San Francisco (SFO) → Tokyo (HND)"),
  flight("2025-09-12T08:00:00", "SFO", "JFK", "main", "cirrus"),
  flight("2025-09-15T17:25:00", "JFK", "SFO", "main", "cirrus"),
  flight("2025-11-20T15:05:00", "SFO", "CDG", "premium", "cirrus"),
  flight("2025-11-27T12:35:00", "CDG", "SFO", "premium", "cirrus"),

  // ── 2026 — requalifying year (holding Aurora, +60%) ─────────────────────────
  partner("2026-01-05T12:00:00", "summit-card", 4_200, 1, "AirLoy Summit Card · December statement"),
  flight("2026-01-14T07:00:00", "SFO", "JFK", "business", "aurora"),
  flight("2026-01-17T18:30:00", "JFK", "SFO", "business", "aurora"),
  partner("2026-02-02T21:00:00", "lumen", 1_180, 1, "Lumen Hotels & Resorts · New York"),
  flight("2026-02-09T09:15:00", "SFO", "LHR", "business", "aurora"),
  flight("2026-02-15T11:40:00", "LHR", "SFO", "business", "aurora"),
  bonus("2026-02-20T10:00:00", 2_500, "Summer Status Sprint registration bonus"),
  partner("2026-03-02T12:00:00", "summit-card", 3_800, 1, "AirLoy Summit Card · January statement"),
  flight("2026-03-20T06:45:00", "SFO", "ORD", "main", "aurora"),
  flight("2026-03-23T19:05:00", "ORD", "SFO", "main", "aurora"),
  redeem("2026-03-28T14:00:00", "upgrade", 14_000, "Economy → Premium upgrade · SFO–ORD", 50),
  partner("2026-03-18T13:30:00", "tablejoy", 260, 1, "TableJoy Dining · 4 visits"),
  partner("2026-04-02T12:00:00", "summit-card", 5_100, 1, "AirLoy Summit Card · February statement"),
  flight("2026-04-11T11:50:00", "SFO", "NRT", "premium", "aurora"),
  flight("2026-04-19T16:20:00", "NRT", "SFO", "premium", "aurora"),
  partner("2026-04-25T15:00:00", "marketplace", 640, 1, "AirLoy Marketplace · electronics"),
  partner("2026-05-02T12:00:00", "summit-card", 4_400, 1, "AirLoy Summit Card · March statement"),
  flight("2026-05-08T08:10:00", "SFO", "DEN", "main", "aurora"),
  flight("2026-05-11T20:45:00", "DEN", "SFO", "main", "aurora"),
  redeem("2026-05-20T09:00:00", "partner-redeem", 9_500, "AirLoy Lounge day pass · SFO"),
  partner("2026-06-02T12:00:00", "summit-card", 3_900, 1, "AirLoy Summit Card · April statement"),
  flight("2026-06-05T07:20:00", "SFO", "MIA", "flex", "aurora"),
  flight("2026-06-09T22:15:00", "MIA", "SFO", "flex", "aurora"),
  partner("2026-06-12T17:00:00", "veloce", 0, 1, "Veloce Car Rental · Miami"),
];

export const SEED_ACTIVITY: Activity[] = [...ENTRIES].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);
