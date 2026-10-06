import { SectionIntro } from "@/components/landing/section";
import { formatDay, formatMoney, formatPercent } from "@/lib/format";
import type { Metrics } from "@/lib/types";

function Sparkline({ metrics }: { metrics: Metrics }) {
  const values = metrics.series.map((point) => point.revenue);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  const width = 320;
  const height = 88;
  const coords = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * width;
    const y = height - ((value - min) / span) * (height - 8) - 4;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-6 h-24 w-full" role="img" aria-label="Revenue across the last 30 days">
      <polyline fill="none" stroke="#12382E" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" points={coords.join(" ")} />
    </svg>
  );
}

export function Features({ metrics }: { metrics: Metrics }) {
  const quiet = metrics.quietest;

  return (
    <section id="product" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionIntro
          eyebrow="The product"
          title="One reading of the business."
          body="The numbers a retail team usually chases across exports sit on a single desk, calculated from the same orders."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-6">
          <article className="rounded-[28px] bg-card p-6 ring-1 ring-line md:col-span-4 md:p-8">
            <p className="text-sm text-muted">Live ledger</p>
            <h3 className="mt-2 font-serif text-3xl tracking-tight">Revenue, drawn as it lands.</h3>
            <p className="mt-3 max-w-lg text-muted">
              Paid orders, refunds, and failed attempts stay in the tape. The line below is the last 30 days of Northwind’s net revenue.
            </p>
            <Sparkline metrics={metrics} />
            <p className="mt-2 text-sm tabular-nums text-muted">{formatMoney(metrics.kpis.revenue.value)} net · {metrics.label}</p>
          </article>

          <article className="flex flex-col justify-between rounded-[28px] bg-forest p-6 text-paper md:col-span-2 md:p-8">
            <p className="text-sm text-paper/70">Conversion</p>
            <div>
              <p className="font-serif text-6xl tracking-tight">{formatPercent(metrics.kpis.conversion.value)}</p>
              <p className="mt-3 text-sm leading-relaxed text-paper/75">
                Paid orders divided by every attempt in the window, including the ones that failed.
              </p>
            </div>
          </article>

          <article className="rounded-[28px] bg-sand p-6 md:col-span-2 md:p-7">
            <p className="text-sm text-muted">Quietest day</p>
            <h3 className="mt-3 font-serif text-3xl tracking-tight">{quiet ? formatDay(quiet.date) : "—"}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {quiet
                ? `${formatMoney(quiet.revenue)} net. Pulse keeps the slow day visible so a strong week cannot hide it.`
                : "The window is still filling in."}
            </p>
          </article>

          <article className="rounded-[28px] bg-card p-6 ring-1 ring-line md:col-span-2 md:p-7">
            <p className="text-sm text-muted">Customers</p>
            <h3 className="mt-3 font-serif text-3xl tracking-tight">{metrics.kpis.users.value} active</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              People with an order in this window, with spend and last visit beside the name.
            </p>
          </article>

          <article className="rounded-[28px] bg-card p-6 ring-1 ring-line md:col-span-2 md:p-7">
            <p className="text-sm text-muted">Leading channel</p>
            <h3 className="mt-3 font-serif text-3xl tracking-tight">{metrics.leadingChannel?.channel ?? "—"}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {metrics.leadingChannel
                ? `${formatMoney(metrics.leadingChannel.revenue)} net across ${metrics.leadingChannel.orders} orders.`
                : "Channel mix appears once orders land."}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
