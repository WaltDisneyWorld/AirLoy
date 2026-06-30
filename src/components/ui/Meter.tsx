/** A slim horizontal progress bar with a gradient fill. */
export function Bar({
  value,
  className = "",
  trackClass = "bg-ink-100",
  fillClass = "bg-gradient-to-r from-aero-400 to-aero-600",
  height = "h-2.5",
}: {
  value: number; // 0..1
  className?: string;
  trackClass?: string;
  fillClass?: string;
  height?: string;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={`w-full overflow-hidden rounded-full ${trackClass} ${height} ${className}`}>
      <div
        className={`h-full rounded-full ${fillClass} transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** A circular progress ring rendered as SVG. */
export function Ring({
  value,
  size = 132,
  stroke = 12,
  trackColor = "#e9edf3",
  children,
  gradient = ["#2fc4bf", "#0d8487"],
}: {
  value: number; // 0..1
  size?: number;
  stroke?: number;
  trackColor?: string;
  children?: React.ReactNode;
  gradient?: [string, string];
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value));
  const gid = `ring-${gradient[0].replace("#", "")}-${gradient[1].replace("#", "")}`;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={gradient[0]} />
            <stop offset="1" stopColor={gradient[1]} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}
