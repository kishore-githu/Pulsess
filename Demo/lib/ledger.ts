import { workspaces } from "@/lib/site";
import type {
  Channel,
  ChannelStat,
  Customer,
  CustomerPage,
  CustomerQuery,
  Metrics,
  PlanId,
  RangeKey,
  Segment,
  SeriesPoint,
  Transaction,
  TransactionPage,
  TransactionQuery,
  TxStatus,
} from "@/lib/types";

const DAY = 86_400_000;
/** Midnight UTC on 6 October 2026. The sample ledger ends on this day. */
const ANCHOR_DAY = Date.UTC(2026, 9, 6);

export const RANGE_DAYS: Record<RangeKey, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const FIRST = [
  "Imani", "Elias", "Nora", "Jonah", "Priya", "Mateo", "Hana", "Leif",
  "Amina", "Owen", "Sable", "Theo", "June", "Rafi", "Cleo", "Noor",
  "Idris", "Vera", "Samir", "Willa", "Kenji", "Freya", "Hugo", "Lale",
];

const LAST = [
  "Okoye", "Voss", "Pell", "Adler", "Shah", "Reyes", "Ito", "Nilsen",
  "Diallo", "Brooks", "Quill", "Marin", "Cho", "Santos", "Berg", "Rahman",
  "Lind", "Costa", "Park", "Abebe", "Moreau", "Novak", "Silva", "Hart",
];

const REGIONS = ["Lisbon", "Austin", "Kyoto", "Montreal", "Lagos", "Berlin", "Melbourne", "Oslo"];
const SEGMENTS: Segment[] = ["Subscriber", "Returning", "New", "Returning", "Subscriber", "New"];
const CHANNELS: Channel[] = ["Web", "iOS", "Shop", "Wholesale"];

type Person = {
  id: string;
  name: string;
  email: string;
  segment: Segment;
  region: string;
};

type RawTx = Transaction & { customerId: string };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted(rand: () => number, items: readonly Channel[], weights: number[]) {
  const roll = rand();
  let acc = 0;
  for (let i = 0; i < items.length; i += 1) {
    acc += weights[i];
    if (roll <= acc) return items[i];
  }
  return items[items.length - 1];
}

function orderAmount(rand: () => number) {
  const roll = rand();
  if (roll < 0.45) return Math.round((24 + rand() * 40) * 100);
  if (roll < 0.8) return Math.round((70 + rand() * 90) * 100);
  return Math.round((170 + rand() * 160) * 100);
}

function rotate<T>(items: readonly T[], shift: number) {
  const n = ((shift % items.length) + items.length) % items.length;
  return [...items.slice(n), ...items.slice(0, n)];
}

type LedgerProfile = {
  seed: number;
  historyDays: number;
  base: number;
  growth: number;
  weekend: number;
  people: number;
  nameShift: number;
  channelWeights: number[];
  fail: number;
  pending: number;
  refund: number;
  amountScale: number;
  seqStart: number;
  guardMax: number;
  joinedRecent: number[];
};

const PROFILES: Record<PlanId, LedgerProfile> = {
  signal: {
    seed: 0x51a1_0c,
    historyDays: 48,
    base: 14_000,
    growth: 6_000,
    weekend: 0.62,
    people: 10,
    nameShift: 8,
    channelWeights: [0.72, 0.18, 0.1, 0],
    fail: 0.09,
    pending: 0.08,
    refund: 0.04,
    amountScale: 0.62,
    seqStart: 800,
    guardMax: 8,
    joinedRecent: [20, 9],
  },
  rhythm: {
    seed: 0x5075_15e,
    historyDays: 180,
    base: 64_000,
    growth: 26_000,
    weekend: 0.72,
    people: 24,
    nameShift: 0,
    channelWeights: [0.48, 0.22, 0.22, 0.08],
    fail: 0.05,
    pending: 0.05,
    refund: 0.05,
    amountScale: 1,
    seqStart: 2400,
    guardMax: 16,
    joinedRecent: [72, 41, 15],
  },
  orchestra: {
    seed: 0x0c4e_57a,
    historyDays: 180,
    base: 210_000,
    growth: 140_000,
    weekend: 0.84,
    people: 24,
    nameShift: 11,
    channelWeights: [0.28, 0.16, 0.18, 0.38],
    fail: 0.03,
    pending: 0.04,
    refund: 0.08,
    amountScale: 2.15,
    seqStart: 9100,
    guardMax: 28,
    joinedRecent: [120, 60, 28],
  },
};

