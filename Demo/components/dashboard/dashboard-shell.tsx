"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/logo";
import { ChannelChart, InsightRow, KpiGrid, RevenueChart } from "@/components/dashboard/charts";
import { CustomersPanel } from "@/components/dashboard/customers-panel";
import { ErrorState } from "@/components/dashboard/states";
import { TransactionsPanel } from "@/components/dashboard/transactions-panel";
import { useResource } from "@/components/dashboard/use-resource";
import { workspaces } from "@/lib/site";
import type { Metrics, PlanId, RangeKey } from "@/lib/types";

function readPlan(value: string | null): PlanId {
  if (value === "signal" || value === "rhythm" || value === "orchestra") return value;
  return "rhythm";
}

const ranges: { id: RangeKey; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
];

export function DashboardShell() {
  const params = useSearchParams();
  const fault = params.get("fault") === "1";
  const plan = readPlan(params.get("plan"));
  const workspace = workspaces[plan];
  const [range, setRange] = useState<RangeKey>("30d");
  const [open, setOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const metrics = useResource<Metrics>(`/api/metrics?range=${range}&plan=${plan}${fault ? "&fault=1" : ""}`, reloadKey);
  const loading = metrics.status === "loading" && !metrics.data;

  return (
    <div id="content" className="min-h-screen bg-paper text-ink lg:grid lg:grid-cols-[240px_1fr]">
      {open ? (
        <button type="button" className="fixed inset-0 z-30 bg-ink/40 lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} />
      ) : null}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-forest px-5 py-6 text-paper transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <Link href="/" aria-label="Pulse home"><Logo light /></Link>
        <p className="mt-8 text-xs uppercase tracking-[0.16em] text-paper/50">Workspace</p>
        <p className="mt-2 font-serif text-2xl tracking-tight">{workspace.name}</p>
        <p className="mt-1 text-sm text-paper/65">{workspace.plan} plan · {workspace.note}</p>
        <nav className="mt-8 space-y-1 text-sm" aria-label="Workspace">
          <a className="block rounded-xl bg-white/10 px-3 py-2.5" href="#overview" onClick={() => setOpen(false)}>Overview</a>
          <a className="block rounded-xl px-3 py-2.5 text-paper/80 hover:bg-white/10" href="#ledger" onClick={() => setOpen(false)}>Ledger</a>
          <a className="block rounded-xl px-3 py-2.5 text-paper/80 hover:bg-white/10" href="#customers" onClick={() => setOpen(false)}>Customers</a>
        </nav>
        <div className="mt-auto rounded-2xl bg-white/10 px-3 py-3 text-xs leading-relaxed text-paper/70">
          Figures are calculated from the sample ledger for the selected window.
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur-md sm:px-6">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <span className="flex w-4 flex-col gap-1.5" aria-hidden="true">
              <span className="h-px bg-ink" />
              <span className="h-px bg-ink" />
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Overview</p>
            <p className="truncate text-sm">
              {metrics.status === "error"
                ? "Signal dropped"
                : metrics.refreshing
                  ? "Updating the window"
                  : metrics.data
                    ? metrics.data.label
                    : "Loading the ledger"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div role="group" aria-label="Date range" className="flex rounded-full bg-sand p-1">
              {ranges.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={range === item.id}
                  className={`h-9 rounded-full px-3 text-sm ${range === item.id ? "bg-card text-ink shadow-sm" : "text-muted"}`}
                  onClick={() => setRange(item.id)}
                >
                  <span className="sm:hidden">{item.id}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="h-11 rounded-full border border-line px-4 text-sm hover:bg-sand"
              onClick={() => setReloadKey((value) => value + 1)}
            >
              Refresh
            </button>
          </div>
        </header>

        <main id="overview" className="scroll-mt-24 space-y-4 px-4 py-5 sm:px-6 sm:py-6">
          {fault && metrics.status === "error" ? (
            <div className="rounded-3xl bg-card ring-1 ring-line">
              <ErrorState
                message={metrics.error ?? "The signal dropped before the ledger could respond."}
                action={
                  <Link href={`/dashboard?plan=${plan}`} className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm">
                    Return to the live ledger
                  </Link>
                }
              />
            </div>
          ) : (
            <>
              {metrics.status === "error" ? (
                <div className="rounded-3xl bg-card ring-1 ring-line">
                  <ErrorState message={metrics.error ?? "Metrics could not be loaded."} onRetry={metrics.retry} />
                </div>
              ) : (
                <>
                  <KpiGrid metrics={metrics.data} loading={loading} />
                  <div className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
                    <RevenueChart metrics={metrics.data} loading={loading} />
                    <ChannelChart metrics={metrics.data} loading={loading} />
                  </div>
                  {metrics.data ? <InsightRow metrics={metrics.data} /> : null}
                </>
              )}
              <TransactionsPanel range={range} plan={plan} ready={!fault} />
              <CustomersPanel range={range} plan={plan} ready={!fault} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
