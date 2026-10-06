"use client";

import { useEffect, useState } from "react";
import { formatMoney, formatWhen } from "@/lib/format";
import type { CustomerPage, PlanId, RangeKey, Segment } from "@/lib/types";
import { EmptyState, ErrorState, Pagination, Skeleton } from "@/components/dashboard/states";
import { Select } from "@/components/dashboard/transactions-panel";
import { usePage, useResource } from "@/components/dashboard/use-resource";

const segments: Array<Segment | "all"> = ["all", "New", "Returning", "Subscriber"];

export function CustomersPanel({ range, plan, ready }: { range: RangeKey; plan: PlanId; ready: boolean }) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState<Segment | "all">("all");
  const [sort, setSort] = useState<"spend" | "orders" | "name" | "lastSeen">("spend");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const filterKey = `${plan}|${range}|${query}|${segment}|${sort}|${dir}`;
  const { page, setPage } = usePage(filterKey);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setQuery((current) => (current === input ? current : input));
    }, 280);
    return () => window.clearTimeout(id);
  }, [input]);

  const params = new URLSearchParams({
    plan,
    range,
    q: query,
    segment,
    sort,
    dir,
    page: String(page),
    pageSize: "6",
  });
  const result = useResource<CustomerPage>(ready ? `/api/customers?${params.toString()}` : null, 0, true);
  const filtered = query.length > 0 || segment !== "all";

  function chooseSort(column: typeof sort) {
    if (sort === column) {
      setDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSort(column);
    setDir(column === "name" ? "asc" : "desc");
  }

  return (
    <section id="customers" className="scroll-mt-24 rounded-3xl bg-card ring-1 ring-line" aria-busy={result.status === "loading" || result.refreshing}>
      <div className="flex flex-col gap-4 border-b border-line px-4 py-4 sm:px-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl tracking-tight">Customers</h2>
          <p className="mt-1 text-sm text-muted">People with an order in this window, and what they spent.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <label className="sr-only" htmlFor="customer-search">Search customers</label>
          <input
            id="customer-search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Search customers"
            className="h-11 rounded-full border border-line bg-paper px-4 text-base sm:w-56 sm:text-sm"
          />
          <Select
            label="Segment"
            value={segment}
            onChange={(value) => setSegment(value as Segment | "all")}
            options={segments.map((item) => ({ value: item, label: item === "all" ? "All segments" : item }))}
          />
          <Select
            label="Sort customers"
            value={`${sort}:${dir}`}
            onChange={(value) => {
              const [nextSort, nextDir] = value.split(":");
              setSort(nextSort as typeof sort);
              setDir(nextDir as typeof dir);
            }}
            options={[
              { value: "spend:desc", label: "Highest spend" },
              { value: "spend:asc", label: "Lowest spend" },
              { value: "orders:desc", label: "Most orders" },
              { value: "name:asc", label: "Name A–Z" },
              { value: "lastSeen:desc", label: "Latest order" },
            ]}
          />
        </div>
      </div>

      {result.status === "loading" && !result.data ? (
        <div className="space-y-3 p-5" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-12" />)}
        </div>
      ) : null}
      {result.status === "error" ? <ErrorState message={result.error ?? "Customers could not be loaded."} onRetry={result.retry} /> : null}
      {result.data && result.data.total === 0 ? (
        <EmptyState
          title="No customers in view"
          body="Nobody in this window matches. Clear the search to see everyone who ordered."
          action={filtered ? (
            <button type="button" className="h-11 rounded-full bg-forest px-5 text-sm text-paper" onClick={() => { setInput(""); setQuery(""); setSegment("all"); }}>
              Clear filters
            </button>
          ) : undefined}
        />
      ) : null}
      {result.data && result.data.total > 0 ? (
        <div className={result.refreshing ? "opacity-60" : undefined}>
          <ul className="divide-y divide-line md:hidden">
            {result.data.items.map((person) => (
              <li key={person.id} className="px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted">{person.region} · {person.segment}</p>
                  </div>
                  <p className="tabular-nums font-medium">{formatMoney(person.spend)}</p>
                </div>
                <p className="mt-2 text-sm text-muted">{person.orders} orders · last {formatWhen(person.lastSeen)}</p>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Customers for the selected window</caption>
              <thead className="text-xs uppercase tracking-[0.12em] text-muted">
                <tr className="border-b border-line">
                  <SortHead label="Customer" column="name" sort={sort} dir={dir} onSort={chooseSort} />
                  <th className="px-3 py-3 font-medium" scope="col">Segment</th>
                  <SortHead label="Orders" column="orders" sort={sort} dir={dir} onSort={chooseSort} />
                  <SortHead label="Spend" column="spend" sort={sort} dir={dir} onSort={chooseSort} align="right" />
                  <SortHead label="Last order" column="lastSeen" sort={sort} dir={dir} onSort={chooseSort} align="right" />
                </tr>
              </thead>
              <tbody>
                {result.data.items.map((person) => (
                  <tr key={person.id} className="border-b border-line last:border-0">
                    <td className="px-5 py-3">
                      <span className="block font-medium">{person.name}</span>
                      <span className="text-xs text-muted">{person.email} · {person.region}</span>
                    </td>
                    <td className="px-3 py-3">{person.segment}</td>
                    <td className="px-3 py-3 tabular-nums">{person.orders}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatMoney(person.spend)}</td>
                    <td className="px-5 py-3 text-right text-muted">{formatWhen(person.lastSeen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={result.data.page} pageCount={result.data.pageCount} total={result.data.total} pageSize={result.data.pageSize} onPage={setPage} />
        </div>
      ) : null}
    </section>
  );
}

function SortHead({
  label,
  column,
  sort,
  dir,
  onSort,
  align = "left",
}: {
  label: string;
  column: "spend" | "orders" | "name" | "lastSeen";
  sort: string;
  dir: "asc" | "desc";
  onSort: (column: "spend" | "orders" | "name" | "lastSeen") => void;
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
