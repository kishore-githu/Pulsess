"use client";

import { useId, useState } from "react";
import { formatDay, formatDelta, formatMoney, formatPercent } from "@/lib/format";
import type { Metrics } from "@/lib/types";
import { Skeleton } from "@/components/dashboard/states";

export function KpiGrid({ metrics, loading }: { metrics: Metrics | null; loading: boolean }) {
  if (loading || !metrics) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-32" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Revenue", value: formatMoney(metrics.kpis.revenue.value), delta: metrics.kpis.revenue.delta, hint: "Paid orders minus refunds" },
    { label: "Users", value: String(metrics.kpis.users.value), delta: metrics.kpis.users.delta, hint: "Customers with an order in this window" },
    { label: "Conversion", value: formatPercent(metrics.kpis.conversion.value), delta: metrics.kpis.conversion.delta, hint: "Paid orders divided by every attempt" },
    { label: "Orders", value: String(metrics.kpis.orders.value), delta: metrics.kpis.orders.delta, hint: "Orders that did not fail" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const up = card.delta >= 0;
        return (
          <article key={card.label} className="rounded-3xl bg-card p-5 ring-1 ring-line">
            <h3 className="text-sm text-muted" title={card.hint}>{card.label}</h3>
            <p className="mt-3 font-serif text-4xl tabular-nums tracking-tight">{card.value}</p>
            <p className={`mt-3 text-sm tabular-nums ${up ? "text-forest-mid" : "text-pulse-dark"}`}>
              {formatDelta(card.delta)}
              <span className="text-muted"> vs prior window</span>
            </p>
          </article>
        );
      })}
    </div>
  );
}

export function RevenueChart({ metrics, loading }: { metrics: Metrics | null; loading: boolean }) {
  const gid = useId().replace(/:/g, "");
  const [active, setActive] = useState<number | null>(null);

  if (loading || !metrics) return <Skeleton className="h-72" />;

  const series = metrics.series;
  const width = 640;
  const height = 220;
  const pad = { l: 4, r: 4, t: 18, b: 8 };
  const values = series.map((point) => point.revenue);
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const coords = series.map((point, index) => {
    const x = pad.l + (index / Math.max(series.length - 1, 1)) * (width - pad.l - pad.r);
    const y = pad.t + (1 - (point.revenue - min) / span) * (height - pad.t - pad.b);
    return { x, y, point };
  });

  let line = "";
  coords.forEach((point, index) => {
    if (index === 0) {
      line += `M${point.x} ${point.y}`;
      return;
    }
    const prev = coords[index - 1];
    const mid = (prev.x + point.x) / 2;
    line += ` C${mid} ${prev.y}, ${mid} ${point.y}, ${point.x} ${point.y}`;
  });
  const last = coords[coords.length - 1];
  const first = coords[0];
  const area = `${line} L${last.x} ${height - pad.b} L${first.x} ${height - pad.b} Z`;
  const current = active == null ? null : coords[active];

  return (
    <div className="rounded-3xl bg-card p-5 ring-1 ring-line">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-2xl tracking-tight">Revenue</h3>
        <p className="text-xs text-muted">{metrics.label}</p>
      </div>
      <div className="relative mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-56 w-full touch-pan-y"
          role="img"
          aria-label={`Net revenue from ${metrics.label}. Latest day ${formatMoney(series[series.length - 1]?.revenue ?? 0)}.`}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * width;
            let nearest = 0;
            let best = Number.POSITIVE_INFINITY;
            coords.forEach((point, index) => {
              const distance = Math.abs(point.x - x);
              if (distance < best) {
                best = distance;
                nearest = index;
              }
            });
            setActive(nearest);
          }}
          onPointerLeave={() => setActive(null)}
        >
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#12382E" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#12382E" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((step) => (
            <line
              key={step}
              x1={0}
              x2={width}
              y1={pad.t + (1 - step) * (height - pad.t - pad.b)}
              y2={pad.t + (1 - step) * (height - pad.t - pad.b)}
              stroke="#E3DACB"
              strokeWidth="1"
            />
          ))}
          <path d={area} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke="#12382E" strokeWidth="2.4" strokeLinejoin="round" />
          {current ? (
            <>
              <line x1={current.x} x2={current.x} y1={pad.t} y2={height - pad.b} stroke="#DC3B2C" strokeDasharray="3 4" />
              <circle cx={current.x} cy={current.y} r="4" fill="#DC3B2C" />
            </>
          ) : null}
        </svg>
        {current ? (
          <div
            className="pointer-events-none absolute top-2 rounded-2xl bg-ink px-3 py-2 text-xs text-paper shadow-lg"
            style={{ left: `clamp(0px, ${(current.x / width) * 100}%, calc(100% - 8.5rem))` }}
          >
            <p>{formatDay(current.point.date)}</p>
            <p className="mt-0.5 tabular-nums">{formatMoney(current.point.revenue)} · {current.point.orders} orders</p>
          </div>
        ) : null}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>{formatDay(series[0].date)}</span>
        <span>{formatDay(series[Math.floor(series.length / 2)].date)}</span>
        <span>{formatDay(series[series.length - 1].date)}</span>
      </div>
    </div>
  );
}

export function ChannelChart({ metrics, loading }: { metrics: Metrics | null; loading: boolean }) {
  if (loading || !metrics) return <Skeleton className="h-72" />;
  const positive = metrics.channels.map((channel) => Math.max(channel.revenue, 0));
  const max = Math.max(...positive, 1);

  return (
    <div className="rounded-3xl bg-card p-5 ring-1 ring-line">
      <h3 className="font-serif text-2xl tracking-tight">Channels</h3>
      <p className="mt-1 text-xs text-muted">Net revenue · {metrics.label}</p>
      <ul className="mt-5 space-y-4">
        {metrics.channels.map((channel) => (
          <li key={channel.channel}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span>{channel.channel}</span>
              <span className="tabular-nums">{formatMoney(channel.revenue)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand">
              <div
                className={`h-full rounded-full ${channel.revenue < 0 ? "bg-pulse" : "bg-forest"}`}
                style={{ width: `${channel.revenue <= 0 ? 4 : Math.max(3, (channel.revenue / max) * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">{channel.orders} orders</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function InsightRow({ metrics }: { metrics: Metrics }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <p className="rounded-2xl bg-sand px-4 py-3 text-sm text-ink">
        Quietest day {metrics.quietest ? `${formatDay(metrics.quietest.date)}, ${formatMoney(metrics.quietest.revenue)} net` : "is still settling"}.
      </p>
      <p className="rounded-2xl bg-mist px-4 py-3 text-sm text-forest">
        {metrics.leadingChannel
          ? `${metrics.leadingChannel.channel} leads with ${formatMoney(metrics.leadingChannel.revenue)} across ${metrics.leadingChannel.orders} orders.`
          : "Channel mix appears with the first orders."}
      </p>
    </div>
  );
}
