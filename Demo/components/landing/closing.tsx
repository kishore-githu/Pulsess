import Link from "next/link";

export function Closing() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-forest px-6 py-14 text-paper sm:px-12 sm:py-16">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-[#9ddec0]">The Northwind workspace</p>
        <h2 className="mt-4 max-w-xl font-serif text-[2.6rem] leading-[1.02] tracking-tight sm:text-6xl">
          Put a live signal on the desk.
        </h2>
        <p className="mt-4 max-w-lg text-paper/75">
          Open the sample retailer. Revenue, customers, conversion, and orders are already moving through the ledger.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-paper px-6 text-sm text-forest hover:bg-sand"
        >
          Open the live demo
        </Link>
      </div>
    </section>
  );
}
