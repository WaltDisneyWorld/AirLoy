import { Link } from "react-router-dom";
import { Icon } from "../components/ui/Icon";
import { CountUp } from "../components/ui/CountUp";
import { Reveal } from "../components/ui/Reveal";
import { TierBadge, TIER_ICON } from "../components/ui/TierBadge";
import { TIERS } from "../data/tiers";
import { PARTNERS } from "../data/partners";
import { num } from "../lib/format";

const PILLARS = [
  {
    icon: "Plane",
    title: "Earn everywhere",
    body: "Miles on every flight — base, fare, and a status bonus up to 2× — plus hotels, cars, dining, shopping and the co-brand card.",
    to: "/earn",
    cta: "How earning works",
  },
  {
    icon: "Trophy",
    title: "Climb the tiers",
    body: "Four status tiers, earned by miles, segments and spend. Reach one and keep its benefits all of this year and next.",
    to: "/status",
    cta: "See status & benefits",
  },
  {
    icon: "Ticket",
    title: "Fly on miles",
    body: "Dynamic award pricing with a transparent saver chart, a price calendar, upgrades and partner rewards.",
    to: "/redeem",
    cta: "Search award flights",
  },
];

const STATS: { to: number; decimals?: number; suffix?: string; label: string }[] = [
  { to: 7.4, decimals: 1, suffix: "M+", label: "members" },
  { to: 36, label: "destinations" },
  { to: 6, label: "earning partners" },
  { to: 1.4, decimals: 1, suffix: "B", label: "miles redeemed" },
];

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-aurora opacity-80" />
        <div className="absolute inset-0 bg-grid-faint [background-size:40px_40px] opacity-40" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-aero-500/20 blur-3xl animate-drift" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-gold-400/15 blur-3xl animate-drift-slow" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-aero-200 ring-1 ring-white/15">
              <Icon name="Sparkles" className="h-3.5 w-3.5" /> The AirLoy frequent-flyer program
            </span>
            <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Miles that take you <span className="text-gradient">further</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/70">
              Earn on every flight and across the partner coalition, rise through four status
              tiers, and redeem for award travel — all in one beautifully clear program.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/join" className="btn-gold px-6 py-3 text-base">
                Join free <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
              <Link to="/dashboard" className="btn px-6 py-3 text-base bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15">
                Explore the dashboard
              </Link>
            </div>
            <div className="mt-10 grid max-w-lg grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold tracking-tight">
                    <CountUp to={s.to} decimals={s.decimals ?? 0} suffix={s.suffix ?? ""} />
                  </div>
                  <div className="text-xs text-white/55">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating tier showcase */}
          <Reveal className="relative hidden lg:block" y={40}>
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-aero-500/30 to-gold-400/20 blur-2xl" />
              <div className="relative space-y-3">
                {TIERS.slice().reverse().map((t, i) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur animate-float"
                    style={{ animationDelay: `${i * 0.4}s`, marginLeft: `${i * 14}px` }}
                  >
                    <span className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${t.accent} text-white`}>
                      <Icon name={TIER_ICON[t.id]} className="h-5 w-5" />
                    </span>
                    <div className="flex-1">
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-white/55">
                        {t.rank === 0 ? "Free to join" : `${num(t.reqEqm)} qualifying miles`}
                      </div>
                    </div>
                    {t.perks.earnBonus > 0 && (
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-bold text-gold-300">
                        +{Math.round(t.perks.earnBonus * 100)}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">One program, three ways to win</h2>
          <p className="mt-3 text-ink-500">Earn, climb, redeem — each as transparent as the last.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="group flex h-full flex-col rounded-2xl bg-white p-7 shadow-card ring-1 ring-ink-100 transition hover:-translate-y-1 hover:shadow-lift">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-aero-50 text-aero-600 transition group-hover:bg-aero-600 group-hover:text-white">
                  <Icon name={p.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink-900">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm text-ink-500">{p.body}</p>
                <Link to={p.to} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-aero-700 hover:gap-2">
                  {p.cta} <Icon name="ArrowRight" className="h-4 w-4 transition-all" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tier band */}
      <section className="bg-ink-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">Status worth chasing</h2>
              <p className="mt-2 max-w-xl text-ink-500">Bigger earn bonuses, free bags, upgrades, lounges and waived fees as you rise.</p>
            </div>
            <Link to="/status" className="btn-ghost">Compare all benefits <Icon name="ArrowRight" className="h-4 w-4" /></Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {TIERS.map((t, i) => (
              <Reveal key={t.id} delay={i * 60}>
                <div className="h-full rounded-2xl bg-white p-5 shadow-card ring-1 ring-ink-100">
                  <div className="flex items-center justify-between">
                    <TierBadge tier={t} />
                    {t.perks.earnBonus > 0 && (
                      <span className="text-sm font-extrabold text-gold-600">+{Math.round(t.perks.earnBonus * 100)}%</span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-ink-500">{t.tagline}</p>
                  <div className="mt-3 text-sm font-semibold text-ink-900 tnum">
                    {t.rank === 0 ? "Free to join" : `${num(t.reqEqm)} mi / yr`}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">Earn beyond the plane</h2>
          <p className="mt-3 text-ink-500">The AirLoy coalition adds miles to your balance on the ground, too.</p>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {PARTNERS.map((p) => (
            <span key={p.id} className="rounded-full bg-ink-50 px-4 py-2 text-sm font-semibold text-ink-600 ring-1 ring-ink-100">
              {p.name}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="absolute inset-0 bg-aurora opacity-60" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your next trip is worth more with AirLoy.</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">Join free in under a minute and start earning on your very next flight.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/join" className="btn-gold px-6 py-3 text-base">Join AirLoy free</Link>
            <Link to="/redeem" className="btn px-6 py-3 text-base bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15">See award prices</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