function buildLedger(plan: PlanId) {
  const profile = PROFILES[plan];
  const rand = mulberry32(profile.seed);
  const firstNames = rotate(FIRST, profile.nameShift);
  const lastNames = rotate(LAST, profile.nameShift + 3);
  const regions = rotate(REGIONS, profile.nameShift);
  const span = profile.historyDays - 1;
  const recentStart = profile.people - profile.joinedRecent.length;
  const people: Array<Person & { joinedAgo: number }> = firstNames.slice(0, profile.people).map((first, i) => {
    const last = lastNames[i];
    const name = `${first} ${last}`;
    return {
      id: `cus_${plan.slice(0, 1)}_${String(i + 1).padStart(3, "0")}`,
      name,
      email: `${first}.${last}@example.com`.toLowerCase(),
      segment: SEGMENTS[i % SEGMENTS.length],
      region: regions[i % regions.length],
      joinedAgo: i < recentStart ? span + 40 : profile.joinedRecent[i - recentStart],
    };
  });

  const transactions: RawTx[] = [];
  let seq = profile.seqStart;

  for (let day = span; day >= 0; day -= 1) {
    const eligible = people.filter((person) => person.joinedAgo >= day);
    if (eligible.length === 0) continue;
    const weekend = new Date(Date.UTC(2026, 9, 6 - day)).getUTCDay() % 6 === 0;
    const progress = span === 0 ? 1 : (span - day) / span;
    const target = Math.round((profile.base + progress * profile.growth) * (0.93 + rand() * 0.12) * (weekend ? profile.weekend : 1));
    let paid = 0;
    let guard = 0;

    while (paid < target && guard < profile.guardMax) {
      guard += 1;
      const person = eligible[Math.floor(rand() * eligible.length)];
      const roll = rand();
      let status: TxStatus = "paid";
      if (roll < profile.fail) status = "failed";
      else if (roll < profile.fail + profile.pending) status = "pending";
      else if (roll < profile.fail + profile.pending + profile.refund && paid > target * 0.55) status = "refunded";

      let amount = Math.max(900, Math.round(orderAmount(rand) * profile.amountScale));
      if (status === "refunded") amount = Math.min(amount, Math.round(6400 * profile.amountScale));
      if (status === "paid" && paid + amount > target * 1.08) amount = Math.max(1600, target - paid);
      if (status === "paid") paid += amount;

      const hour = 8 + Math.floor(rand() * 13);
      const minute = Math.floor(rand() * 60);
      seq += 1;
      transactions.push({
        id: `ord_${seq.toString(36)}`,
        customerId: person.id,
        customer: person.name,
        email: person.email,
        amount,
        status,
        channel: pickWeighted(rand, CHANNELS, profile.channelWeights),
        createdAt: new Date(Date.UTC(2026, 9, 6 - day, hour, minute, Math.floor(rand() * 60))).toISOString(),
      });
    }
  }

  transactions.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return { people, transactions };
}

const caches = new Map<PlanId, ReturnType<typeof buildLedger>>();

export function parsePlan(value: string | null): PlanId {
  if (value === "signal" || value === "rhythm" || value === "orchestra") return value;
  return "rhythm";
}

function ledger(plan: PlanId) {
  let hit = caches.get(plan);
  if (!hit) {
    hit = buildLedger(plan);
    caches.set(plan, hit);
  }
  return hit;
}

export function parseRange(value: string | null): RangeKey {
  if (value === "7d" || value === "30d" || value === "90d") return value;
  return "30d";
}

function bounds(range: RangeKey, periodsBack = 0) {
  const days = RANGE_DAYS[range];
  const end = ANCHOR_DAY + DAY - periodsBack * days * DAY;
  const start = end - days * DAY;
  return { start, end, days };
}

function inWindow(iso: string, start: number, end: number) {
  const time = new Date(iso).getTime();
  return time >= start && time < end;
}

function netRevenue(rows: RawTx[]) {
  return rows.reduce((sum, row) => {
    if (row.status === "paid") return sum + row.amount;
    if (row.status === "refunded") return sum - row.amount;
    return sum;
  }, 0);
}

function orderCount(rows: RawTx[]) {
  return rows.filter((row) => row.status !== "failed").length;
}

function conversion(rows: RawTx[]) {
  if (rows.length === 0) return 0;
  const paid = rows.filter((row) => row.status === "paid").length;
  return (paid / rows.length) * 100;
}

function delta(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
}

