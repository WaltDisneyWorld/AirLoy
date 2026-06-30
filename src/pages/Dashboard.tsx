import { Link } from "react-router-dom";
import { useAccount } from "../lib/store";
import { TIER_BY_ID } from "../data/tiers";
import { PROMOTIONS } from "../data/promotions";
import { milesSummary, tierStanding, lifetimeMiles, CENT_PER_MILE } from "../lib/status";
import { money, num, longDate, compact } from "../lib/format";
import { MemberCard } from "../components/ui/MemberCard";
import { StatusTracker } from "../components/member/StatusTracker";
import { ActivityList } from "../components/member/ActivityList";
import { PromoCard } from "../components/member/PromoStrip";
import { Stat } from "../components/ui/Stat";
import { Icon } from "../components/ui/Icon";
import { Sparkline } from "../components/ui/Sparkline";
import { Reveal } from "../components/ui/Reveal";

const QUICK = [
  { to: "/redeem", label: "Book an award", icon: "Ticket", desc: "Search award flights" },
  { to: "/earn", label: "Earn miles", icon: "Plane", desc: "Calculate a trip" },
  { to: "/status", label: "Your status", icon: "Trophy", desc: "Benefits & tiers" },
  { to: "/activity", label: "Activity", icon: "BarChart3", desc: "Full statement" },
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Dashboard() {
  const { member, activity } = useAccount();
  const tier = TIER_BY_ID[member.tierId];
  const summary = milesSummary(activity);
  const standing = tierStanding(member, activity);
  const lifetime = lifetimeMiles(member, activity);

  // Earned miles per month across the current program year for the sparkline.
  const year = new Date(summary.lastActivityISO).getFullYear();
  const byMonth = new Array(6).fill(0);
  const startMonth = 0;
  for (const a of activity) {
    const d = new Date(a.date);
    if (d.getFullYear() === year && a.miles > 0) {
      const m = d.getMonth();
      if (m >= startMonth && m < startMonth + 6) byMonth[m - startMonth] += a.miles;
    }
  }

  const recent = activity.slice(0, 6);
  const expirySoon = summary.daysToExpiry < 180;

  return (
    <div className="bg-ink-50">
      {/* Greeting */}
      <section className="border-b border-ink-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-aero-600">Welcome back</p>
              <h1 className="mt-0.5 text-3xl font-extrabold tracking-tight text-ink-900">
                {member.firstName} {member.lastName}
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                {tier.name} member · {member.id} · {num(lifetime)} lifetime miles
              </p>
            </div>
            <Link to="/redeem" className="btn-primary">
              <Icon name="Ticket" className="h-4 w-4" /> Book an award
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Left rail: card + summary */}
          <div className="space-y-6">
            <Reveal>
              <MemberCard member={member} tier={tier} balance={summary.balance} />
            </Reveal>

            <div className="card p-5">
              <div className="flex items-baseline justify-between">
                <span className="label mb-0">Miles balance</span>
                <span className="text-xs text-ink-400">≈ {money(summary.valueUsd)} value</span>
              </div>
              <div className="mt-1 text-4xl font-extrabold tracking-tight text-ink-900 tnum">
                {num(summary.balance)}
              </div>
              <div className="mt-3 h-14">
                <Sparkline points={byMonth} width={300} height={56} className="h-14 w-full" />
              </div>
              <div className="mt-1 flex justify-between text-[11px] text-ink-400">
                {MONTHS_SHORT.slice(0, 6).map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>

            {/* Expiry notice */}
            <div className={`rounded-2xl p-4 ring-1 ${expirySoon ? "bg-gold-50 ring-gold-200" : "bg-white ring-ink-100"}`}>
              <div className="flex items-start gap-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${expirySoon ? "bg-gold-100 text-gold-700" : "bg-emerald-100 text-emerald-700"}`}>
                  <Icon name={expirySoon ? "Timer" : "ShieldCheck"} className="h-5 w-5" />
                </span>
                <div className="text-sm">
                  <div className="font-semibold text-ink-900">
                    {expirySoon ? "Keep your miles active" : "Your miles are safe"}
                  </div>
                  <div className="mt-0.5 text-ink-500">
                    Balance expires {longDate(summary.expiresISO)} ({num(summary.daysToExpiry)} days). Any earn
                    or redemption resets the clock 18 months.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="Balance" value={compact(summary.balance)} sub="redeemable miles" icon="Coins" />
              <Stat label="Earned YTD" value={compact(summary.earnedYtd)} sub={`${year} program year`} icon="TrendingUp" accent="text-emerald-600" />
              <Stat label="Redeemed YTD" value={compact(summary.redeemedYtd)} sub="put to good use" icon="Ticket" accent="text-aero-600" />
              <Stat label="Mile value" value={`${CENT_PER_MILE}¢`} sub="blended redemption" icon="CircleDollarSign" accent="text-gold-600" />
            </div>

            <StatusTracker standing={standing} />

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {QUICK.map((q) => (
                <Link
                  key={q.to}
                  to={q.to}
                  className="group card p-4 transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-aero-50 text-aero-600 transition group-hover:bg-aero-600 group-hover:text-white">
                    <Icon name={q.icon} className="h-5 w-5" />
                  </span>
                  <div className="mt-3 text-sm font-bold text-ink-900">{q.label}</div>
                  <div className="text-xs text-ink-500">{q.desc}</div>
                </Link>
              ))}
            </div>

            {/* Recent activity */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                <h2 className="font-bold text-ink-900">Recent activity</h2>
                <Link to="/activity" className="inline-flex items-center gap-1 text-sm font-semibold text-aero-700 hover:text-aero-800">
                  View all <Icon name="ChevronRight" className="h-4 w-4" />
                </Link>
              </div>
              <ActivityList items={recent} />
            </div>
          </div>
        </div>

        {/* Promotions */}
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-ink-900">Offers for you</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PROMOTIONS.map((p) => (
              <PromoCard key={p.id} promo={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
