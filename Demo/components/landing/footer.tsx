import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Pulse is a fictional revenue desk. The Northwind ledger is sample data for this demo.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="hover:text-forest-mid" href="#product">Product</a></li>
            <li><a className="hover:text-forest-mid" href="#how">How it works</a></li>
            <li><a className="hover:text-forest-mid" href="#pricing">Pricing</a></li>
            <li><a className="hover:text-forest-mid" href="#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">Workspace</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-forest-mid" href="/dashboard">Live demo</Link></li>
            <li><Link className="hover:text-forest-mid" href="/dashboard?fault=1">Error state</Link></li>
            <li><a className="hover:text-forest-mid" href="mailto:hello@pulse.example">hello@pulse.example</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-line px-5 py-5 text-xs text-muted sm:flex-row sm:justify-between sm:px-8">
        <p>© 2026 Pulse. A demo, not a company.</p>
        <p>Sample orders through 6 October 2026.</p>
      </div>
    </footer>
  );
}
