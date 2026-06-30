import type { CabinId, Zone } from "../types";
import { routeMiles, zoneForMiles } from "./distance";
import { roundMiles } from "./format";

// ─────────────────────────────────────────────────────────────────────────────
// Award pricing. AirLoy uses dynamic award pricing: every route+cabin has a
// published *saver* floor and a *standard* ceiling (the award chart below), and
// the live price floats between them with demand for that specific date. The
// demand signal is derived deterministically from the route and date, so prices
// are stable for a given search and a price calendar can be rendered.
// ─────────────────────────────────────────────────────────────────────────────

/** Saver one-way award (miles) by distance zone × cabin — the published floor. */
export const SAVER_CHART: Record<Zone, Record<CabinId, number>> = {
  short: { economy: 6_000, premium: 9_000, business: 15_000, first: 25_000 },
  medium: { economy: 12_500, premium: 20_000, business: 35_000, first: 60_000 },
  long: { economy: 30_000, premium: 45_000, business: 70_000, first: 110_000 },
  ultra: { economy: 40_000, premium: 60_000, business: 95_000, first: 145_000 },
};

/** Standard (anytime) award = saver × this multiple — the ceiling. */
export const STANDARD_MULTIPLE = 2.0;

/** Taxes & carrier fees (USD), by zone, scaled up for premium cabins. */
const BASE_FEES: Record<Zone, number> = { short: 5.6, medium: 22, long: 78, ultra: 110 };
const CABIN_FEE_MULT: Record<CabinId, number> = {
  economy: 1,
  premium: 1.4,
  business: 2.2,
  first: 3,
};

/** Rough revenue-fare estimate (USD) for a route+cabin, for the value readout. */
const CABIN_FARE_PER_MILE: Record<CabinId, number> = {
  economy: 0.16,
  premium: 0.3,
  business: 0.55,
  first: 0.95,
};

export interface AwardQuote {
  fromCode: string;
  toCode: string;
  cabin: CabinId;
  distance: number;
  zone: Zone;
  saverMiles: number;
  standardMiles: number;
  /** Live dynamic price between saver and standard. */
  miles: number;
  /** 0..1 demand pressure that set the price within the band. */
  demand: number;
  /** True when the live price sits at (or within 5% of) the saver floor. */
  saverAvailable: boolean;
  taxesUsd: number;
  cashFareUsd: number;
  /** Value you extract: (cash fare − taxes) ÷ miles, in cents per mile. */
  centsPerMile: number;
}

/** Deterministic 0..1 hash of a string — stable "demand" without randomness. */
function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // map to 0..1
  return ((h >>> 0) % 10000) / 10000;
}

function cashFare(distance: number, cabin: CabinId): number {
  if (distance <= 0) return 0;
  // Gentle taper: long flights cost less per mile than short hops.
  const taper = 1 / (1 + distance / 9000);
  const fare = 49 + distance * CABIN_FARE_PER_MILE[cabin] * (0.55 + 0.45 * taper) * 2;
  return Math.round(fare);
}

/** Price one one-way award for a route, cabin and date. */
export function awardQuote(
  fromCode: string,
  toCode: string,
  cabin: CabinId,
  dateISO: string
): AwardQuote {
  const distance = routeMiles(fromCode, toCode);
  const zone = zoneForMiles(distance);
  const saverMiles = SAVER_CHART[zone][cabin];
  const standardMiles = Math.round(saverMiles * STANDARD_MULTIPLE);

  // Demand blends a route component, a date component and a cabin component so
  // prices vary believably across the calendar and across cabins.
  const day = dateISO.slice(0, 10);
  const demand = Math.min(
    1,
    0.15 +
      0.55 * hash01(`${fromCode}-${toCode}-${day}`) +
      0.3 * hash01(`${day}-${cabin}`)
  );

  const miles = roundMiles(saverMiles + (standardMiles - saverMiles) * demand);
  const taxesUsd = Math.round(BASE_FEES[zone] * CABIN_FEE_MULT[cabin] * 100) / 100;
  const fare = cashFare(distance, cabin);
  const centsPerMile = miles > 0 ? ((fare - taxesUsd) / miles) * 100 : 0;

  return {
    fromCode,
    toCode,
    cabin,
    distance,
    zone,
    saverMiles,
    standardMiles,
    miles,
    demand,
    saverAvailable: miles <= saverMiles * 1.05,
    taxesUsd,
    cashFareUsd: fare,
    centsPerMile: Math.max(0, Math.round(centsPerMile * 10) / 10),
  };
}

/** All four cabins priced for one route+date — the search results row. */
export function awardCabins(fromCode: string, toCode: string, dateISO: string): AwardQuote[] {
  return (["economy", "premium", "business", "first"] as CabinId[]).map((c) =>
    awardQuote(fromCode, toCode, c, dateISO)
  );
}

export interface CalendarDay {
  dateISO: string;
  miles: number;
  saver: boolean;
}

/** A price calendar for one cabin across `days` consecutive dates from `startISO`. */
export function awardCalendar(
  fromCode: string,
  toCode: string,
  cabin: CabinId,
  startISO: string,
  days = 14
): CalendarDay[] {
  const start = new Date(startISO);
  const out: CalendarDay[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86_400_000).toISOString();
    const q = awardQuote(fromCode, toCode, cabin, d);
    out.push({ dateISO: d, miles: q.miles, saver: q.saverAvailable });
  }
  return out;
}
