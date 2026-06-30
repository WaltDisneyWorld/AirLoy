import { AIRPORT_BY_CODE } from "../data/airports";
import type { Zone } from "../types";

const R_MILES = 3958.8;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great-circle distance in statute miles between two lat/lng points. */
export function haversineMiles(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R_MILES * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Flown miles between two airport codes (0 if either is unknown). */
export function routeMiles(fromCode: string, toCode: string): number {
  const a = AIRPORT_BY_CODE[fromCode];
  const b = AIRPORT_BY_CODE[toCode];
  if (!a || !b) return 0;
  return Math.round(haversineMiles(a.lat, a.lng, b.lat, b.lng));
}

/** Map a distance to an award-chart zone. */
export function zoneForMiles(miles: number): Zone {
  if (miles <= 1100) return "short";
  if (miles <= 3000) return "medium";
  if (miles <= 6500) return "long";
  return "ultra";
}

export const ZONE_LABEL: Record<Zone, string> = {
  short: "Short-haul",
  medium: "Medium-haul",
  long: "Long-haul",
  ultra: "Ultra-long-haul",
};
