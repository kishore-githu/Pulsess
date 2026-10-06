export type RangeKey = "7d" | "30d" | "90d";

export type PlanId = "signal" | "rhythm" | "orchestra";

export type Workspace = {
  id: PlanId;
  name: string;
  plan: string;
  note: string;
};

export type TxStatus = "paid" | "pending" | "refunded" | "failed";

export type Channel = "Web" | "iOS" | "Shop" | "Wholesale";

export type Segment = "New" | "Returning" | "Subscriber";

export type SeriesPoint = {
  date: string;
  revenue: number;
  orders: number;
  conversion: number;
  refunds: number;
};

export type Kpi = {
  value: number;
  delta: number;
};

export type ChannelStat = {
  channel: Channel;
  revenue: number;
  orders: number;
};

export type Metrics = {
  range: RangeKey;
  workspace: Workspace;
  label: string;
  previousLabel: string;
  kpis: {
    revenue: Kpi;
    users: Kpi;
    conversion: Kpi;
    orders: Kpi;
  };
  series: SeriesPoint[];
  channels: ChannelStat[];
  quietest: { date: string; revenue: number } | null;
  leadingChannel: ChannelStat | null;
};

export type Transaction = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: TxStatus;
  channel: Channel;
  createdAt: string;
};

export type TransactionQuery = {
  range: RangeKey;
  q: string;
  status: TxStatus | "all";
  channel: Channel | "all";
  sort: "createdAt" | "amount" | "customer";
  dir: "asc" | "desc";
  page: number;
  pageSize: number;
};

export type TransactionPage = {
  items: Transaction[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  segment: Segment;
  region: string;
  orders: number;
  spend: number;
  lastSeen: string;
};

export type CustomerQuery = {
  range: RangeKey;
  q: string;
  segment: Segment | "all";
  sort: "spend" | "orders" | "name" | "lastSeen";
  dir: "asc" | "desc";
  page: number;
  pageSize: number;
};

export type CustomerPage = {
  items: Customer[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};
