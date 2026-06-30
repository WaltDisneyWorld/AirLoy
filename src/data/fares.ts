import type { FareProduct, CabinId } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Fare products a member can buy. Earn rates follow the familiar shape of a
// distance-based program: the cheaper the fare, the fewer redeemable miles per
// mile flown; premium cabins earn a multiple and a richer elite-qualifying rate.
//
//   redeemable miles = distance × earnRate × (1 + tier earn bonus)   [+ floor]
//   qualifying miles  = distance × eqmRate                            (no bonus)
//   qualifying dollars ≈ distance × revenuePerMile                    (fare spend)
// ─────────────────────────────────────────────────────────────────────────────

export const FARE_PRODUCTS: FareProduct[] = [
  {
    id: "basic",
    name: "Basic Economy",
    cabin: "economy",
    earnRate: 0.5,
    eqmRate: 0.5,
    revenuePerMile: 0.09,
    note: "Lowest fare · earns half-rate · no changes",
  },
  {
    id: "main",
    name: "Main Economy",
    cabin: "economy",
    earnRate: 1.0,
    eqmRate: 1.0,
    revenuePerMile: 0.13,
    note: "Standard economy · full mileage earning",
  },
  {
    id: "flex",
    name: "Economy Flex",
    cabin: "economy",
    earnRate: 1.5,
    eqmRate: 1.0,
    revenuePerMile: 0.2,
    note: "Refundable economy · bonus redeemable miles",
  },
  {
    id: "premium",
    name: "Premium Cabin",
    cabin: "premium",
    earnRate: 1.5,
    eqmRate: 1.25,
    revenuePerMile: 0.26,
    note: "Premium economy · extra space and earning",
  },
  {
    id: "business",
    name: "Business",
    cabin: "business",
    earnRate: 2.0,
    eqmRate: 1.5,
    revenuePerMile: 0.42,
    note: "Lie-flat business class",
  },
  {
    id: "first",
    name: "First",
    cabin: "first",
    earnRate: 3.0,
    eqmRate: 2.0,
    revenuePerMile: 0.7,
    note: "Flagship first class",
  },
];

export const FARE_BY_ID: Record<string, FareProduct> = Object.fromEntries(
  FARE_PRODUCTS.map((f) => [f.id, f])
);

export const CABIN_LABEL: Record<CabinId, string> = {
  economy: "Economy",
  premium: "Premium",
  business: "Business",
  first: "First",
};

/** Minimum redeemable miles credited per flown segment, regardless of distance. */
export const MIN_SEGMENT_MILES = 500;
