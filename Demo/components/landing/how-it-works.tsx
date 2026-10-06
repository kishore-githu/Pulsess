import { SectionIntro } from "@/components/landing/section";
import { steps } from "@/lib/site";

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionIntro
          eyebrow="How it works"
          title="From checkout to clarity in three beats."
          body="Pulse is a desk for the orders you already have. The demo walks the same path with a sample retailer."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="rounded-[28px] bg-card p-6 ring-1 ring-line sm:p-7">
              <span className="font-serif text-sm text-pulse">{step.n}</span>
              <h3 className="mt-4 font-serif text-2xl tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
