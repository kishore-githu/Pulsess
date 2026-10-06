import type { PlanId, Workspace } from "@/lib/types";

export const workspaces: Record<PlanId, Workspace> = {
  signal: {
    id: "signal",
    name: "Kite Post",
    plan: "Signal",
    note: "Founder shop · smaller tickets, mostly web",
  },
  rhythm: {
    id: "rhythm",
    name: "Northwind Goods",
    plan: "Rhythm",
    note: "Retail team · web, app, and the shop",
  },
  orchestra: {
    id: "orchestra",
    name: "Harbor Supply",
    plan: "Orchestra",
    note: "Several brands · wholesale in the mix",
  },
};

export const plans = [
  {
    id: "signal" as const,
    name: "Signal",
    monthly: 32,
    annual: 26,
    description: "For a founder who wants the live numbers without a finance stack.",
    featured: false,
    features: ["1 workspace", "30-day ledger", "Revenue, orders, conversion", "Weekly email digest"],
  },
  {
    id: "rhythm" as const,
    name: "Rhythm",
    monthly: 80,
    annual: 64,
    description: "For a retail team that shares one reading of the business.",
    featured: true,
    features: ["5 seats", "18-month ledger", "Channel and customer views", "Quiet anomaly notes", "Shared workspace"],
  },
  {
    id: "orchestra" as const,
    name: "Orchestra",
    monthly: 200,
    annual: 160,
    description: "For several brands that need history, roles, and a calmer close.",
    featured: false,
    features: ["Unlimited seats", "Full order history", "Warehouse sync", "Role permissions", "Onboarding with us"],
  },
];

export const faqs = [
  {
    q: "Is Pulse a real company?",
    a: "Pulse is a fictional product, built as a working demo. Northwind Goods is a sample retailer. The people, orders, and prices on this site are invented.",
  },
  {
    q: "Where do the dashboard numbers come from?",
    a: "Each pricing plan opens its own sample ledger: Kite Post, Northwind Goods, or Harbor Supply. The page requests /api/metrics, /api/transactions, and /api/customers with that plan. The tables are filled from those responses.",
  },
  {
    q: "What would a real workspace connect to?",
    a: "In the product story, Pulse listens to checkout, billing, and the store. This demo stays on the sample ledger and never calls a payment processor.",
  },
  {
    q: "Why are the numbers the same each visit?",
    a: "The ledger is anchored to 6 October 2026 and generated from a fixed seed. That keeps the demo stable while you search, sort, and change the date range.",
  },
  {
    q: "How do I see an empty ledger?",
    a: "Search for a name that is not in the sample, such as “zzzz”. Clear the search to come back to the full list.",
  },
  {
    q: "How do I see the error state?",
    a: "Open the workspace at /dashboard?fault=1. Pulse shows a failed request with a way back to the live ledger.",
  },
] as const;

export const steps = [
  {
    n: "01",
    title: "Connect the places you already sell",
    body: "Checkout, the shop, and billing land in one stream. Pulse does not ask the team to change how orders are taken.",
  },
  {
    n: "02",
    title: "Every event keeps its customer",
    body: "A payment, a refund, and a failed attempt stay attached to a person, a channel, and a time. The totals are calculated from those events.",
  },
  {
    n: "03",
    title: "Open one desk and act",
    body: "Revenue, customers, conversion, and orders sit in the same workspace. The change versus the previous window is already on the card.",
  },
] as const;

export const quotes = [
  {
    quote: "We stopped waiting for Monday’s export. The morning starts with what actually moved overnight.",
    name: "Imani Okoye",
    role: "Operations, Harbor Supply",
  },
  {
    quote: "Conversion used to be a monthly argument. Now the channel split is on the desk before anyone has a theory.",
    name: "Elias Voss",
    role: "Growth, Fieldnote",
  },
  {
    quote: "Refunds used to hide inside the revenue line. The leak was obvious the first week we opened Pulse.",
    name: "Nora Pell",
    role: "Founder, Kite Post",
  },
] as const;

export const marks = ["Northwind", "Harbor Supply", "Fieldnote", "Kite Post", "Marlowe", "Lumen & Co"];
