import type { Promotion } from "../../types";
import { Icon } from "../ui/Icon";
import { longDate } from "../../lib/format";

export function PromoCard({ promo }: { promo: Promotion }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-ink-950 p-5 text-white shadow-card">
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${promo.accent} opacity-30 blur-2xl transition group-hover:opacity-50`} />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${promo.accent} text-white`}>
            <Icon name={promo.icon} className="h-5 w-5" />
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold ring-1 ring-white/15">{promo.reward}</span>
        </div>
        <h3 className="mt-3 text-base font-bold">{promo.title}</h3>
        <p className="mt-1 text-sm text-white/70">{promo.blurb}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-white/55">
          <Icon name="Clock" className="h-3.5 w-3.5" />
          Ends {longDate(promo.endsISO)}
        </div>
      </div>
    </div>
  );
}
