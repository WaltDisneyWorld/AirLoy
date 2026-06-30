import { useAccount } from "../lib/store";
import { EarnCalculator } from "../components/earn/EarnCalculator";
import { PartnerGrid } from "../components/earn/PartnerGrid";
import { Icon } from "../components/ui/Icon";
import { Reveal } from "../components/ui/Reveal";
import { FARE_PRODUCTS, MIN_SEGMENT_MILES } from "../data/fares";
import { num } from "../lib/format";

const STEPS = [
  { icon: "MapPin", title: "Distance flown", body: "Every mile between your origin and destination, great-circle." },
  { icon: "Ticket", title: "× fare product", body: "Cheaper fares earn a fraction; premium cabins earn a multiple." },
  { icon: "Star", title: "× status bonus", body: "Cirrus +25%, Aurora +60%, Zenith +100% on top of the base." },
  { icon: "Coins", title: "= miles credited", body: `Never less than ${MIN_SEGMENT_MILES} miles per flown segment.` },
];

export default function Earn() {
  const { member } = useAccount();

  return (
    <div className="bg-ink-50">
      <section className="border-b border-ink-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-aero-600">
            <Icon name="Plane" className="h-4 w-4" /> Earn miles
          </div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink-900">Every journey, more miles</h1>
          <p className="mt-2 max-w-2xl text-ink-500">
            Earn redeemable miles on flights and across the AirLoy partner coalition — and watch
            your status bonus multiply every base mile you fly.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6">
        {/* How earning works */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 70}>
                <div className="card h-full p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-aero-50 text-aero-600">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <div className="mt-3 text-sm font-bold text-ink-900">
                    {i + 1}. {s.title}
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Calculator */}
        <section>
          <EarnCalculator member={member} />
        </section>

        {/* Fare earn rates */}
        <section>
          <h2 className="mb-4 text-lg font-bold text-ink-900">Earn rates by fare</h2>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-ink-100 text-left text-xs font-semibold uppercase tracking-wide text-ink-400">
                  <th className="px-4 py-3">Fare product</th>
                  <th className="px-4 py-3">Cabin</th>
                  <th className="px-4 py-3 text-right">Redeemable</th>
                  <th className="px-4 py-3 text-right">Qualifying</th>
                  <th className="px-4 py-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {FARE_PRODUCTS.map((f) => (
                  <tr key={f.id} className="text-sm">
                    <td className="px-4 py-3 font-semibold text-ink-900">{f.name}</td>
                    <td className="px-4 py-3 capitalize text-ink-600">{f.cabin}</td>
                    <td className="px-4 py-3 text-right font-bold tnum text-aero-700">{f.earnRate}× mi</td>
                    <td className="px-4 py-3 text-right tnum text-ink-700">{f.eqmRate}× EQM</td>
                    <td className="px-4 py-3 text-ink-500">{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-400">
            Status bonuses apply to redeemable miles only — elite-qualifying miles always credit at the
            fare's base rate. Minimum {num(MIN_SEGMENT_MILES)} redeemable miles per flown segment.
          </p>
        </section>

        {/* Partners */}
        <section>
          <h2 className="mb-1 text-lg font-bold text-ink-900">Earn beyond the plane</h2>
          <p className="mb-4 text-sm text-ink-500">Hotels, cars, dining, shopping, and the co-brand card all add to your balance.</p>
          <PartnerGrid />
        </section>
      </div>
    </div>
  );
}
