import type { Tier, TierId } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// The status ladder. A member earns a tier in a program year by clearing its
// qualifying thresholds — reach the *miles* OR the *segments* bar, and the
// *dollars* bar — then holds that published status for the following year.
//
// Thresholds and earn bonuses are original to AirLoy but sit in the realistic
// range of major frequent-flyer programs.
// ─────────────────────────────────────────────────────────────────────────────

export const TIERS: Tier[] = [
  {
    id: "horizon",
    rank: 0,
    name: "Horizon",
    short: "HZN",
    tagline: "Where every journey begins.",
    reqEqm: 0,
    reqEqs: 0,
    reqEqd: 0,
    perks: {
      earnBonus: 0,
      checkedBags: 0,
      boardingGroup: 5,
      upgradePriority: 0,
      loungeAccess: false,
      feeWaiver: false,
      upgradeCerts: 0,
    },
    benefits: [
      "Earn redeemable miles on every AirLoy and partner flight",
      "Miles never expire while your account stays active",
      "Member fares and award redemptions",
      "Standard boarding (Group 5)",
    ],
    accent: "from-ink-400 to-ink-600",
    ring: "ring-ink-200",
    text: "text-ink-600",
  },
  {
    id: "cirrus",
    rank: 1,
    name: "Cirrus",
    short: "CRS",
    tagline: "The first taste of elite travel.",
    reqEqm: 25_000,
    reqEqs: 30,
    reqEqd: 3_000,
    perks: {
      earnBonus: 0.25,
      checkedBags: 1,
      boardingGroup: 3,
      upgradePriority: 1,
      loungeAccess: false,
      feeWaiver: false,
      upgradeCerts: 0,
    },
    benefits: [
      "+25% bonus redeemable miles on flights",
      "1 free checked bag",
      "Priority boarding (Group 3)",
      "Complimentary upgrades on a space-available basis",
      "Preferred seat selection at booking",
    ],
    accent: "from-aero-300 to-aero-500",
    ring: "ring-aero-200",
    text: "text-aero-700",
  },
  {
    id: "aurora",
    rank: 2,
    name: "Aurora",
    short: "AUR",
    tagline: "Travel that takes care of itself.",
    reqEqm: 50_000,
    reqEqs: 60,
    reqEqd: 6_000,
    perks: {
      earnBonus: 0.6,
      checkedBags: 2,
      boardingGroup: 2,
      upgradePriority: 2,
      loungeAccess: false,
      feeWaiver: true,
      upgradeCerts: 2,
    },
    benefits: [
      "+60% bonus redeemable miles on flights",
      "2 free checked bags",
      "Priority boarding (Group 2), security & check-in",
      "Higher complimentary-upgrade priority",
      "2 confirmable upgrade certificates each year",
      "Award change & redeposit fees waived",
    ],
    accent: "from-aero-500 to-aero-700",
    ring: "ring-aero-300",
    text: "text-aero-800",
  },
  {
    id: "zenith",
    rank: 3,
    name: "Zenith",
    short: "ZEN",
    tagline: "The summit of the program.",
    reqEqm: 100_000,
    reqEqs: 100,
    reqEqd: 12_000,
    perks: {
      earnBonus: 1.0,
      checkedBags: 3,
      boardingGroup: 1,
      upgradePriority: 3,
      loungeAccess: true,
      feeWaiver: true,
      upgradeCerts: 6,
    },
    benefits: [
      "+100% bonus redeemable miles — earn double on every flight",
      "3 free checked bags",
      "First to board (Group 1) and top upgrade priority",
      "Lounge membership for you and a guest",
      "6 confirmable upgrade certificates each year",
      "All award & ticketing fees waived",
      "Dedicated Zenith service line",
    ],
    accent: "from-gold-300 to-gold-500",
    ring: "ring-gold-300",
    text: "text-gold-700",
  },
];

export const TIER_BY_ID: Record<TierId, Tier> = Object.fromEntries(
  TIERS.map((t) => [t.id, t])
) as Record<TierId, Tier>;

export const TIER_ORDER: TierId[] = TIERS.map((t) => t.id);

export function tier(id: TierId): Tier {
  return TIER_BY_ID[id];
}

/** The tier directly above `id`, or undefined at the top. */
export function nextTier(id: TierId): Tier | undefined {
  const t = TIER_BY_ID[id];
  return TIERS.find((x) => x.rank === t.rank + 1);
}
