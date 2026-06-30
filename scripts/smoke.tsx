/* Headless smoke test: validate the loyalty engines on real data and
   server-render every screen, so we catch runtime crashes and pricing
   regressions without a browser. */
import "./_shim";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";

import { AIRPORTS } from "../src/data/airports";
import { TIERS } from "../src/data/tiers";
import { FARE_PRODUCTS, MIN_SEGMENT_MILES } from "../src/data/fares";
import { PARTNERS } from "../src/data/partners";
import { REWARDS } from "../src/data/rewards";
import { MEMBER, SEED_ACTIVITY } from "../src/data/account";

import { routeMiles, zoneForMiles } from "../src/lib/distance";
import { flightEarn, partnerEarn, earnByTier } from "../src/lib/earning";
import { awardQuote, awardCabins, awardCalendar } from "../src/lib/awards";
import {
  balanceFrom,
  milesSummary,
  tierStanding,
  qualifyingYtd,
  projectedTierId,
  lifetimeMiles,
} from "../src/lib/status";
import type { CabinId, TierId } from "../src/types";

function assert(c: unknown, m: string) {
  if (!c) throw new Error("ASSERT FAILED: " + m);
}

let checks = 0;
const CABINS: CabinId[] = ["economy", "premium", "business", "first"];
const TIER_IDS: TierId[] = ["horizon", "cirrus", "aurora", "zenith"];
const ROUTES: [string, string][] = [
  ["SFO", "LAX"],
  ["SFO", "JFK"],
  ["SFO", "LHR"],
  ["SFO", "HND"],
  ["SFO", "SIN"],
  ["JFK", "CDG"],
  ["DXB", "SYD"],
];

// 1) distances are positive & symmetric; zones are well-formed
for (const [a, b] of ROUTES) {
  const d = routeMiles(a, b);
  assert(d > 0, `distance ${a}-${b} > 0`);
  assert(d === routeMiles(b, a), `distance symmetric ${a}-${b}`);
  assert(["short", "medium", "long", "ultra"].includes(zoneForMiles(d)), `zone ${a}-${b}`);
  checks++;
}

// 2) earning: redeemable >= base, EQM has no tier bonus, tier bonus monotonic,
//    per-segment minimum honored
for (const [a, b] of ROUTES) {
  for (const fare of FARE_PRODUCTS) {
    let prevRedeemable = -1;
    let baseEqm = -1;
    for (const t of TIER_IDS) {
      const e = flightEarn(a, b, fare.id, t);
      assert(e.redeemable >= e.base, `redeemable>=base ${a}-${b} ${fare.id} ${t}`);
      assert(e.redeemable >= MIN_SEGMENT_MILES, `min segment ${a}-${b} ${fare.id} ${t}`);
      assert(e.redeemable >= prevRedeemable, `redeemable monotonic by tier ${a}-${b} ${fare.id}`);
      prevRedeemable = e.redeemable;
      // EQM identical across tiers (no status bonus on qualifying miles)
      if (baseEqm < 0) baseEqm = e.eqm;
      assert(e.eqm === baseEqm, `EQM tier-independent ${a}-${b} ${fare.id} ${t}`);
      assert(e.eqs === 1, `one segment ${a}-${b}`);
      assert(e.eqd >= 0, `eqd >= 0 ${a}-${b}`);
    }
    checks++;
  }
}

// 2b) earnByTier returns all four tiers in ascending order
{
  const rows = earnByTier("SFO", "LHR", "business");
  assert(rows.length === 4, "earnByTier 4 rows");
  for (let i = 1; i < rows.length; i++)
    assert(rows[i].redeemable >= rows[i - 1].redeemable, "earnByTier ascending");
  checks++;
}

// 2c) partner earning
for (const p of PARTNERS) {
  const m = partnerEarn(p, 1000, 1);
  assert(m === p.milesPerDollar * 1000 + p.flatBonus, `partner earn ${p.id}`);
  checks++;
}

