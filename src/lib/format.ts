/** The program's reference "today" — the demo is deterministic around it. */
export const TODAY = new Date("2026-06-30T12:00:00");

export function money(n: number, opts: { cents?: boolean } = {}): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: opts.cents ? 2 : 0,
    maximumFractionDigits: opts.cents ? 2 : 0,
  }).format(n);
}

export function num(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(n));
}

/** "12,500 miles" / "1 mile". */
export function miles(n: number): string {
  const r = Math.round(n);
  return `${num(r)} ${Math.abs(r) === 1 ? "mile" : "miles"}`;
}

/** Compact form for big balances on tight chrome: "1.2M", "84.0k". */
export function compact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 10_000) return `${Math.round(n / 1000)}k`;
  return num(n);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Jun 30" */
export function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** "Jun 30, 2026" */
export function longDate(iso: string): string {
  const d = new Date(iso);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "Mon" */
export function weekday(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}

export function relativeTime(iso: string, now: Date = TODAY): string {
  const diff = now.getTime() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}

/** Whole days between two ISO dates (b − a), rounded. */
export function daysBetween(aISO: string, bISO: string): number {
  return Math.round((new Date(bISO).getTime() - new Date(aISO).getTime()) / 86_400_000);
}

/** Add `n` whole months to an ISO date, returning a new ISO string. */
export function addMonths(iso: string, n: number): string {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + n);
  return d.toISOString();
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

/** Round to a "nice" number of miles (nearest 100 below 10k, else nearest 500). */
export function roundMiles(n: number): number {
  if (n < 10_000) return Math.round(n / 100) * 100;
  return Math.round(n / 500) * 500;
}
