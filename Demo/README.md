# Pulse

Pulse is a fictional revenue desk for retail teams. The marketing site and the Northwind Goods workspace read from one sample ledger. Dashboard figures are loaded from API routes, then searched, filtered, sorted, and paged in the browser.

## Scripts

```bash
npm run dev
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the workspace.

## Data

- `lib/ledger.ts` builds a deterministic order history anchored to 6 October 2026.
- `GET /api/metrics` returns revenue, users, conversion, orders, and charts.
- `GET /api/transactions` and `GET /api/customers` accept search, filters, sort, and pagination.

## States

- Loading skeletons show while a request is in flight. Refresh asks for the ledger again.
- An empty ledger appears when a search matches nothing, for example `zzzz`.
- The error state is at [/dashboard?fault=1](/dashboard?fault=1).

## Deploy

The app is a Next.js project and deploys on Vercel with the default settings.
