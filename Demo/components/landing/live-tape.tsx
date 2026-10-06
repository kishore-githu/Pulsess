"use client";

import { useEffect, useState } from "react";
import { formatMoney, formatWhen } from "@/lib/format";
import type { Transaction } from "@/lib/types";

export function LiveTape({ events }: { events: Transaction[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (events.length < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % events.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [events.length]);

  return (
    <ol className="mt-2 space-y-1.5" aria-label="Latest orders">
      {events.map((event, index) => {
        const on = index === active;
        return (
          <li
            key={event.id}
            className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors ${on ? "bg-white/10" : "bg-transparent"}`}
          >
            <span className="min-w-0">
              <span className="block truncate text-paper">{event.customer}</span>
              <span className="block text-xs text-paper/75">
                {event.channel} · {formatWhen(event.createdAt)} UTC
              </span>
            </span>
            <span className="shrink-0 tabular-nums text-paper">{formatMoney(event.amount, 2)}</span>
          </li>
        );
      })}
    </ol>
  );
}
