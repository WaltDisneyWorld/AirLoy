import { useAccount } from "../lib/store";
import { TIERS, TIER_BY_ID } from "../data/tiers";
import { tierStanding, lifetimeMiles } from "../lib/status";
import { num } from "../lib/format";
import { StatusTracker } from "../components/member/StatusTracker";
import { TierBadge, TIER_ICON } from "../components/ui/TierBadge";
import { Icon } from "../components/ui/Icon";
import { Bar } from "../components/ui/Meter";
import { Reveal } from "../components/ui/Reveal";
import type { Tier } from "../types";

// Lifetime / "million miler" milestones.
const LIFETIME_TIERS = [
  { miles: 1_000_000, name: "Lifetime Zenith", tier: "zenith" as const },
  { miles: 500_000, name: "Lifetime Aurora", tier: "aurora" as const },
  { miles: 250_000, name: "Lifetime Cirrus", tier: "cirrus" as const },
];

function BenefitCell({ value }: { value: React.ReactNode }) {
  return <td className="px-4 py-3 text-center text-sm text-ink-700">{value}</td>;
}

const yes = <Icon name="Check" className="mx-auto h-4 w-4 text-emerald-600" />;
const no = <Icon name="Minus" className="mx-auto h-4 w-4 text-ink-300" />;

const ROWS: { label: string; render: (t: Tier) => React.ReactNode }[] = [
  { label: "Bonus redeemable miles", render: (t) => (t.perks.earnBonus ? `+${Math.round(t.perks.earnBonus * 100)}%` : no) },
  { label: "Free checked bags", render: (t) => (t.perks.checkedBags ? t.perks.checkedBags : no) },
  { label: "Boarding group", render: (t) => `Group ${t.perks.boardingGroup}` },
  { label: "Complimentary upgrades", render: (t) => (t.perks.upgradePriority ? ["—", "Space-available", "Priority", "Top priority"][t.perks.upgradePriority] : no) },
  { label: "Upgrade certificates / yr", render: (t) => (t.perks.upgradeCerts ? t.perks.upgradeCerts : no) },
  { label: "Lounge membership", render: (t) => (t.perks.loungeAccess ? yes : no) },
  { label: "Award & change fees waived", render: (t) => (t.perks.feeWaiver ? yes : no) },
];

export default function Status() {
  const { member, activity } = useAccount();
  const standing = tierStanding(member, activity);
  const lifetime = lifetimeMiles(member, activity);
  const current = TIER_BY_ID[member.tierId];

  const nextLifetime = [...LIFETIME_TIERS].reverse().find((l) => lifetime < l.miles);

  return (
    <div className="bg-ink-50">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100 bg-ink-950 text-white">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="absolute inset-0 bg-noise opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-aero-200">
            <Icon name="Trophy" className="h-4 w-4" /> Status & tiers
          </div>
          <h1 className="mt-2 max-w-2xl text-4xl font-extrabold tracking-tight">
            You hold <span className="text-aero-300">{current.name}</span> status
          </h1>
          <p className="mt-2 max-w-xl text-white/70">
            Earn elite-qualifying miles, segments, and dollars when you fly. Reach a tier and
            you keep its benefits for the rest of this year and all of next.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6">
        <StatusTracker standing={standing} />

        {/* Tier ladder */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-ink-900">The status ladder</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TIERS.map((t, i) => {
              const held = t.id === current.id;
              return (
                <Reveal key={t.id} delay={i * 60}>
                  <div className={`relative h-full overflow-hidden rounded-2xl bg-white p-5 shadow-card ring-1 ${held ? "ring-2 ring-aero-400" : "ring-ink-100"}`}>
                    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${t.accent} opacity-20 blur-xl`} />
                    <div className="relative flex items-center justify-between">
                      <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${t.accent} text-white`}>
                        <Icon name={TIER_ICON[t.id]} className="h-5 w-5" />
                      </span>
                      {held && <span className="chip bg-aero-50 text-aero-700">Your tier</span>}
                    </div>
                    <h3 className="mt-3 text-lg font-extrabold text-ink-900">{t.name}</h3>
                    <p className="text-xs text-ink-500">{t.tagline}</p>
                    <div className="mt-3 rounded-xl bg-ink-50 p-3 text-sm">
                      {t.rank === 0 ? (
                        <span className="font-semibold text-ink-700">Free to join</span>
                      ) : (
                        <>
                          <div className="font-bold text-ink-900 tnum">{num(t.reqEqm)} miles</div>
                          <div className="text-xs text-ink-500 tnum">or {t.reqEqs} segments · + ${num(t.reqEqd)} spend</div>
                        </>
                      )}
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {t.benefits.slice(0, 4).map((b) => (
                        <li key={b} className="flex gap-2 text-sm text-ink-600">
                          <Icon name="Check" className="mt-0.5 h-4 w-4 shrink-0 text-aero-500" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Benefits comparison */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-ink-900">Compare benefits</h2>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">Benefit</th>
                  {TIERS.map((t) => (
                    <th key={t.id} className="px-4 py-3 text-center">
                      <div className="flex justify-center"><TierBadge tier={t} size="sm" /></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3 text-sm font-semibold text-ink-700">{row.label}</td>
                    {TIERS.map((t) => (
                      <BenefitCell key={t.id} value={row.render(t)} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Lifetime track */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-ink-900">Lifetime miles</h2>
          <div className="card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <div className="text-3xl font-extrabold tracking-tight text-ink-900 tnum">{num(lifetime)}</div>
                <div className="text-sm text-ink-500">lifetime qualifying miles flown</div>
              </div>
              {nextLifetime && (
                <div className="text-right text-sm text-ink-500">
                  <span className="font-bold text-ink-900 tnum">{num(nextLifetime.miles - lifetime)}</span> to{" "}
                  {nextLifetime.name}
                </div>
              )}
            </div>
            {nextLifetime && (
              <div className="mt-4">
                <Bar value={lifetime / nextLifetime.miles} fillClass="bg-gradient-to-r from-gold-300 to-gold-500" />
              </div>
            )}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {LIFETIME_TIERS.slice().reverse().map((l) => {
                const reached = lifetime >= l.miles;
                return (
                  <div key={l.name} className={`flex items-center gap-3 rounded-xl p-3 ring-1 ${reached ? "bg-emerald-50 ring-emerald-200" : "bg-ink-50 ring-ink-100"}`}>
                    <Icon name={reached ? "BadgeCheck" : "Lock"} className={`h-5 w-5 ${reached ? "text-emerald-600" : "text-ink-400"}`} />
                    <div>
                      <div className="text-sm font-bold text-ink-900">{l.name}</div>
                      <div className="text-xs text-ink-500 tnum">{num(l.miles)} miles</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
