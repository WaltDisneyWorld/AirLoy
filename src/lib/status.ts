import type { Activity, Member, MetricProgress, MilesSummary, TierStanding } from "../types";
import { TIERS, TIER_BY_ID, nextTier } from "../data/tiers";
import { TODAY, addMonths, daysBetween } from "./format";

// ─────────────────────────────────────────────────────────────────────────────
// The single derivation layer. Given a member and their activity ledger, this
// computes the spendable balance, the program-year qualifying totals, the
// published-vs-projected tier, progress to the next tier, and the miles-expiry
// clock. Nothing here is stored — book an award and every one of these numbers
// moves at once.
// ─────────────────────────────────────────────────────────────────────────────

/** Cents per mile AirLoy uses for the "what your miles are worth" readout. */
export const CENT_PER_MILE = 1.4;

/** Miles expire this many months after the most recent qualifying activity. */
export const EXPIRY_MONTHS = 18;

/** The program (qualification) year resets each calendar year. */
export function programYear(now: Date = TODAY): number {
  return now.getFullYear();
}

function inProgramYear(iso: string, year: number): boolean {
  return new Date(iso).getFullYear() === year;
}

/** Spendable redeemable-miles balance: the running sum of every ledger delta. */
export function balanceFrom(activity: Activity[]): number {
  return activity.reduce((sum, a) => sum + a.miles, 0);
}

/** Current program-year elite-qualifying totals. */
export function qualifyingYtd(activity: Activity[], now: Date = TODAY): MetricProgress {
  const year = now.getFullYear();
  return activity.reduce<MetricProgress>(
    (acc, a) => {
      if (!inProgramYear(a.date, year)) return acc;
      acc.eqm += a.eqm ?? 0;
      acc.eqs += a.eqs ?? 0;
      acc.eqd += a.eqd ?? 0;
      return acc;
    },
    { eqm: 0, eqs: 0, eqd: 0 }
  );
}

/** Does this qualifying total clear a tier? (miles OR segments) AND dollars. */
function meets(ytd: MetricProgress, reqEqm: number, reqEqs: number, reqEqd: number): boolean {
  const milesOrSeg = ytd.eqm >= reqEqm || ytd.eqs >= reqEqs;
  return milesOrSeg && ytd.eqd >= reqEqd;
}

/** The highest tier the current-year qualifying totals have reached. */
export function projectedTierId(ytd: MetricProgress) {
  let reached = TIERS[0];
  for (const t of TIERS) {
    if (meets(ytd, t.reqEqm, t.reqEqs, t.reqEqd)) reached = t;
  }
  return reached.id;
}

export function tierStanding(member: Member, activity: Activity[], now: Date = TODAY): TierStanding {
  const ytd = qualifyingYtd(activity, now);
  const current = TIER_BY_ID[member.tierId];
  const projected = TIER_BY_ID[projectedTierId(ytd)];
  const next = nextTier(projected.id);

  if (!next) {
    return { current, projected, ytd, progress: 1, bindingMetric: "eqm" };
  }

  const milesProg = next.reqEqm ? ytd.eqm / next.reqEqm : 1;
  const segProg = next.reqEqs ? ytd.eqs / next.reqEqs : 1;
  const eqdProg = next.reqEqd ? ytd.eqd / next.reqEqd : 1;

  // Reach the next tier via miles OR segments (take the nearer), AND dollars.
  const orProg = Math.max(milesProg, segProg);
  const orMetric: "eqm" | "eqs" = milesProg >= segProg ? "eqm" : "eqs";
  const overall = Math.min(1, Math.min(orProg, eqdProg));
  const bindingMetric: "eqm" | "eqs" | "eqd" = eqdProg < orProg ? "eqd" : orMetric;

  const toNext: MetricProgress = {
    eqm: Math.max(0, next.reqEqm - ytd.eqm),
    eqs: Math.max(0, next.reqEqs - ytd.eqs),
    eqd: Math.max(0, next.reqEqd - ytd.eqd),
  };

  return { current, projected, next, ytd, toNext, progress: overall, bindingMetric };
}

export function milesSummary(activity: Activity[], now: Date = TODAY): MilesSummary {
  const balance = balanceFrom(activity);
  const year = now.getFullYear();
  let earnedYtd = 0;
  let redeemedYtd = 0;
  let lastActivityISO = activity.length ? activity[0].date : now.toISOString();

  for (const a of activity) {
    if (new Date(a.date) > new Date(lastActivityISO)) lastActivityISO = a.date;
    if (!inProgramYear(a.date, year)) continue;
    if (a.miles > 0) earnedYtd += a.miles;
    else redeemedYtd += -a.miles;
  }

  const expiresISO = addMonths(lastActivityISO, EXPIRY_MONTHS);
  return {
    balance,
    valueUsd: (balance * CENT_PER_MILE) / 100,
    earnedYtd,
    redeemedYtd,
    expiresISO,
    daysToExpiry: daysBetween(now.toISOString(), expiresISO),
    lastActivityISO,
  };
}

/** Lifetime miles flown, used for the lifetime / million-mile track. */
export function lifetimeMiles(member: Member, activity: Activity[]): number {
  const flown = activity
    .filter((a) => a.kind === "flight")
    .reduce((sum, a) => sum + (a.eqm ?? 0), 0);
  return member.lifetimeMiles + flown;
}
