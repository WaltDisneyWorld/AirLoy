/** The AirLoy mark — an upswept mile-arc with a status star — and wordmark. */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="AirLoy">
      <defs>
        <linearGradient id="airloy-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2fc4bf" />
          <stop offset="1" stopColor="#0d8487" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0b1220" />
      <path d="M12 44 C26 40 40 30 52 14" fill="none" stroke="url(#airloy-g)" strokeWidth="5.5" strokeLinecap="round" />
      <path d="M12 44 C24 44 36 42 48 36" fill="none" stroke="url(#airloy-g)" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <path d="M48 12.5l2.1 4.6 5 .5-3.8 3.4 1.1 5-4.4-2.6-4.4 2.6 1.1-5-3.8-3.4 5-.5z" fill="#ffc848" />
    </svg>
  );
}

export function Logo({
  className = "",
  light = false,
  withWord = true,
}: {
  className?: string;
  light?: boolean;
  withWord?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <BrandMark />
      {withWord && (
        <span className={`text-xl font-extrabold tracking-tight ${light ? "text-white" : "text-ink-900"}`}>
          Air<span className="text-aero-500">Loy</span>
        </span>
      )}
    </span>
  );
}
