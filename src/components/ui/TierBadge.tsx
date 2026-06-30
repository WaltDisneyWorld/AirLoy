import type { Tier, TierId } from "../../types";
import { TIER_BY_ID } from "../../data/tiers";
import { Icon } from "./Icon";

const TIER_ICON: Record<TierId, string> = {
  horizon: "Compass",
  cirrus: "Star",
  aurora: "Sparkles",
  zenith: "Crown",
};

const CHIP_CLS: Record<TierId, string> = {
  horizon: "bg-ink-100 text-ink-600",
  cirrus: "bg-aero-100 text-aero-700",
  aurora: "bg-aero-600/10 text-aero-800",
  zenith: "bg-gold-100 text-gold-800",
};

export function TierBadge({
  tier,
  size = "md",
}: {
  tier: TierId | Tier;
  size?: "sm" | "md";
}) {
  const t = typeof tier === "string" ? TIER_BY_ID[tier] : tier;
  return (
    <span
      className={`chip ${CHIP_CLS[t.id]} ${size === "sm" ? "text-[11px] px-2 py-0.5" : ""}`}
    >
      <Icon name={TIER_ICON[t.id]} className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {t.name}
    </span>
  );
}

export { TIER_ICON };
