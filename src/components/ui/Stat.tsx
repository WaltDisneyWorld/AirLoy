import { Icon } from "./Icon";

export function Stat({
  label,
  value,
  sub,
  icon,
  accent = "text-aero-600",
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: string;
  accent?: string;
}) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="label mb-0">{label}</span>
        {icon && <Icon name={icon} className={`h-4 w-4 ${accent}`} />}
      </div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 tnum">{value}</div>
      {sub && <div className="mt-1 text-xs text-ink-500">{sub}</div>}
    </div>
  );
}
