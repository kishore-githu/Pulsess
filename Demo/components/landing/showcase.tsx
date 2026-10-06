"use client";

import { useState } from "react";
import { formatDay, formatMoney } from "@/lib/format";
import type { Customer, Metrics } from "@/lib/types";

const tabs = [
  { id: "revenue", label: "Revenue" },
  { id: "channels", label: "Channels" },
  { id: "customers", label: "Customers" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function Showcase({ metrics, customers }: { metrics: Metrics; customers: Customer[] }) {
  const [tab, setTab] = useState<TabId>("revenue");
  const recent = metrics.series.slice(-7);
  const max = Math.max(...recent.map((point) => point.revenue), 1);
  const channelMax = Math.max(...metrics.channels.map((channel) => channel.revenue), 1);

  return (
    <section className="pb-20 sm:pb-28" aria-labelledby="showcase-title">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-forest-mid">Inside the workspace</p>
          <h2 id="showcase-title" className="mt-3 font-serif text-[2.4rem] leading-[1.05] tracking-tight sm:text-5xl">
            The same ledger, three ways of reading it.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Switch the view. The figures stay tied to Northwind’s sample orders, which is the workspace you can open next.
          </p>
          <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Product views">
            {tabs.map((item) => {
              const selected = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  className={`h-11 rounded-full px-4 text-sm ${selected ? "bg-ink text-paper" : "bg-sand text-ink hover:bg-line"}`}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] bg-card p-5 ring-1 ring-line sm:p-7" role="tabpanel">
          {tab === "revenue" ? (
            <div>
              <p className="text-sm text-muted">Last 7 days of net revenue</p>
              <ul className="mt-5 space-y-3">
                {recent.map((point) => (
                  <li key={point.date} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-3 text-sm">
                    <span className="text-muted">{formatDay(point.date)}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-sand">
                      <span className="block h-full rounded-full bg-forest" style={{ width: `${Math.max(4, (point.revenue / max) * 100)}%` }} />
                    </span>
                    <span className="tabular-nums">{formatMoney(point.revenue)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tab === "channels" ? (
            <div>
              <p className="text-sm text-muted">Net revenue by channel · {metrics.label}</p>
              <ul className="mt-5 space-y-4">
                {metrics.channels.map((channel) => (
                  <li key={channel.channel}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span>{channel.channel}</span>
                      <span className="tabular-nums">{formatMoney(channel.revenue)}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-sand">
                      <div className="h-full rounded-full bg-pulse" style={{ width: `${Math.max(4, (channel.revenue / channelMax) * 100)}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-muted">{channel.orders} orders</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {tab === "customers" ? (
            <div>
              <p className="text-sm text-muted">Highest spend in this window</p>
              <ul className="mt-4 divide-y divide-line">
                {customers.map((customer) => (
                  <li key={customer.id} className="flex items-center justify-between gap-4 py-3">
                    <span>
                      <span className="block font-medium">{customer.name}</span>
                      <span className="text-sm text-muted">{customer.region} · {customer.segment}</span>
                    </span>
                    <span className="tabular-nums">{formatMoney(customer.spend)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
