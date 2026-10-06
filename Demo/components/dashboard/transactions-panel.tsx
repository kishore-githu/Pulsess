"use client";

import { useEffect, useState } from "react";
import { formatMoney, formatWhen } from "@/lib/format";
import type { Channel, PlanId, RangeKey, TransactionPage, TxStatus } from "@/lib/types";
import { EmptyState, ErrorState, Pagination, Skeleton } from "@/components/dashboard/states";
import { usePage, useResource } from "@/components/dashboard/use-resource";

const statuses: Array<TxStatus | "all"> = ["all", "paid", "pending", "refunded", "failed"];
const channels: Array<Channel | "all"> = ["all", "Web", "iOS", "Shop", "Wholesale"];

const statusClass: Record<TxStatus, string> = {
  paid: "bg-mist text-forest-mid",
  pending: "bg-sand text-amber",
  refunded: "bg-paper text-muted ring-1 ring-line",
  failed: "bg-[#fde8e4] text-pulse-dark",
};

export function TransactionsPanel({ range, plan, ready }: { range: RangeKey; plan: PlanId; ready: boolean }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TxStatus | "all">("all");
  const [channel, setChannel] = useState<Channel | "all">("all");
  const [sort, setSort] = useState<"createdAt" | "amount" | "customer">("createdAt");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const filterKey = `${plan}|${range}|${query}|${status}|${channel}|${sort}|${dir}`;
  const { page, setPage } = usePage(filterKey);

  const params = new URLSearchParams({
    plan,
    range,
    q: query,
    status,
    channel,
    sort,
    dir,
    page: String(page),
    pageSize: "8",
  });
  const url = ready ? `/api/transactions?${params.toString()}` : null;
  const result = useResource<TransactionPage>(url, 0, true);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setQuery((current) => (current === input ? current : input));
    }, 280);
    return () => window.clearTimeout(id);
  }, [input]);

  function chooseSort(column: "createdAt" | "amount" | "customer") {
    if (sort === column) {
      setDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSort(column);
    setDir(column === "customer" ? "asc" : "desc");
  }

  const filtered = query.length > 0 || status !== "all" || channel !== "all";

  return (
    <section id="ledger" className="scroll-mt-24 rounded-3xl bg-card ring-1 ring-line" aria-busy={result.status === "loading" || result.refreshing}>
      <div className="flex flex-col gap-4 border-b border-line px-4 py-4 sm:px-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl tracking-tight">Ledger</h2>
          <p className="mt-1 text-sm text-muted">Orders in this window. Search by name, email, or order id.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <label className="sr-only" htmlFor="order-search">Search orders</label>
          <input
            id="order-search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search orders"
            className="h-11 rounded-full border border-line bg-paper px-4 text-base sm:w-56 sm:text-sm"
          />
          <Select label="Status" value={status} onChange={(value) => setStatus(value as TxStatus | "all")} options={statuses.map((item) => ({ value: item, label: item === "all" ? "All statuses" : item }))} />
          <Select label="Channel" value={channel} onChange={(value) => setChannel(value as Channel | "all")} options={channels.map((item) => ({ value: item, label: item === "all" ? "All channels" : item }))} />
          <Select
            label="Sort"
            value={`${sort}:${dir}`}
            onChange={(value) => {
              const [nextSort, nextDir] = value.split(":");
              setSort(nextSort as typeof sort);
              setDir(nextDir as typeof dir);
            }}
            options={[
              { value: "createdAt:desc", label: "Newest" },
              { value: "createdAt:asc", label: "Oldest" },
              { value: "amount:desc", label: "Highest amount" },
              { value: "amount:asc", label: "Lowest amount" },
              { value: "customer:asc", label: "Customer A–Z" },
            ]}
          />
        </div>
      </div>

      {result.status === "loading" && !result.data ? <TableSkeleton /> : null}
      {result.status === "error" ? <ErrorState message={result.error ?? "The ledger could not be loaded."} onRetry={result.retry} /> : null}
      {result.data && result.data.total === 0 ? (
        <EmptyState
          title="Nothing on this frequency"
          body="No orders match this search. Try another name, or clear the filters to see the window again."
          action={filtered ? (
            <button
              type="button"
              className="h-11 rounded-full bg-forest px-5 text-sm text-paper"
              onClick={() => {
                setInput("");
                setQuery("");
                setStatus("all");
                setChannel("all");
              }}
            >
              Clear filters
            </button>
          ) : undefined}
        />
      ) : null}
      {result.data && result.data.total > 0 ? (
        <div className={result.refreshing ? "opacity-60" : undefined}>
          <ul className="divide-y divide-line md:hidden">
            {result.data.items.map((item) => (
              <li key={item.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{item.customer}</p>
                    <p className="truncate text-sm text-muted">{item.email}</p>
                  </div>
                  <p className="shrink-0 tabular-nums font-medium">{formatMoney(item.amount, 2)}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  <StatusPill status={item.status} />
                  <span className="text-muted">{item.channel}</span>
                  <span className="text-muted">{formatWhen(item.createdAt)}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">Orders for the selected window</caption>
              <thead className="text-xs uppercase tracking-[0.12em] text-muted">
                <tr className="border-b border-line">
                  <Sortable label="Customer" column="customer" sort={sort} dir={dir} onSort={chooseSort} />
                  <th className="px-3 py-3 font-medium" scope="col">Channel</th>
                  <th className="px-3 py-3 font-medium" scope="col">Status</th>
                  <Sortable label="Amount" column="amount" sort={sort} dir={dir} onSort={chooseSort} align="right" />
                  <Sortable label="When (UTC)" column="createdAt" sort={sort} dir={dir} onSort={chooseSort} align="right" />
                </tr>
              </thead>
              <tbody>
                {result.data.items.map((item) => (
                  <tr key={item.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3">
                      <span className="block font-medium">{item.customer}</span>
                      <span className="text-xs text-muted">{item.email} · {item.id}</span>
                    </td>
                    <td className="px-3 py-3">{item.channel}</td>
                    <td className="px-3 py-3"><StatusPill status={item.status} /></td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatMoney(item.amount, 2)}</td>
                    <td className="px-5 py-3 text-right text-muted">{formatWhen(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={result.data.page}
            pageCount={result.data.pageCount}
            total={result.data.total}
            pageSize={result.data.pageSize}
            onPage={setPage}
          />
        </div>
      ) : null}
    </section>
  );
}

function StatusPill({ status }: { status: TxStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs capitalize ${statusClass[status]}`}>{status}</span>;
}

function Sortable({
  label,
  column,
  sort,
  dir,
  onSort,
  align = "left",
}: {
  label: string;
  column: "createdAt" | "amount" | "customer";
  sort: string;
  dir: "asc" | "desc";
  onSort: (column: "createdAt" | "amount" | "customer") => void;
  align?: "left" | "right";
}) {
  const active = sort === column;
  return (
    <th className={`px-5 py-3 font-medium ${align === "right" ? "text-right" : ""}`} scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}>
      <button type="button" className="uppercase tracking-[0.12em] hover:text-ink" onClick={() => onSort(column)}>
        {label}{active ? (dir === "asc" ? " ↑" : " ↓") : ""}
      </button>
    </th>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
      <label>
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-full border border-line bg-paper px-4 text-base capitalize sm:w-auto sm:text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3 p-5" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-12" />
      ))}
    </div>
  );
}
