import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-ink-500">
              The frequent-flyer program where every mile takes you further. Earn on
              flights and partners, climb the status ladder, and redeem for award
              travel.
            </p>
          </div>
          <FooterCol
            title="Program"
            links={[
              ["Dashboard", "/dashboard"],
              ["Earn miles", "/earn"],
              ["Redeem", "/redeem"],
              ["Status & tiers", "/status"],
            ]}
          />
          <FooterCol
            title="Account"
            links={[
              ["Activity", "/activity"],
              ["Join AirLoy", "/join"],
              ["Membership card", "/dashboard"],
            ]}
          />
          <FooterCol
            title="About"
            links={[
              ["Home", "/"],
              ["The award chart", "/redeem"],
              ["How earning works", "/earn"],
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} AirLoy. A design demo — all carriers, partners, fares and members are fictional.</span>
          <span className="flex gap-4">
            <Link to="/status" className="hover:text-ink-600">Program rules</Link>
            <Link to="/redeem" className="hover:text-ink-600">Award chart</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wide text-ink-900">{title}</div>
      <ul className="mt-3 space-y-2">
        {links.map(([label, to]) => (
          <li key={label + to}>
            <Link to={to} className="text-sm text-ink-500 transition hover:text-aero-700">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
