import Link from "next/link";
import { LiveTape } from "@/components/landing/live-tape";
import { formatMoney, formatPercent } from "@/lib/format";
import type { Metrics, Transaction } from "@/lib/types";

export function Hero({ metrics, recent }: { metrics: Metrics; recent: Transaction[] }) {
  return (
    <section className="hero-glow relative min-w-0 overflow-x-clip">
      <div className="mx-auto grid w-full min-w-0 max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:pb-24 lg:pt-20">
        <div className="min-w-0">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-forest-mid">Live revenue intelligence</p>
          <h1 className="mt-4 max-w-full text-balance font-serif text-[2.65rem] leading-[0.92] tracking-[-0.035em] text-ink sm:text-[clamp(3.15rem,7vw,5.5rem)]">
            See the sale <em className="text-pulse">before the spreadsheet.</em>
          </h1>
          <p className="mt-6 max-w-full text-lg leading-relaxed text-balance text-muted sm:max-w-md">
            Pulse keeps revenue, customers, conversion, and orders in one signal. Current enough to act on. Calm enough to trust at the morning meeting.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full bg-forest px-6 text-sm text-paper hover:bg-forest-mid"
            >
              Open the live demo
            </Link>
            <a
              href="#how"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink/15 px-6 text-sm text-ink hover:bg-sand"
            >
              See how it works
            </a>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-2 border-t border-line pt-6">
            <div className="min-w-0">
              <dt className="text-xs text-muted">30-day revenue</dt>
              <dd className="mt-1 font-serif text-[1.35rem] tabular-nums leading-none tracking-tight sm:text-3xl">{formatMoney(metrics.kpis.revenue.value)}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-muted">Conversion</dt>
              <dd className="mt-1 font-serif text-[1.35rem] tabular-nums leading-none tracking-tight sm:text-3xl">{formatPercent(metrics.kpis.conversion.value)}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-xs text-muted">Orders</dt>
              <dd className="mt-1 font-serif text-[1.35rem] tabular-nums leading-none tracking-tight sm:text-3xl">{metrics.kpis.orders.value}</dd>
            </div>
          </dl>
        </div>

        <div className="relative min-w-0">
          <div className="rounded-[28px] bg-forest p-4 text-paper shadow-[0_30px_70px_rgba(18,56,46,0.22)] sm:p-5">
            <div className="flex items-center justify-between px-2 pb-1 text-xs text-paper/65">
              <span>Northwind Goods</span>
              <span className="inline-flex items-center gap-2">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#9ddec0]" />
                Live ledger
              </span>
            </div>
            <svg viewBox="0 0 520 92" className="mt-1 h-16 w-full" role="img" aria-label="A pulse of recent order activity">
              <path
                d="M0 48 H70 L88 48 L104 22 L122 74 L140 48 H210 L228 48 L246 14 L268 78 L286 48 H360 L378 48 L396 26 L414 70 L432 48 H520"
                fill="none"
                stroke="rgba(243,238,228,0.28)"
                strokeWidth="2"
              />
              <path
                className="wave-path"
                d="M0 48 H70 L88 48 L104 22 L122 74 L140 48 H210 L228 48 L246 14 L268 78 L286 48 H360 L378 48 L396 26 L414 70 L432 48 H520"
                fill="none"
                stroke="#F3EEE4"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <LiveTape events={recent} />
            <p className="mx-2 mt-3 w-fit rounded-full bg-card px-3 py-1.5 text-xs text-ink">
              Sample ledger · {metrics.label}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