// 3) awards: saver <= live <= standard, taxes/value finite, calendar stable
for (const [a, b] of ROUTES) {
  for (const cabin of CABINS) {
    const q = awardQuote(a, b, cabin, "2026-08-01T10:00:00");
    assert(q.miles >= q.saverMiles * 0.9, `award >= ~saver ${a}-${b} ${cabin}`);
    assert(q.miles <= q.standardMiles, `award <= standard ${a}-${b} ${cabin}`);
    assert(q.demand >= 0 && q.demand <= 1, `demand in [0,1] ${a}-${b} ${cabin}`);
    assert(q.taxesUsd > 0, `taxes > 0 ${a}-${b} ${cabin}`);
    assert(Number.isFinite(q.centsPerMile), `cpm finite ${a}-${b} ${cabin}`);
    // deterministic
    assert(q.miles === awardQuote(a, b, cabin, "2026-08-01T10:00:00").miles, `award deterministic ${a}-${b}`);
    checks++;
  }
  // cabins ascend in price
  const row = awardCabins(a, b, "2026-08-01T10:00:00");
  for (let i = 1; i < row.length; i++)
    assert(row[i].saverMiles >= row[i - 1].saverMiles, `cabin price ascends ${a}-${b}`);
  const cal = awardCalendar(a, b, "business", "2026-08-01T10:00:00", 10);
  assert(cal.length === 10 && cal.every((c) => c.miles > 0), `calendar ${a}-${b}`);
  checks++;
}

// 4) status engine on the seed account matches its intended narrative
{
  const balance = balanceFrom(SEED_ACTIVITY);
  assert(balance > 0, "seed balance positive");
  const summary = milesSummary(SEED_ACTIVITY);
  assert(summary.balance === balance, "summary balance == balanceFrom");
  assert(summary.daysToExpiry > 0, "expiry in the future");
  assert(summary.earnedYtd > summary.redeemedYtd, "earned > redeemed YTD");

  const ytd = qualifyingYtd(SEED_ACTIVITY);
  assert(ytd.eqm > 0 && ytd.eqs > 0 && ytd.eqd > 0, "YTD qualifying positive");
  assert(projectedTierId(ytd) === "cirrus", `projected cirrus (got ${projectedTierId(ytd)})`);

  const st = tierStanding(MEMBER, SEED_ACTIVITY);
  assert(st.current.id === "aurora", "current aurora");
  assert(st.next?.id === "aurora", "next is aurora (requalify)");
  assert(st.progress > 0.8 && st.progress <= 1, `progress ~0.9 (got ${st.progress})`);
  assert(st.bindingMetric === "eqm", `binding eqm (got ${st.bindingMetric})`);
  assert(lifetimeMiles(MEMBER, SEED_ACTIVITY) > MEMBER.lifetimeMiles, "lifetime grows with flights");
  checks++;
}

// 4b) reaching the top tier and the redemption math
{
  const allCabinsValue = REWARDS.every((r) => r.valueUsd > 0 && r.miles > 0);
  assert(allCabinsValue, "rewards have value & cost");
  // a hypothetical big-flying year reaches Zenith
  const heavy = Array.from({ length: 12 }, () => flightEarn("SFO", "SIN", "business", "horizon"));
  const eqm = heavy.reduce((s, e) => s + e.eqm, 0);
  const eqs = heavy.length;
  const eqd = heavy.reduce((s, e) => s + e.eqd, 0);
  assert(projectedTierId({ eqm, eqs, eqd }) === "zenith", "heavy flying => zenith");
  checks++;
}

// 5) sanity on reference data
assert(AIRPORTS.length >= 20, "airport set");
assert(TIERS.length === 4, "four tiers");
for (let i = 1; i < TIERS.length; i++) assert(TIERS[i].reqEqm > TIERS[i - 1].reqEqm, "tier thresholds ascend");
checks++;

// 6) render the whole app at every route
for (const path of ["/", "/dashboard", "/earn", "/redeem", "/status", "/activity", "/join", "/nope"]) {
  const html = renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
  assert(html.length > 200, `render route ${path} (${html.length} chars)`);
  checks++;
}

console.log(
  `SMOKE OK — ${checks} check groups passed · ${SEED_ACTIVITY.length} seed entries · balance ${balanceFrom(
    SEED_ACTIVITY
  ).toLocaleString()} mi`
);
