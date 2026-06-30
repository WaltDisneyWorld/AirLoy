import { useState } from "react";
import type { Reward } from "../../types";
import { REWARDS } from "../../data/rewards";
import { num, money } from "../../lib/format";
import { balanceFrom, CENT_PER_MILE } from "../../lib/status";
import { useAccount, accountStore } from "../../lib/store";
import { Icon } from "../ui/Icon";
import { Modal } from "../ui/Modal";

type CategoryFilter = "all" | "cabin" | "partner";

function RewardTile({ r, balance, onRedeem }: { r: Reward; balance: number; onRedeem: (r: Reward) => void }) {
  const affordable = balance >= r.miles;
  const value = ((r.valueUsd / r.miles) * 100).toFixed(1);
  return (
    <div className="group card overflow-hidden">
      <div className={`relative h-24 bg-gradient-to-br ${r.image}`}>
        <div className="absolute inset-0 bg-noise opacity-20" />
        <Icon name={r.icon} className="absolute bottom-3 left-4 h-8 w-8 text-white/90" />
        <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-bold text-ink-700 backdrop-blur">
          {value}¢ / mi
        </span>
      </div>
      <div className="p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-ink-400">{r.partnerName}</div>
        <h3 className="mt-0.5 text-sm font-bold text-ink-900">{r.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-ink-500">{r.blurb}</p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-lg font-extrabold tracking-tight text-ink-900 tnum">{num(r.miles)}</div>
            <div className="text-[11px] text-ink-500">miles{r.copayUsd ? ` + ${money(r.copayUsd)}` : ""}</div>
          </div>
          <button onClick={() => onRedeem(r)} disabled={!affordable} className="btn-primary px-3 py-2 text-xs">
            {affordable ? "Redeem" : "Short"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RewardsCatalog() {
  const { activity } = useAccount();
  const balance = balanceFrom(activity);
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [active, setActive] = useState<Reward | null>(null);
  const [done, setDone] = useState(false);

  const list = REWARDS.filter((r) =>
    filter === "all" ? true : filter === "cabin" ? r.kind === "upgrade" : r.kind === "partner-redeem"
  );

  function redeem() {
    if (!active) return;
    accountStore.post({
      date: new Date().toISOString(),
      kind: active.kind,
      description: `${active.name} · ${active.partnerName}`,
      miles: -active.miles,
      cashUsd: active.copayUsd,
    });
    setDone(true);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {([
          ["all", "All rewards"],
          ["cabin", "Cabin upgrades"],
          ["partner", "Partner rewards"],
        ] as [CategoryFilter, string][]).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
              filter === id ? "bg-aero-600 text-white shadow-soft" : "bg-white text-ink-600 ring-1 ring-ink-200 hover:ring-ink-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((r) => (
          <RewardTile key={r.id} r={r} balance={balance} onRedeem={(x) => { setActive(x); setDone(false); }} />
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={done ? "Redeemed" : "Confirm redemption"}>
        {active && !done && (
          <div>
            <div className="flex items-center gap-3 rounded-2xl bg-ink-50 p-4">
              <span className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${active.image} text-white`}>
                <Icon name={active.icon} className="h-6 w-6" />
              </span>
              <div>
                <div className="text-sm font-bold text-ink-900">{active.name}</div>
                <div className="text-xs text-ink-500">{active.partnerName}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Cost</span><span className="font-semibold text-ink-700 tnum">{num(active.miles)} miles{active.copayUsd ? ` + ${money(active.copayUsd)}` : ""}</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Approx. value</span><span className="font-semibold text-ink-700">{money(active.valueUsd)}</span></div>
              <div className="flex justify-between border-t border-ink-100 pt-2"><span className="text-ink-500">Balance after</span><span className="font-bold text-ink-900 tnum">{num(balance - active.miles)} miles</span></div>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              You're getting {((active.valueUsd / active.miles) * 100).toFixed(1)}¢ per mile — the program's blended value is {CENT_PER_MILE}¢.
            </p>
            <button onClick={redeem} className="btn-primary mt-5 w-full">
              <Icon name="Check" className="h-4 w-4" /> Confirm redemption
            </button>
          </div>
        )}
        {active && done && (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600">
              <Icon name="Gift" className="h-7 w-7" />
            </div>
            <p className="mt-3 text-lg font-bold text-ink-900">Enjoy your reward</p>
            <p className="mt-1 text-sm text-ink-500">{num(active.miles)} miles redeemed for {active.name}.</p>
            <button onClick={() => setActive(null)} className="btn-ghost mt-5 w-full">Done</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
