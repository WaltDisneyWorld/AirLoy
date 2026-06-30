import type { Activity, ActivityKind } from "../../types";
import { Icon } from "../ui/Icon";
import { num, shortDate } from "../../lib/format";
import { FARE_BY_ID } from "../../data/fares";

const KIND_META: Record<ActivityKind, { icon: string; label: string; cls: string }> = {
  flight: { icon: "Plane", label: "Flight", cls: "bg-aero-100 text-aero-700" },
  partner: { icon: "Tag", label: "Partner", cls: "bg-violet-100 text-violet-700" },
  bonus: { icon: "Gift", label: "Bonus", cls: "bg-gold-100 text-gold-800" },
  enrollment: { icon: "BadgeCheck", label: "Welcome", cls: "bg-emerald-100 text-emerald-700" },
  award: { icon: "Ticket", label: "Award flight", cls: "bg-ink-100 text-ink-700" },
  upgrade: { icon: "ArrowUpCircle", label: "Upgrade", cls: "bg-ink-100 text-ink-700" },
  "partner-redeem": { icon: "Gift", label: "Reward", cls: "bg-ink-100 text-ink-700" },
  expiry: { icon: "Timer", label: "Expired", cls: "bg-red-100 text-red-700" },
};

function subtitle(a: Activity): string {
  const parts: string[] = [];
  if (a.kind === "flight" && a.fareProductId) {
    const f = FARE_BY_ID[a.fareProductId];
    if (f) parts.push(f.name);
    if (a.eqm) parts.push(`+${num(a.eqm)} EQM`);
  }
  if (a.cashUsd != null && a.cashUsd > 0) {
    parts.push(a.miles < 0 ? `+$${a.cashUsd.toFixed(2)} taxes/fees` : `$${num(a.cashUsd)} spend`);
  }
  return parts.join(" · ");
}

export function ActivityRow({ a }: { a: Activity }) {
  const m = KIND_META[a.kind];
  const earned = a.miles >= 0;
  const sub = subtitle(a);
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-ink-50/60">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${m.cls}`}>
        <Icon name={m.icon} className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-ink-900">{a.description}</div>
        <div className="truncate text-xs text-ink-500">
          {m.label} · {shortDate(a.date)} {new Date(a.date).getFullYear()}
          {sub && <span> · {sub}</span>}
        </div>
      </div>
      <div className={`shrink-0 text-right text-sm font-bold tnum ${earned ? "text-emerald-600" : "text-ink-500"}`}>
        {earned ? "+" : "−"}
        {num(Math.abs(a.miles))}
      </div>
    </div>
  );
}

export function ActivityList({ items, empty = "No activity yet." }: { items: Activity[]; empty?: string }) {
  if (!items.length) {
    return <div className="px-4 py-10 text-center text-sm text-ink-400">{empty}</div>;
  }
  return (
    <div className="divide-y divide-ink-100">
      {items.map((a) => (
        <ActivityRow key={a.id} a={a} />
      ))}
    </div>
  );
}
