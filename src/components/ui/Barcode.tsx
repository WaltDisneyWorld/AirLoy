/**
 * A decorative Code-128-style barcode rendered deterministically from a string
 * (e.g. a member number). Not a scannable code — it's a faithful-looking demo
 * artifact for the membership card.
 */
export function Barcode({
  value,
  className = "",
  height = 44,
  color = "#0b1220",
}: {
  value: string;
  className?: string;
  height?: number;
  color?: string;
}) {
  // Deterministic bar widths from the characters of `value`.
  let seed = 7;
  for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) % 9973;
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 60; i++) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    const w = 1 + (seed % 4);
    const gap = 1 + ((seed >> 4) % 3);
    bars.push({ x, w });
    x += w + gap;
  }
  const total = x;
  return (
    <svg
      viewBox={`0 0 ${total} ${height}`}
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-label={`Barcode for ${value}`}
    >
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill={color} />
      ))}
    </svg>
  );
}
