import type { Channel, Segment, TxStatus } from "@/lib/types";

const STATUSES = new Set<TxStatus>(["paid", "pending", "refunded", "failed"]);
const CHANNELS = new Set<Channel>(["Web", "iOS", "Shop", "Wholesale"]);
const SEGMENTS = new Set<Segment>(["New", "Returning", "Subscriber"]);

export function wait(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parsePage(value: string | null) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, 10_000);
}

export function parsePageSize(value: string | null, fallback: number) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) return fallback;
  return Math.min(n, 24);
}

export function parseStatus(value: string | null): TxStatus | "all" {
  if (value && STATUSES.has(value as TxStatus)) return value as TxStatus;
  return "all";
}

export function parseChannel(value: string | null): Channel | "all" {
  if (value && CHANNELS.has(value as Channel)) return value as Channel;
  return "all";
}

export function parseSegment(value: string | null): Segment | "all" {
  if (value && SEGMENTS.has(value as Segment)) return value as Segment;
  return "all";
}

export function parseDir(value: string | null): "asc" | "desc" {
  return value === "asc" ? "asc" : "desc";
}

export function clampQuery(value: string | null) {
  return (value ?? "").slice(0, 80);
}

export function isFault(value: string | null) {
  return value === "1";
}

export function faultResponse() {
  return Response.json(
    { error: "The signal dropped before the ledger could respond." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}

export function json(body: unknown) {
  return Response.json(body, {
    headers: { "Cache-Control": "private, max-age=30" },
  });
}

export function parseTxSort(value: string | null): "createdAt" | "amount" | "customer" {
  if (value === "amount" || value === "customer" || value === "createdAt") return value;
  return "createdAt";
}

export function parseCustomerSort(value: string | null): "spend" | "orders" | "name" | "lastSeen" {
  if (value === "spend" || value === "orders" || value === "name" || value === "lastSeen") return value;
  return "spend";
}
