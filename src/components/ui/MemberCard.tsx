import type { Member, Tier } from "../../types";
import { BrandMark } from "../layout/Logo";
import { Barcode } from "./Barcode";
import { Icon } from "./Icon";
import { TIER_ICON } from "./TierBadge";
import { longDate, num } from "../../lib/format";

/** A premium digital membership card, tinted to the member's status tier. */
export function MemberCard({
  member,
  tier,
  balance,
}: {
  member: Member;
  tier: Tier;
  balance: number;
}) {
  const dark = tier.id === "horizon" || tier.id === "zenith";
  const plate =
    tier.id === "zenith"
      ? "bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950"
      : tier.id === "aurora"
      ? "bg-gradient-to-br from-aero-700 via-aero-800 to-ink-950"
      : tier.id === "cirrus"
      ? "bg-gradient-to-br from-aero-500 via-aero-600 to-aero-800"
      : "bg-gradient-to-br from-ink-700 via-ink-800 to-ink-950";

  return (
    <div className={`relative overflow-hidden rounded-3xl ${plate} p-6 text-white shadow-plate`}>
      <div className="absolute inset-0 bg-noise opacity-[0.18]" />
      {tier.id === "zenith" && (
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gold-400/20 blur-2xl" />
      )}
      <div className="absolute -left-8 bottom-2 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <BrandMark className="h-9 w-9" />
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">
              Air<span className={tier.id === "zenith" ? "text-gold-300" : "text-aero-200"}>Loy</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">Membership</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/20 backdrop-blur">
          <Icon name={TIER_ICON[tier.id]} className={`h-3.5 w-3.5 ${tier.id === "zenith" ? "text-gold-300" : "text-aero-200"}`} />
          {tier.name}
        </div>
      </div>

      <div className="relative mt-7">
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">Member</div>
        <div className="text-xl font-bold">
          {member.firstName} {member.lastName}
        </div>
      </div>

      <div className="relative mt-4 flex items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">Member number</div>
          <div className="font-mono text-base tracking-widest tnum">{member.id}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/55">Miles</div>
          <div className="text-base font-bold tnum">{num(balance)}</div>
        </div>
      </div>

      <div className="relative mt-5 rounded-xl bg-white/95 p-2.5">
        <Barcode value={member.id} height={40} className="h-9 w-full" />
        <div className="mt-1 text-center font-mono text-[10px] tracking-[0.3em] text-ink-700">
          {member.id.replace(/\s/g, "")}
        </div>
      </div>

      <div className="relative mt-3 flex items-center justify-between text-[11px] text-white/60">
        <span>Member since {longDate(member.joinedISO).replace(/,.*/, "")} {new Date(member.joinedISO).getFullYear()}</span>
        <span className={dark ? "text-white/50" : "text-white/70"}>{tier.tagline}</span>
      </div>
    </div>
  );
}
