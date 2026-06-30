import type { Partner, PartnerCategory } from "../../types";
import { PARTNERS } from "../../data/partners";
import { Icon } from "../ui/Icon";

const CAT_ICON: Record<PartnerCategory, string> = {
  hotel: "BedDouble",
  car: "Car",
  dining: "UtensilsCrossed",
  card: "CreditCard",
  shopping: "Tag",
  transfer: "Repeat",
};

const CAT_LABEL: Record<PartnerCategory, string> = {
  hotel: "Hotels",
  car: "Car rental",
  dining: "Dining",
  card: "Co-brand card",
  shopping: "Shopping",
  transfer: "Transfer partner",
};

function PartnerTile({ p }: { p: Partner }) {
  return (
    <div className="group card overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${p.accent} text-white`}>
          <Icon name={CAT_ICON[p.category]} className="h-6 w-6" />
        </span>
        <span className="rounded-full bg-aero-50 px-2.5 py-1 text-xs font-bold text-aero-700">{p.rate}</span>
      </div>
      <h3 className="mt-3 text-base font-bold text-ink-900">{p.name}</h3>
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{CAT_LABEL[p.category]}</div>
      <p className="mt-2 text-sm text-ink-500">{p.blurb}</p>
    </div>
  );
}

export function PartnerGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PARTNERS.map((p) => (
        <PartnerTile key={p.id} p={p} />
      ))}
    </div>
  );
}
