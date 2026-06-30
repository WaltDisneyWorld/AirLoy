import type { TierStanding } from "../../types";
import { Bar, Ring } from "../ui/Meter";
import { Icon } from "../ui/Icon";
import { TierBadge, TIER_ICON } from "../ui/TierBadge";
import { num } from "../../lib/format";

const METRIC_LABEL = { eqm: "Qualifying miles", eqs: "Segments", eqd: "Qualifying dollars" } as const;

function MetricBar({
  metric,
  have,
  need,
  binding,
}: {
  metric: "eqm" | "eqs" | "eqd";
  have: number;
  need: number;
  binding: boolean;
}) {
  const pct = need ? Math.min(1, have / need) : 1;
  const fmt = (n: number) => (metric === "eqd" ? `$${num(n)}` : num(n));
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-ink-700">
          {METRIC_LABEL[metric]}
          {binding && (
            <span className="ml-2 rounded-full bg-aero-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-aero-700">
              closest
            </span>
          )}
        </span>
        <span className="tnum text-ink-500">
          <span className="font-bold text-ink-900">{fmt(have)}</span> / {fmt(need)}
        </span>
      </div>
      <Bar
        value={pct}
        fillClass={binding ? "bg-gradient-to-r from-gold-300 to-gold-500" : "bg-gradient-to-r from-aero-400 to-aero-600"}
      />
    </div>
  );
}

export function StatusTracker({ standing }: { standing: TierStanding }) {
  const { current, projected, next, ytd, toNext, progress, bindingMetric } = standing;
  const atTop = !next;
  const requalifying = projected.rank < current.rank;

  const gap =
    toNext &&
    (bindingMetric === "eqm"
      ? `${num(toNext.eqm)} qualifying miles`
      : bindingMetric === "eqs"
      ? `${num(toNext.eqs)} segments`
      : `$${num(toNext.eqd)} qualifying dollars`);

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="shrink-0 self-center">
          <Ring
            value={progress}
            gradient={atTop ? ["#ffd24a", "#f99e07"] : ["#2fc4bf", "#0d8487"]}
          >
            <div className="text-center">
              <div className="text-2xl font-extrabold tnum text-ink-900">{Math.round(progress * 100)}%</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">
                {atTop ? "Top tier" : `to ${next!.name}`}
              </div>
            </div>
          </Ring>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Status this year</span>
            <TierBadge tier={current} size="sm" />
          </div>

          {atTop ? (
            <p className="mt-2 text-lg font-bold text-ink-900">
              You've reached <span className="text-gold-600">Zenith</span> — the summit of AirLoy.
            </p>
          ) : requalifying ? (
            <p className="mt-2 text-lg font-bold text-ink-900">
              <span className="tnum text-aero-700">{gap}</span> from requalifying for{" "}
              <span className="text-aero-700">{next!.name}</span>.
            </p>
          ) : (
            <p className="mt-2 text-lg font-bold text-ink-900">
              <span className="tnum text-aero-700">{gap}</span> from reaching{" "}
              <span className="text-aero-700">{next!.name}</span>.
            </p>
          )}

          <p className="mt-1 text-sm text-ink-500">
            On current-year flying you're tracking to{" "}
            <span className="inline-flex items-center gap-1 font-semibold text-ink-700">
              <Icon name={TIER_ICON[projected.id]} className="h-3.5 w-3.5" />
              {projected.name}
            </span>{" "}
            for next year.
          </p>
        </div>
      </div>

      {next && toNext && (
        <div className="mt-6 space-y-4 border-t border-ink-100 pt-5">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            {next.name} requires {num(next.reqEqm)} miles <span className="text-ink-300">or</span> {next.reqEqs} segments, plus ${num(next.reqEqd)}
          </div>
          <MetricBar metric="eqm" have={ytd.eqm} need={next.reqEqm} binding={bindingMetric === "eqm"} />
          <MetricBar metric="eqs" have={ytd.eqs} need={next.reqEqs} binding={bindingMetric === "eqs"} />
          <MetricBar metric="eqd" have={ytd.eqd} need={next.reqEqd} binding={bindingMetric === "eqd"} />
        </div>
      )}
    </div>
  );
}
