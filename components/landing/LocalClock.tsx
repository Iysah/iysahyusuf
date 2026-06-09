"use client";

import { useEffect, useState } from "react";

/**
 * Live local clock for Lagos (West Africa Time). Renders a static placeholder
 * on first paint to avoid hydration mismatch, then ticks client-side.
 */
export default function LocalClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const format = () =>
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Africa/Lagos",
      }).format(new Date());

    setTime(format());
    const id = setInterval(() => setTime(format()), 20_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="tabular-nums">{time || "--:-- --"}</span>
    </span>
  );
}
