import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Northwind workspace",
  description: "Live revenue, customers, conversion, and orders for the Northwind Goods sample ledger.",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <DashboardShell />
    </Suspense>
  );
}

function DashboardFallback() {
  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[240px_1fr]">
      <div className="hidden bg-forest lg:block" />
      <div className="space-y-4 px-4 py-5 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="skeleton h-32 rounded-3xl" />
          ))}
        </div>
        <div className="skeleton h-72 rounded-3xl" />
        <div className="skeleton h-80 rounded-3xl" />
      </div>
    </div>
  );
}
