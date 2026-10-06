import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="grid min-h-screen place-items-center bg-paper px-6 text-center">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-forest-mid">404</p>
        <h1 className="mt-3 font-serif text-5xl tracking-tight">This page left the chart.</h1>
        <p className="mx-auto mt-3 max-w-sm text-muted">Pulse keeps a home page and a live demo workspace.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/" className="inline-flex h-11 items-center rounded-full bg-forest px-5 text-sm text-paper">Back home</Link>
          <Link href="/dashboard" className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm">Open the demo</Link>
        </div>
      </div>
    </main>
  );
}
