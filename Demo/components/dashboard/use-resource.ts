"use client";

import { useEffect, useState } from "react";

type ResourceState<T> = {
  data: T | null;
  error: string | null;
  key: string | null;
};

export function useResource<T>(url: string | null, reloadKey = 0, keepPrevious = false) {
  const [state, setState] = useState<ResourceState<T>>({ data: null, error: null, key: null });
  const [attempt, setAttempt] = useState(0);
  const requestKey = url ? `${url}|${reloadKey}|${attempt}` : null;
  const matches = state.key === requestKey && requestKey !== null;

  useEffect(() => {
    if (!url || !requestKey) return;
    const ctrl = new AbortController();
    let ignore = false;
    const key = requestKey;

    fetch(url, { signal: ctrl.signal, cache: "no-store" })
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as { error?: string } | T | null;
        if (!response.ok) {
          const message = body && typeof body === "object" && "error" in body && typeof body.error === "string"
            ? body.error
            : "The ledger could not be loaded.";
          throw new Error(message);
        }
        return body as T;
      })
      .then((data) => {
        if (!ignore) setState({ data, error: null, key });
      })
      .catch((err: unknown) => {
        if (ignore || (err instanceof DOMException && err.name === "AbortError")) return;
        const message = err instanceof Error ? err.message : "The ledger could not be loaded.";
        if (!ignore) setState({ data: null, error: message, key });
      });

    return () => {
      ignore = true;
      ctrl.abort();
    };
  }, [url, requestKey]);

  const data = matches ? state.data : keepPrevious ? state.data : null;
  const error = matches ? state.error : null;
  const status = !requestKey ? "loading" : matches ? (error ? "error" : "ready") : "loading";

  return {
    status,
    data,
    error,
    refreshing: Boolean(keepPrevious && !matches && state.data && !error),
    retry: () => setAttempt((value) => value + 1),
  } as const;
}

export function usePage(filterKey: string) {
  const [state, setState] = useState({ filterKey, page: 1 });
  const page = state.filterKey === filterKey ? state.page : 1;
  return {
    page,
    setPage: (next: number) => setState({ filterKey, page: next }),
  };
}
