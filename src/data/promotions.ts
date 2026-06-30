import type { Promotion } from "../types";

// Live program promotions shown on the dashboard and earn page. Dates are
// anchored around the demo's "today" (2026-06-30).
export const PROMOTIONS: Promotion[] = [
  {
    id: "summer-double-eqm",
    title: "Summer Status Sprint",
    blurb: "Register and earn double elite-qualifying miles on every flight through the season — close the gap to your next tier twice as fast.",
    reward: "Double EQM",
    endsISO: "2026-08-31T23:59:00",
    icon: "Rocket",
    accent: "from-aero-500 to-aero-700",
  },
  {
    id: "partner-bonus",
    title: "Lumen Hotels bonus",
    blurb: "Earn 1,500 bonus miles on top of your normal earning for each completed Lumen Hotels stay this quarter.",
    reward: "+1,500 / stay",
    endsISO: "2026-09-30T23:59:00",
    icon: "BedDouble",
    accent: "from-gold-300 to-gold-500",
  },
  {
    id: "card-welcome",
    title: "Summit Card welcome offer",
    blurb: "Approved members earn 60,000 bonus miles after qualifying spend in the first three months — enough for a round-trip award.",
    reward: "+60,000 miles",
    endsISO: "2026-12-31T23:59:00",
    icon: "CreditCard",
    accent: "from-ink-700 to-ink-950",
  },
];
