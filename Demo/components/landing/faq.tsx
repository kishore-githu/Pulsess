import { faqs } from "@/lib/site";

export function FAQ() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-forest-mid">FAQ</p>
          <h2 className="mt-3 font-serif text-[2.4rem] leading-[1.05] tracking-tight sm:text-5xl">Questions, answered plainly.</h2>
        </div>
        <div className="border-t border-line">
          {faqs.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-lg">
                {item.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand text-lg transition group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="max-w-xl pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
