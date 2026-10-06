"use client";

import Link from "next/link";
import { useState } from "react";
import { plans, workspaces } from "@/lib/site";

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="scroll-mt-20 border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-forest-mid">Pricing</p>
            <h2 className="mt-3 font-serif text-[2.4rem] leading-[1.05] tracking-tight sm:text-5xl">Simple prices that stay still.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Each plan opens a different sample workspace. Annual billing is shown as a monthly equivalent.
            </p>
          </div>
          <div className="inline-flex h-12 items-center self-start rounded-full bg-sand p-1" role="group" aria-label="Billing period">
            <button
              type="button"
              aria-pressed={!annual}
              className={`h-10 rounded-full px-4 text-sm ${annual ? "text-muted" : "bg-card text-ink shadow-sm"}`}
              onClick={() => setAnnual(false)}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={annual}
              className={`h-10 rounded-full px-4 text-sm ${annual ? "bg-card text-ink shadow-sm" : "text-muted"}`}
              onClick={() => setAnnual(true)}
            >
              Annual
            </button>
          </div>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = annual ? plan.annual : plan.monthly;
            const workspace = workspaces[plan.id];
            return (
              <article
                key={plan.id}
                className={`flex flex-col rounded-[28px] p-6 sm:p-7 ${plan.featured ? "bg-forest text-paper" : "bg-card ring-1 ring-line"}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-3xl tracking-tight">{plan.name}</h3>
                  {plan.featured ? <span className="rounded-full bg-paper/15 px-3 py-1 text-xs">Most teams</span> : null}
                </div>
                <p className={`mt-3 text-sm leading-relaxed ${plan.featured ? "text-paper/75" : "text-muted"}`}>{plan.description}</p>
                <p className={`mt-3 text-xs uppercase tracking-[0.14em] ${plan.featured ? "text-[#9ddec0]" : "text-forest-mid"}`}>
                  {workspace.name}
                </p>
                <p className="mt-6 flex items-end gap-1">
                  <span className="font-serif text-5xl tabular-nums tracking-tight">${price}</span>
                  <span className={`mb-1 text-sm ${plan.featured ? "text-paper/70" : "text-muted"}`}>/ month</span>
                </p>
                <p className={`mt-1 text-xs ${plan.featured ? "text-paper/60" : "text-muted"}`}>
                  {annual ? `Billed annually at $${price * 12}` : "Billed each month"}
                </p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span aria-hidden="true" className={plan.featured ? "text-[#9ddec0]" : "text-forest-mid"}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/dashboard?plan=${plan.id}`}
                  className={`mt-8 inline-flex h-12 items-center justify-center rounded-full text-sm ${plan.featured ? "bg-paper text-forest hover:bg-sand" : "bg-forest text-paper hover:bg-forest-mid"}`}
                >
                  Open the demo
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
