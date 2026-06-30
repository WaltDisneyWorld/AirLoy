import { useState } from "react";
import { Link } from "react-router-dom";
import { AIRPORTS } from "../data/airports";
import { Icon } from "../components/ui/Icon";
import { BrandMark } from "../components/layout/Logo";
import { Barcode } from "../components/ui/Barcode";
import { num } from "../lib/format";

const WELCOME_BONUS = 5_000;

const PERKS = [
  "Earn miles on your very next flight",
  "Miles never expire while you stay active",
  "Member-only fares and award redemptions",
  "A clear path to elite status",
];

/** A pseudo member number from the email, formatted like AL-#### ###. */
function memberNumber(seed: string): string {
  let h = 5381;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  const a = String(1000 + (h % 9000));
  const b = String(100 + ((h >> 8) % 900));
  return `AL-${a} ${b}`;
}

export default function Join() {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [home, setHome] = useState("SFO");
  const [done, setDone] = useState(false);

  const valid = first.trim() && last.trim() && /\S+@\S+\.\S+/.test(email);
  const number = memberNumber(email || `${first}${last}`);

  return (
    <div className="relative overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 bg-aurora opacity-70" />
      <div className="absolute inset-0 bg-grid-faint [background-size:40px_40px] opacity-30" />

      <div className="relative mx-auto grid min-h-[80vh] max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        {/* Pitch */}
        <div>
          <Link to="/" className="inline-flex"><BrandMark className="h-11 w-11" /></Link>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Join AirLoy — <span className="text-gradient">free</span>.
          </h1>
          <p className="mt-4 max-w-md text-white/70">
            Create your account and we'll drop a {num(WELCOME_BONUS)}-mile welcome bonus into it to
            get you started.
          </p>
          <ul className="mt-7 space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3 text-white/85">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-aero-500/20 text-aero-300">
                  <Icon name="Check" className="h-4 w-4" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Form / success */}
        <div className="rounded-3xl bg-white p-7 text-ink-900 shadow-plate">
          {!done ? (
            <>
              <h2 className="text-xl font-bold">Create your account</h2>
              <p className="mt-1 text-sm text-ink-500">It takes about a minute.</p>
              <div className="mt-5 grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="label">First name</span>
                    <input value={first} onChange={(e) => setFirst(e.target.value)} className="input" placeholder="Maya" />
                  </label>
                  <label className="block">
                    <span className="label">Last name</span>
                    <input value={last} onChange={(e) => setLast(e.target.value)} className="input" placeholder="Okonkwo" />
                  </label>
                </div>
                <label className="block">
                  <span className="label">Email</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" />
                </label>
                <label className="block">
                  <span className="label">Home airport</span>
                  <select value={home} onChange={(e) => setHome(e.target.value)} className="input appearance-none">
                    {AIRPORTS.map((a) => (
                      <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
                    ))}
                  </select>
                </label>
                <button disabled={!valid} onClick={() => setDone(true)} className="btn-primary mt-1 w-full py-3">
                  Create account & claim {num(WELCOME_BONUS)} miles
                </button>
                <p className="text-center text-xs text-ink-400">
                  Demo enrollment — no real account is created. Already a member?{" "}
                  <Link to="/dashboard" className="font-semibold text-aero-700">Open the dashboard</Link>.
                </p>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon name="BadgeCheck" className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight">Welcome to AirLoy, {first}!</h2>
              <p className="mt-1 text-sm text-ink-500">Your Horizon membership is ready.</p>

              <div className="mt-5 rounded-2xl bg-ink-950 p-5 text-left text-white">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-white/55">Member number</span>
                  <BrandMark className="h-7 w-7" />
                </div>
                <div className="mt-1 font-mono text-lg tracking-widest">{number}</div>
                <div className="mt-3 rounded-lg bg-white/95 p-2">
                  <Barcode value={number} height={34} className="h-8 w-full" />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gold-50 px-4 py-3 text-sm font-semibold text-gold-800 ring-1 ring-gold-200">
                <Icon name="Gift" className="h-4 w-4" /> {num(WELCOME_BONUS)} welcome miles added
              </div>

              <Link to="/dashboard" className="btn-primary mt-5 w-full py-3">
                Go to my dashboard <Icon name="ArrowRight" className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
