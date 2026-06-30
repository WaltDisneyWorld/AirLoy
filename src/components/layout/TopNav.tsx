import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { Icon } from "../ui/Icon";
import { TierBadge } from "../ui/TierBadge";
import { useAccount } from "../../lib/store";
import { balanceFrom } from "../../lib/status";
import { TIER_BY_ID } from "../../data/tiers";
import { compact, initials } from "../../lib/format";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/earn", label: "Earn" },
  { to: "/redeem", label: "Redeem" },
  { to: "/status", label: "Status" },
  { to: "/activity", label: "Activity" },
];

export function TopNav() {
  const { member, activity } = useAccount();
  const tier = TIER_BY_ID[member.tierId];
  const balance = balanceFrom(activity);
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="AirLoy home">
          <Logo />
        </Link>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-aero-50 text-aero-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden items-center gap-3 rounded-full bg-ink-50 py-1.5 pl-1.5 pr-4 ring-1 ring-ink-100 transition hover:ring-aero-200 sm:flex"
          >
            <span className={`grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br ${member.accent} text-xs font-bold text-white`}>
              {initials(`${member.firstName} ${member.lastName}`)}
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tnum text-ink-900">{compact(balance)} mi</span>
              <span className="block text-[11px] text-ink-500">{tier.name}</span>
            </span>
          </Link>

          <button
            className="rounded-lg p-2 text-ink-600 hover:bg-ink-50 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <Icon name={open ? "X" : "Menu"} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-ink-50 p-3">
              <span className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${member.accent} text-sm font-bold text-white`}>
                {initials(`${member.firstName} ${member.lastName}`)}
              </span>
              <div className="leading-tight">
                <div className="text-sm font-bold text-ink-900">{member.firstName} {member.lastName}</div>
                <div className="mt-0.5"><TierBadge tier={tier} size="sm" /></div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm font-bold tnum text-ink-900">{compact(balance)}</div>
                <div className="text-[11px] text-ink-500">miles</div>
              </div>
            </div>
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive ? "bg-aero-50 text-aero-700" : "text-ink-700 hover:bg-ink-50"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
