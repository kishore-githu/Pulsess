import type { ReactNode } from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function ErrorState({
  message,
  onRetry,
  action,
}: {
  message: string;
  onRetry?: () => void;
  action?: ReactNode;
}) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-16 text-center">
      <svg viewBox="0 0 160 48" className="h-12 w-40 text-pulse" aria-hidden="true">
        <path d="M2 24 H48 L58 24 L68 8 L80 40 L92 24 H158" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="92" cy="24" r="3" fill="currentColor" />
      </svg>
      <h3 className="mt-4 font-serif text-3xl tracking-tight">The signal dropped</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{message}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <button type="button" onClick={onRetry} className="h-11 rounded-full bg-forest px-5 text-sm text-paper hover:bg-forest-mid">
            Try again
          </button>
        ) : null}
        {action}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <svg viewBox="0 0 160 48" className="h-12 w-40 text-muted" aria-hidden="true">
        <path d="M2 24 H158" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 7" />
      </svg>
      <h3 className="mt-4 font-serif text-3xl tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPage: (page: number) => void;
}) {
  if (total === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const length = Math.min(5, pageCount);
  let windowStart = Math.max(1, page - 2);
  if (windowStart + length - 1 > pageCount) windowStart = Math.max(1, pageCount - length + 1);
  const pages = Array.from({ length }, (_, index) => windowStart + index);

  return (
    <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-sm text-muted" aria-live="polite">
        Showing {start}–{end} of {total}
      </p>
      <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
        <button type="button" className="page-btn" onClick={() => onPage(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        {pages.map((number) => (
          <button
            key={number}
            type="button"
            className={`page-btn min-w-11 ${number === page ? "bg-ink text-paper" : ""}`}
            aria-current={number === page ? "page" : undefined}
            onClick={() => onPage(number)}
          >
            {number}
          </button>
        ))}
        <button type="button" className="page-btn" onClick={() => onPage(page + 1)} disabled={page >= pageCount}>
          Next
        </button>
      </nav>
    </div>
  );
}
