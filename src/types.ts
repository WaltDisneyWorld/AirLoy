// ───────────────────────────────────────────────────────────────────────────
// AirLoy domain model
//
// A complete frequent-flyer program. The whole app derives from one source of
// truth: a member and their activity ledger. Everything else — the miles
// balance, elite-qualifying progress, published vs. projected tier, and the
// miles-expiry clock — is *computed* from that ledger, so an award booked in
// the Redeem flow instantly moves the balance, the status bars, and the
// expiry date everywhere at once.
// ───────────────────────────────────────────────────────────────────────────

/** The four published status tiers, entry → top. */
export type TierId = "horizon" | "cirrus" | "aurora" | "zenith";

/** Cabin of travel — used for award pricing and benefit display. */
export type CabinId = "economy" | "premium" | "business" | "first";

/** Distance bands an award route falls into (the award-chart zones). */
export type Zone = "short" | "medium" | "long" | "ultra";

/** Earning-partner categories. */
export type PartnerCategory = "hotel" | "car" | "dining" | "card" | "shopping" | "transfer";

// ── Tiers ────────────────────────────────────────────────────────────────────

export interface TierPerks {
  /** Bonus redeemable miles as a fraction of base flight earn (0.25 = +25%). */
  earnBonus: number;
  checkedBags: number;
  /** Boarding group number (1 = first). */
  boardingGroup: number;
  /** Complimentary same-day upgrade priority (higher = better), 0 = none. */
  upgradePriority: number;
  loungeAccess: boolean;
  /** Award change / redeposit fees waived. */
  feeWaiver: boolean;
  /** Annual complimentary upgrade certificates. */
  upgradeCerts: number;
}

export interface Tier {
  id: TierId;
  rank: number; // 0..3
  name: string;
  short: string;
  tagline: string;
  /** Elite-qualifying thresholds to earn this tier in a program year. */
  reqEqm: number; // qualifying miles
  reqEqs: number; // qualifying segments
  reqEqd: number; // qualifying dollars
  perks: TierPerks;
  /** Human-readable benefit lines shown on the status page. */
  benefits: string[];
  /** Tailwind color tokens for badges & plates. */
  accent: string;
  ring: string;
  text: string;
}

// ── Geography ──────────────────────────────────────────────────────────────

export interface Airport {
  code: string; // IATA
  city: string;
  country: string;
  name: string;
  lat: number;
  lng: number;
}

// ── Fares & earning ──────────────────────────────────────────────────────────

/** A purchasable fare product — what the member actually bought on a flight. */
export interface FareProduct {
  id: string; // "basic" | "main" | "flex" | "premium" | "business" | "first"
  name: string;
  cabin: CabinId;
  /** Redeemable-miles earn rate as a fraction of distance flown. */
  earnRate: number;
  /** Elite-qualifying-miles multiplier of distance flown. */
  eqmRate: number;
  /** Typical cents-per-mile of revenue for the EQD estimate on this fare. */
  revenuePerMile: number;
  note: string;
}

export interface Partner {
  id: string;
  name: string;
  category: PartnerCategory;
  /** Short earn-rate label, e.g. "3 miles / $1". */
  rate: string;
  /** Numeric miles earned per US dollar of qualifying spend. */
  milesPerDollar: number;
  /** Flat bonus miles on a qualifying event (per stay / rental), if any. */
  flatBonus: number;
  unit: string; // "night", "rental", "$ spent" …
  blurb: string;
  accent: string;
}

// ── Activity ledger ──────────────────────────────────────────────────────────

export type ActivityKind =
  | "flight" // miles earned from a flown segment
  | "partner" // miles earned from a partner
  | "bonus" // promotional bonus miles
  | "enrollment" // welcome bonus
  | "award" // redeemed for an award flight
  | "upgrade" // redeemed for a cabin upgrade
  | "partner-redeem" // redeemed for a partner reward / experience
  | "expiry"; // miles expired

export interface Activity {
  id: string;
  date: string; // ISO
  kind: ActivityKind;
  description: string;
  /** Signed miles delta: positive = earned, negative = redeemed/expired. */
  miles: number;
  // Elite-qualifying contributions (revenue activity only).
  eqm?: number;
  eqs?: number; // qualifying segments
  eqd?: number; // qualifying dollars
  // Flight context.
  fromCode?: string;
  toCode?: string;
  fareProductId?: string;
  cabin?: CabinId;
  // Partner context.
  partnerId?: string;
  /** Cash leg of the activity (USD): partner spend, or taxes/fees on a redemption. */
  cashUsd?: number;
  /** Seeded into the demo (vs. created live this session). */
  seed?: boolean;
}

// ── Member ─────────────────────────────────────────────────────────────────

export interface Member {
  id: string; // member number, e.g. "AL-4072 188"
  firstName: string;
  lastName: string;
  email: string;
  homeAirport: string;
  joinedISO: string;
  /** The status tier the member currently holds (earned last year / retained). */
  tierId: TierId;
  /** Lifetime miles flown — drives the "million miler" lifetime track. */
  lifetimeMiles: number;
  accent: string;
}

// ── Rewards catalog (non-flight redemptions) ──────────────────────────────────

export type RewardKind = "upgrade" | "partner-redeem";

export interface Reward {
  id: string;
  kind: RewardKind;
  name: string;
  partnerName: string;
  category: PartnerCategory | "cabin";
  miles: number;
  /** Optional cash co-pay (USD), e.g. on a mileage upgrade. */
  copayUsd?: number;
  blurb: string;
  icon: string;
  image: string; // gradient classes for the illustrative tile
  /** Approximate retail value (USD) for the cents-per-mile readout. */
  valueUsd: number;
}

// ── Promotions ───────────────────────────────────────────────────────────────

export interface Promotion {
  id: string;
  title: string;
  blurb: string;
  /** e.g. "Double EQM" or "+5,000 bonus miles". */
  reward: string;
  endsISO: string;
  icon: string;
  accent: string;
}

// ── Computed views (built in lib/, never stored) ─────────────────────────────

/** Where the member stands toward each tier this program year. */
export interface MetricProgress {
  eqm: number;
  eqs: number;
  eqd: number;
}

export interface TierStanding {
  /** Tier the member publishes today (held for the current year). */
  current: Tier;
  /** Tier their current-year qualification has reached (next year's status). */
  projected: Tier;
  /** Next tier above `projected`, if any. */
  next?: Tier;
  /** Current program-year qualifying totals. */
  ytd: MetricProgress;
  /** Remaining to reach `next` on each metric (0 once met). */
  toNext?: MetricProgress;
  /** 0..1 progress toward `next`, the closest (binding) metric. */
  progress: number;
  /** Which metric is closest to clearing the next tier. */
  bindingMetric: "eqm" | "eqs" | "eqd";
}

export interface MilesSummary {
  balance: number;
  /** Cash value of the balance at the program's blended cent-per-mile rate. */
  valueUsd: number;
  earnedYtd: number;
  redeemedYtd: number;
  /** Date the balance expires if no further activity (ISO). */
  expiresISO: string;
  /** Days until expiry from "today". */
  daysToExpiry: number;
  lastActivityISO: string;
}
