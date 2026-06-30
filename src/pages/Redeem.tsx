import { useAccount } from "../lib/store";
import { balanceFrom, milesSummary } from "../lib/status";
import { SAVER_CHART } from "../lib/awards";
import { ZONE_LABEL } from "../lib/distance";
import { CABIN_LABEL } from "../data/fares";
import { num, money } from "../lib/format";
import { AwardSearch } from "../components/redeem/AwardSearch";
import { RewardsCatalog } from "../components/redeem/RewardsCatalog";
import { Icon } from "../components/ui/Icon";
import type { CabinId, Zone } from "../types";

const ZONES: Zone[] = ["short", "medium", "long", "ultra"];
const CABINS: CabinId[] = ["economy", "premium", "business", "first"];
const ZONE_RANGE: Record<Zone, string> = {
  short: "≤ 1,100 mi",
  medium: "1,100–3,000 mi",
  long: "3,000–6,500 mi",
  ultra: "6,500+ mi",
};

export default function Redeem() {
  const { activity } = useAccount();
  const balance = balanceFrom(activity);
  const summary = milesSummary(activity);

  return (
    <div className="bg-ink-50">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-ink-950 text-white">
        <div className="absolute inset-0 bg-aurora opacity-50" />
        <div className="absolute inset-0 bg-noise opacity-10" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-4 px-4 py-12 sm:px-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-aero-200">
              <Icon name="Ticket" className="h-4 w-4" /> Redeem
            </div>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Put your miles to work</h1>
            <p className="mt-2 max-w-xl text-white/70">
              Search award flights with dynamic pricing, or redeem for upgrades and partner rewards.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15 backdrop-blur">
            <div className="text-xs uppercase tracking-wide text-white/55">Available to spend</div>
            <div className="text-3xl font-extrabold tracking-tight tnum">{num(balance)}</div>
            <div className="text-xs text-white/60">miles · ≈ {money(summary.valueUsd)}</div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6">
        <section>
          <h2 className="mb-4 text-lg font-bold text-ink-900">Award flight search</h2>
          <AwardSearch />
        </section>

        <section>
          <h2 className="mb-1 text-lg font-bold text-ink-900">Rewards catalog</h2>
          <p className="mb-4 text-sm text-ink-500">Cabin upgrades and partner rewards at fixed mileage prices.</p>
          <RewardsCatalog />
        </section>

        {/* Award chart */}
        <section>
          <h2 className="mb-1 text-lg font-bold text-ink-900">The saver award chart</h2>
          <p className="mb-4 text-sm text-ink-500">
            One-way saver levels by distance. Live prices float up toward double these numbers with demand.
          </p>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <th className="px-4 py-3">Zone</th>
                  {CABINS.map((c) => (
                    <th key={c} className="px-4 py-3 text-right">{CABIN_LABEL[c]}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {ZONES.map((z) => (
                  <tr key={z} className="text-sm">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-ink-900">{ZONE_LABEL[z]}</div>
                      <div className="text-xs text-ink-400 tnum">{ZONE_RANGE[z]}</div>
                    </td>
                    {CABINS.map((c) => (
                      <td key={c} className="px-4 py-3 text-right font-semibold tnum text-ink-700">
                        {num(SAVER_CHART[z][c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-400">Prices shown one-way per person, plus taxes and carrier-imposed fees.</p>
        </section>
      </div>
    </div>
  );
}
