const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const moneyExact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dayLabel = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatMoney(cents: number, digits: 0 | 2 = 0) {
  return (digits === 0 ? money : moneyExact).format(cents / 100);
}

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

export function formatDelta(value: number) {
  const rounded = value.toFixed(1);
  if (value > 0) return `+${rounded}%`;
  return `${rounded}%`;
}

export function formatDay(iso: string) {
  return dayLabel.format(new Date(iso));
}

export function formatWhen(iso: string) {
  return dateTime.format(new Date(iso));
}