function formatWindow(start: number, endExclusive: number) {
  const end = endExclusive - DAY;
  const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

function summarize(rows: RawTx[]) {
  const users = new Set(rows.map((row) => row.customerId)).size;
  return {
    revenue: netRevenue(rows),
    users,
    conversion: conversion(rows),
    orders: orderCount(rows),
  };
}

export function getMetrics(range: RangeKey, plan: PlanId = "rhythm"): Metrics {
  const { transactions } = ledger(plan);
  const current = bounds(range, 0);
  const previous = bounds(range, 1);
  const currentRows = transactions.filter((row) => inWindow(row.createdAt, current.start, current.end));
  const previousRows = transactions.filter((row) => inWindow(row.createdAt, previous.start, previous.end));
  const now = summarize(currentRows);
  const then = summarize(previousRows);

  const series: SeriesPoint[] = [];
  for (let i = 0; i < current.days; i += 1) {
    const start = current.start + i * DAY;
    const end = start + DAY;
    const rows = currentRows.filter((row) => inWindow(row.createdAt, start, end));
    series.push({
      date: new Date(start).toISOString(),
      revenue: netRevenue(rows),
      orders: orderCount(rows),
      conversion: conversion(rows),
      refunds: rows.filter((row) => row.status === "refunded").reduce((sum, row) => sum + row.amount, 0),
    });
  }

  const channels: ChannelStat[] = CHANNELS.map((channel) => {
    const rows = currentRows.filter((row) => row.channel === channel);
    return { channel, revenue: netRevenue(rows), orders: orderCount(rows) };
  }).sort((a, b) => b.revenue - a.revenue);

  const quietest = series.reduce<SeriesPoint | null>((lowest, point) => {
    if (!lowest || point.revenue < lowest.revenue) return point;
    return lowest;
  }, null);

  return {
    range,
    workspace: workspaces[plan],
    label: formatWindow(current.start, current.end),
    previousLabel: formatWindow(previous.start, previous.end),
    kpis: {
      revenue: { value: now.revenue, delta: delta(now.revenue, then.revenue) },
      users: { value: now.users, delta: delta(now.users, then.users) },
      conversion: { value: now.conversion, delta: delta(now.conversion, then.conversion) },
      orders: { value: now.orders, delta: delta(now.orders, then.orders) },
    },
    series,
    channels,
    quietest: quietest ? { date: quietest.date, revenue: quietest.revenue } : null,
    leadingChannel: channels[0] ?? null,
  };
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    pageCount,
  };
}

export function getTransactions(query: TransactionQuery, plan: PlanId = "rhythm"): TransactionPage {
  const { transactions } = ledger(plan);
  const { start, end } = bounds(query.range, 0);
  const q = query.q.trim().toLowerCase();

  const filtered = transactions.filter((row) => {
    if (!inWindow(row.createdAt, start, end)) return false;
    if (query.status !== "all" && row.status !== query.status) return false;
    if (query.channel !== "all" && row.channel !== query.channel) return false;
    if (!q) return true;
    return (
      row.customer.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.id.toLowerCase().includes(q)
    );
  });

  filtered.sort((a, b) => {
    let cmp = 0;
    if (query.sort === "amount") cmp = a.amount - b.amount;
    else if (query.sort === "customer") cmp = a.customer.localeCompare(b.customer);
    else cmp = a.createdAt.localeCompare(b.createdAt);
    if (cmp === 0) cmp = a.id.localeCompare(b.id);
    return query.dir === "asc" ? cmp : -cmp;
  });

  const page = paginate(filtered, query.page, query.pageSize);
  return {
    ...page,
    items: page.items.map((row) => ({
      id: row.id,
      customer: row.customer,
      email: row.email,
      amount: row.amount,
      status: row.status,
      channel: row.channel,
      createdAt: row.createdAt,
    })),
  };
}

export function getCustomers(query: CustomerQuery, plan: PlanId = "rhythm"): CustomerPage {
  const { people, transactions } = ledger(plan);
  const { start, end } = bounds(query.range, 0);
  const q = query.q.trim().toLowerCase();

  const rows: Customer[] = people.flatMap((person) => {
    const mine = transactions.filter(
      (row) => row.customerId === person.id && inWindow(row.createdAt, start, end),
    );
    if (mine.length === 0) return [];
    const counted = mine.filter((row) => row.status !== "failed");
    const lastSeen = mine.reduce((latest, row) => (row.createdAt > latest ? row.createdAt : latest), mine[0].createdAt);
    return [{
      id: person.id,
      name: person.name,
      email: person.email,
      segment: person.segment,
      region: person.region,
      orders: counted.length,
      spend: netRevenue(mine),
      lastSeen,
    }];
  }).filter((person) => {
    if (query.segment !== "all" && person.segment !== query.segment) return false;
    if (!q) return true;
    return (
      person.name.toLowerCase().includes(q) ||
      person.email.toLowerCase().includes(q) ||
      person.region.toLowerCase().includes(q)
    );
  });

  rows.sort((a, b) => {
    let cmp = 0;
    if (query.sort === "spend") cmp = a.spend - b.spend;
    else if (query.sort === "orders") cmp = a.orders - b.orders;
    else if (query.sort === "name") cmp = a.name.localeCompare(b.name);
    else cmp = a.lastSeen.localeCompare(b.lastSeen);
    if (cmp === 0) cmp = a.name.localeCompare(b.name);
    return query.dir === "asc" ? cmp : -cmp;
  });

  return paginate(rows, query.page, query.pageSize);
}

export function getRecentTransactions(limit: number, plan: PlanId = "rhythm"): Transaction[] {
  const { transactions } = ledger(plan);
  return transactions.slice(-limit).reverse().map((row) => ({
    id: row.id,
    customer: row.customer,
    email: row.email,
    amount: row.amount,
    status: row.status,
    channel: row.channel,
    createdAt: row.createdAt,
  }));
}
