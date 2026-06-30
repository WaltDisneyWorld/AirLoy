import type { FareProduct, Partner, TierId } from "../types";
import { FARE_BY_ID, MIN_SEGMENT_MILES } from "../data/fares";
import { TIER_BY_ID } from "../data/tiers";
import { routeMiles } from "./distance";

// ─────────────────────────────────────────────────────────────────────────────
// The earning engine — exactly how a flight or a partner activity turns into
// miles. Every number the UI shows (the earn calculator, the activity ledger,
// a booked award's credit) flows through here, so the program is internally
// consistent end to end.
// ─────────────────────────────────────────────────────────────────────────────

export interface FlightEarn {
  distance: number;
  /** Redeemable miles credited to the spendable balance. */
  redeemable: number;
  /** Base miles before the elite bonus (distance × fare earn rate, floored). */
  base: number;
  /** Bonus miles from the member's status tier. */
  tierBonus: number;
  /** Elite-qualifying miles (no status bonus applied). */
  eqm: number;
  /** Qualifying segments (1 per one-way segment). */
  eqs: number;
  /** Estimated qualifying dollars (fare spend) for this flight. */
  eqd: number;
  /** True when the per-segment minimum floor lifted the base. */
  flooredMinimum: boolean;
}

/**
 * Miles earned on a single one-way flight.
 *
 *   base        = max(distance × fare.earnRate, 500-mile floor)
 *   tier bonus  = base × tier.earnBonus              (Cirrus +25% … Zenith +100%)
 *   redeemable  = base + tier bonus
 *   eqm         = distance × fare.eqmRate            (status earn — no bonus)
 *   eqd         = distance × fare.revenuePerMile     (fare-spend estimate)
 */
export function flightEarn(
  fromCode: string,
  toCode: string,
  fareId: string,
  tierId: TierId
): FlightEarn {
  const fare: FareProduct = FARE_BY_ID[fareId] ?? FARE_BY_ID.main;
  const tier = TIER_BY_ID[tierId];
  const distance = routeMiles(fromCode, toCode);

  const raw = Math.round(distance * fare.earnRate);
  const base = Math.max(raw, distance > 0 ? MIN_SEGMENT_MILES : 0);
  const tierBonus = Math.round(base * tier.perks.earnBonus);

  return {
    distance,
    base,
    tierBonus,
    redeemable: base + tierBonus,
    eqm: Math.round(distance * fare.eqmRate),
    eqs: distance > 0 ? 1 : 0,
    eqd: Math.round(distance * fare.revenuePerMile),
    flooredMinimum: raw < base,
  };
}

/** Miles earned from a partner activity given the qualifying spend. */
export function partnerEarn(partner: Partner, spendUsd: number, stays = 1): number {
  const variable = Math.round(partner.milesPerDollar * Math.max(0, spendUsd));
  const flat = partner.flatBonus * Math.max(1, stays);
  return variable + flat;
}

/** Cumulative redeemable miles per tier for a given route+fare — the "what if
 *  I had status" comparison shown on the earn calculator. */
export function earnByTier(
  fromCode: string,
  toCode: string,
  fareId: string
): { tierId: TierId; redeemable: number }[] {
  return (["horizon", "cirrus", "aurora", "zenith"] as TierId[]).map((tierId) => ({
    tierId,
    redeemable: flightEarn(fromCode, toCode, fareId, tierId).redeemable,
  }));
}
