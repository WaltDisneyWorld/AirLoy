import { useEffect, useState } from "react";

/** Re-renders on an interval so any "time remaining" readouts tick along. */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const tid = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(tid);
  }, [intervalMs]);
  return now;
}

/** Tracks a CSS media query (used for reduced-motion / responsive tweaks). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" && window.matchMedia ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
