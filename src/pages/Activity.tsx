import { useMemo, useState } from "react";
import { useAccount, accountStore } from "../lib/store";
import { milesSummary } from "../lib/status";
import { num, money } from "../lib/format";
import { ActivityList } from "../components/member/ActivityList";
import { Icon } from "../components/ui/Icon";
import type { Activity as ActivityT } from "../types";

type FilterId = "all" | "flight" | "partner" | "earned" | "redeemed";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "earned", label: "Earned" },
  { id: "redeemed", label: "Redeemed" },
  { id: "flight", label: "Flights" },
  { id: "partner", label: "Partners" },
];

function matches(a: ActivityT, f: FilterId): boolean {
  switch (f) {
    case "all":
      return true;
    case "earned":
      return a.miles > 0;
    case "redeemed":
      return a.miles < 0;
    case "flight":
      return a.kind === "flight";
    case "partner":
      return a.kind === "partner";
  }
}

function exportCsv(items: ActivityT[]): string {
  const head = ["date", "kind", "description", "miles", "eqm", "eqs", "eqd", "from", "to", "cashUsd"];
  const rows = items.map((a) =>
    [a.date, a.kind, a.description, a.miles, a.eqm ?? "", a.eqs ?? "", a.eqd ?? "", a.fromCode ?? "", a.toCode ?? "", a.cashUsd ?? ""]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [head.join(","), ...rows].join("\n");
}

export default function Activity() {
  const { member, activity } = useAccount();
  const summary = milesSummary(activity);
  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activity.filter((a) => matches(a, filter) && (!q || a.description.toLowerCase().includes(q)));
  }, [activity, filter, query]);

  function download() {
    const blob = new Blob([exportCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `airloy-activity-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function reset() {
    if (confirm("Reset this demo account to its seeded activity?")) accountStore.reset();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Activity</h1>
          <p className="mt-1 text-sm text-ink-500">
            {member.firstName}'s full statement · {num(summary.balance)} miles · ≈ {money(summary.valueUsd)}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={download} className="btn-ghost">
            <Icon name="Download" className="h-4 w-4" /> CSV
          </button>
          <button onClick={reset} className="btn-ghost text-ink-500">
            <Icon name="RefreshCw" className="h-4 w-4" /> Reset demo
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
                filter === f.id ? "bg-aero-600 text-white shadow-soft" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-ink-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:w-64">
          <Icon name="Search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search activity"
            className="input pl-9 py-2.5"
          />
        </div>
      </div>

      <div className="mt-4 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
          <span>{filtered.length} entries</span>
          <span>Miles</span>
        </div>
        <ActivityList items={filtered} empty="No matching activity." />
      </div>
    </div>
  );
}
