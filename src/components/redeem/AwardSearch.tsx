import { useMemo, useState } from "react";
import { AIRPORTS, airportLabel } from "../../data/airports";
import { awardCabins, awardCalendar, type AwardQuote } from "../../lib/awards";
import { ZONE_LABEL } from "../../lib/distance";
import { CABIN_LABEL } from "../../data/fares";
import { num, money, shortDate, weekday } from "../../lib/format";
import { balanceFrom } from "../../lib/status";
import { useAccount, accountStore } from "../../lib/store";
import { Icon } from "../ui/Icon";
import { Modal } from "../ui/Modal";
import type { CabinId } from "../../types";

const CABIN_ICON: Record<CabinId, string> = {
  economy: "Armchair",
  premium: "Sofa",
  business: "BedDouble",
  first: "Crown",
};

function plusDays(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString().slice(0, 10);
}

export function AwardSearch() {
  const { activity } = useAccount();
  const balance = balanceFrom(activity);

  const [from, setFrom] = useState("SFO");
  const [to, setTo] = useState("HND");
  const [date, setDate] = useState(plusDays(28));
  const [cabin, setCabin] = useState<CabinId>("business");
  const [roundTrip, setRoundTrip] = useState(true);
  const [booking, setBooking] = useState<AwardQuote | null>(null);
  const [booked, setBooked] = useState(false);

  const dateISO = `${date}T10:00:00`;
  const legs = roundTrip ? 2 : 1;

  const cabins = useMemo(() => awardCabins(from, to, dateISO), [from, to, dateISO]);
  const calendar = useMemo(() => awardCalendar(from, to, cabin, dateISO, 10), [from, to, cabin, dateISO]);
  const calMin = Math.min(...calendar.map((c) => c.miles));

  const selected = cabins.find((c) => c.cabin === cabin)!;
  const totalMiles = selected.miles * legs;
  const totalTax = +(selected.taxesUsd * legs).toFixed(2);
  const affordable = balance >= totalMiles;

  function confirmBooking(q: AwardQuote) {
    setBooking(q);
    setBooked(false);
  }

  function doBook() {
    if (!booking) return;
    const m = booking.miles * legs;
    accountStore.post({
      date: new Date().toISOString(),
      kind: "award",
      description: `Award flight · ${airportLabel(from)} → ${airportLabel(to)}${roundTrip ? " (round trip)" : ""}`,
      miles: -m,
      fromCode: from,
      toCode: to,
      cabin: booking.cabin,
      cashUsd: +(booking.taxesUsd * legs).toFixed(2),
    });
    setBooked(true);
  }

  return (
    <div>
      {/* Search bar */}
      <div className="card p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
          <label className="block">
            <span className="label">From</span>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="input appearance-none">
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label">To</span>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="input appearance-none">
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="label">Departure</span>
            <input type="date" value={date} min={plusDays(1)} onChange={(e) => setDate(e.target.value)} className="input" />
          </label>
          <label className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-ink-700 md:mb-3">
            <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)} className="h-4 w-4 rounded border-ink-300 text-aero-600 focus:ring-aero-500" />
            Round trip
          </label>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-ink-500">
          <Icon name="Globe2" className="h-4 w-4 text-aero-600" />
          <span className="font-semibold text-ink-700 tnum">{num(selected.distance)} mi</span> each way · {ZONE_LABEL[selected.zone]} · dynamic award pricing
        </div>
      </div>

      {/* Cabin results */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cabins.map((q) => {
          const active = q.cabin === cabin;
          const cost = q.miles * legs;
          return (
            <button
              key={q.cabin}
              onClick={() => setCabin(q.cabin)}
              className={`group rounded-2xl border-2 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lift ${
                active ? "border-aero-500 shadow-lift" : "border-transparent shadow-card ring-1 ring-ink-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${active ? "bg-aero-600 text-white" : "bg-aero-50 text-aero-600"}`}>
                  <Icon name={CABIN_ICON[q.cabin]} className="h-5 w-5" />
                </span>
                {q.saverAvailable ? (
                  <span className="chip bg-emerald-100 text-emerald-700">Saver</span>
                ) : (
                  <span className="chip bg-gold-100 text-gold-800">Standard</span>
                )}
              </div>
              <div className="mt-3 text-sm font-semibold text-ink-700">{CABIN_LABEL[q.cabin]}</div>
              <div className="text-2xl font-extrabold tracking-tight text-ink-900 tnum">{num(cost)}</div>
              <div className="text-xs text-ink-500">miles{roundTrip ? " round trip" : ""} + {money(q.taxesUsd * legs, { cents: true })}</div>
              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-aero-700">
                <Icon name="TrendingUp" className="h-3.5 w-3.5" /> {q.centsPerMile}¢ / mile value
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected cabin detail + calendar */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-ink-900">{CABIN_LABEL[selected.cabin]} award</h3>
            <span className="text-xs text-ink-400">vs. {money(selected.cashFareUsd)} cash fare</span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-ink-900 tnum">{num(totalMiles)}</span>
            <span className="mb-1 text-sm text-ink-500">miles + {money(totalTax, { cents: true })}</span>
          </div>
          <div className="mt-4 space-y-1.5 text-sm">
            <Row label="Saver level" value={`${num(selected.saverMiles * legs)} mi`} />
            <Row label="Standard level" value={`${num(selected.standardMiles * legs)} mi`} />
            <Row label="Demand on this date" value={`${Math.round(selected.demand * 100)}%`} />
            <Row label="Your balance after" value={`${num(balance - totalMiles)} mi`} tone={affordable ? "" : "text-red-600"} />
          </div>
          <button
            onClick={() => confirmBooking(selected)}
            disabled={!affordable}
            className="btn-primary mt-5 w-full"
          >
            <Icon name="Ticket" className="h-4 w-4" />
            {affordable ? `Redeem ${num(totalMiles)} miles` : "Not enough miles"}
          </button>
        </div>

        {/* Price calendar */}
        <div className="card p-5">
          <div className="flex items-center gap-2">
            <Icon name="Calendar" className="h-4 w-4 text-aero-600" />
            <h3 className="font-bold text-ink-900">{CABIN_LABEL[selected.cabin]} prices · next 10 days</h3>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {calendar.map((c) => {
              const isSel = c.dateISO.slice(0, 10) === date;
              const cheapest = c.miles === calMin;
              return (
                <button
                  key={c.dateISO}
                  onClick={() => setDate(c.dateISO.slice(0, 10))}
                  className={`rounded-xl p-2 text-center transition ${
                    isSel ? "bg-aero-600 text-white" : c.saver ? "bg-emerald-50 hover:bg-emerald-100" : "bg-ink-50 hover:bg-ink-100"
                  }`}
                >
                  <div className={`text-[10px] font-semibold uppercase ${isSel ? "text-white/70" : "text-ink-400"}`}>{weekday(c.dateISO)}</div>
                  <div className={`text-xs font-bold ${isSel ? "text-white" : "text-ink-900"}`}>{shortDate(c.dateISO)}</div>
                  <div className={`mt-1 text-[11px] font-semibold tnum ${isSel ? "text-white" : cheapest ? "text-emerald-700" : "text-ink-600"}`}>
                    {Math.round((c.miles * legs) / 1000)}k
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-ink-400">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-emerald-200" /> Saver space</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-ink-200" /> Standard</span>
          </div>
        </div>
      </div>

      {/* Booking confirmation */}
      <Modal open={!!booking} onClose={() => setBooking(null)} title={booked ? "Award booked" : "Confirm award booking"}>
        {booking && !booked && (
          <div>
            <div className="rounded-2xl bg-ink-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <Icon name="PlaneTakeoff" className="h-4 w-4 text-aero-600" />
                {airportLabel(from)} → {airportLabel(to)} {roundTrip && "(round trip)"}
              </div>
              <div className="mt-1 text-xs text-ink-500">{CABIN_LABEL[booking.cabin]} · {ZONE_LABEL[booking.zone]}</div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Miles" value={`${num(booking.miles * legs)} mi`} />
              <Row label="Taxes & fees" value={money(booking.taxesUsd * legs, { cents: true })} />
              <div className="border-t border-ink-100 pt-2">
                <Row label="Balance after" value={`${num(balance - booking.miles * legs)} mi`} bold />
              </div>
            </div>
            <button onClick={doBook} className="btn-primary mt-5 w-full">
              <Icon name="Check" className="h-4 w-4" /> Confirm & deduct miles
            </button>
          </div>
        )}
        {booking && booked && (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <Icon name="CheckCheck" className="h-7 w-7" />
            </div>
            <p className="mt-3 text-lg font-bold text-ink-900">You're booked!</p>
            <p className="mt-1 text-sm text-ink-500">
              {num(booking.miles * legs)} miles redeemed for {CABIN_LABEL[booking.cabin]} · {airportLabel(from)} → {airportLabel(to)}.
              It's already on your activity statement.
            </p>
            <button onClick={() => setBooking(null)} className="btn-ghost mt-5 w-full">Done</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Row({ label, value, tone = "", bold = false }: { label: string; value: string; tone?: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-500">{label}</span>
      <span className={`tnum ${bold ? "font-bold text-ink-900" : "font-semibold text-ink-700"} ${tone}`}>{value}</span>
    </div>
  );
}
