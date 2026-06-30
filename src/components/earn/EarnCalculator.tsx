import { useMemo, useState } from "react";
import { AIRPORTS } from "../../data/airports";
import { FARE_PRODUCTS, FARE_BY_ID } from "../../data/fares";
import { TIER_BY_ID, TIERS } from "../../data/tiers";
import { flightEarn, earnByTier } from "../../lib/earning";
import { ZONE_LABEL, zoneForMiles } from "../../lib/distance";
import { num } from "../../lib/format";
import { Icon } from "../ui/Icon";
import { Bar } from "../ui/Meter";
import { TierBadge } from "../ui/TierBadge";
import { accountStore } from "../../lib/store";
import { airportLabel } from "../../data/airports";
import type { Member } from "../../types";

function AirportSelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input appearance-none">
        {AIRPORTS.map((a) => (
          <option key={a.code} value={a.code}>
            {a.city} ({a.code})
          </option>
        ))}
      </select>
    </label>
  );
}

export function EarnCalculator({ member }: { member: Member }) {
  const [from, setFrom] = useState(member.homeAirport);
  const [to, setTo] = useState("LHR");
  const [fareId, setFareId] = useState("main");
  const [roundTrip, setRoundTrip] = useState(true);
  const [logged, setLogged] = useState(false);

  const tier = TIER_BY_ID[member.tierId];
  const legs = roundTrip ? 2 : 1;

  const earn = useMemo(() => flightEarn(from, to, fareId, member.tierId), [from, to, fareId, member.tierId]);
  const tierRows = useMemo(() => earnByTier(from, to, fareId), [from, to, fareId]);
  const maxRedeemable = Math.max(...tierRows.map((r) => r.redeemable), 1);
  const fare = FARE_BY_ID[fareId];
  const zone = zoneForMiles(earn.distance);

  const total = {
    redeemable: earn.redeemable * legs,
    eqm: earn.eqm * legs,
    eqs: earn.eqs * legs,
    eqd: earn.eqd * legs,
  };

  function logFlight() {
    const e = flightEarn(from, to, fareId, member.tierId);
    for (let i = 0; i < legs; i++) {
      const a = i === 0 ? from : to;
      const b = i === 0 ? to : from;
      accountStore.post({
        date: new Date().toISOString(),
        kind: "flight",
        description: `${airportLabel(a)} → ${airportLabel(b)}`,
        miles: e.redeemable,
        eqm: e.eqm,
        eqs: e.eqs,
        eqd: e.eqd,
        fromCode: a,
        toCode: b,
        fareProductId: fareId,
        cabin: fare.cabin,
      });
    }
    setLogged(true);
    setTimeout(() => setLogged(false), 2600);
  }

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="card overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_1fr]">
        {/* Inputs */}
        <div className="border-b border-ink-100 p-6 lg:border-b-0 lg:border-r">
          <h3 className="text-lg font-bold text-ink-900">Earning calculator</h3>
          <p className="mt-1 text-sm text-ink-500">See exactly what a flight earns at your status.</p>

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <AirportSelect value={from} onChange={setFrom} label="From" />
            <button
              onClick={swap}
              className="mb-1 grid h-10 w-10 place-items-center rounded-xl bg-ink-50 text-ink-500 ring-1 ring-ink-200 hover:bg-ink-100"
              aria-label="Swap airports"
            >
              <Icon name="Repeat" className="h-4 w-4" />
            </button>
            <AirportSelect value={to} onChange={setTo} label="To" />
          </div>

          <label className="mt-4 block">
            <span className="label">Fare product</span>
            <select value={fareId} onChange={(e) => setFareId(e.target.value)} className="input appearance-none">
              {FARE_PRODUCTS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — earns {f.earnRate}× distance
                </option>
              ))}
            </select>
          </label>
          <p className="mt-1.5 text-xs text-ink-500">{fare.note}</p>

          <label className="mt-4 flex items-center gap-2.5 text-sm font-semibold text-ink-700">
            <input
              type="checkbox"
              checked={roundTrip}
              onChange={(e) => setRoundTrip(e.target.checked)}
              className="h-4 w-4 rounded border-ink-300 text-aero-600 focus:ring-aero-500"
            />
            Round trip
          </label>

          <div className="mt-5 flex items-center gap-2 rounded-xl bg-ink-50 px-3 py-2.5 text-sm">
            <Icon name="Globe2" className="h-4 w-4 text-aero-600" />
            <span className="font-semibold text-ink-900 tnum">{num(earn.distance)} mi</span>
            <span className="text-ink-400">each way ·</span>
            <span className="text-ink-600">{ZONE_LABEL[zone]}</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-br from-ink-950 to-ink-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">You'll earn at</span>
            <TierBadge tier={tier} size="sm" />
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-5xl font-extrabold tracking-tight tnum">{num(total.redeemable)}</span>
            <span className="mb-1 text-white/60">redeemable miles</span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Metric label="Base" value={num(earn.base * legs)} />
            <Metric label={`Tier +${Math.round(tier.perks.earnBonus * 100)}%`} value={num(earn.tierBonus * legs)} accent="text-gold-300" />
            <Metric label="Per segment" value={num(earn.redeemable)} />
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/50">Counts toward status</div>
            <div className="mt-2 grid grid-cols-3 gap-3">
              <Metric label="Qual. miles" value={num(total.eqm)} />
              <Metric label="Segments" value={num(total.eqs)} />
              <Metric label="Qual. $" value={`$${num(total.eqd)}`} />
            </div>
          </div>

          <button onClick={logFlight} className="btn-gold mt-5 w-full">
            <Icon name={logged ? "Check" : "Plus"} className="h-4 w-4" />
            {logged ? "Added to your activity" : "Log this flight to my account"}
          </button>
          {earn.flooredMinimum && (
            <p className="mt-2 text-center text-xs text-white/50">Short hop — lifted to the 500-mile per-segment minimum.</p>
          )}
        </div>
      </div>

      {/* Tier comparison */}
      <div className="border-t border-ink-100 p-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-700">
          <Icon name="TrendingUp" className="h-4 w-4 text-aero-600" />
          What this trip earns at each status tier {roundTrip ? "(round trip)" : "(one way)"}
        </div>
        <div className="space-y-2.5">
          {tierRows.map((r) => {
            const t = TIERS.find((x) => x.id === r.tierId)!;
            const value = r.redeemable * legs;
            return (
              <div key={r.tierId} className="grid grid-cols-[110px_1fr_auto] items-center gap-3">
                <TierBadge tier={t} size="sm" />
                <Bar
                  value={r.redeemable / maxRedeemable}
                  fillClass={r.tierId === member.tierId ? "bg-gradient-to-r from-gold-300 to-gold-500" : "bg-gradient-to-r from-aero-400 to-aero-600"}
                />
                <span className="w-20 text-right text-sm font-bold tnum text-ink-900">{num(value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, accent = "text-white" }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div className={`text-lg font-extrabold tnum ${accent}`}>{value}</div>
      <div className="text-[11px] text-white/50">{label}</div>
    </div>
  );
}
