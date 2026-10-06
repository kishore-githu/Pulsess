import { quotes } from "@/lib/site";

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28" aria-labelledby="stories-title">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 id="stories-title" className="max-w-xl font-serif text-[2.4rem] leading-[1.05] tracking-tight sm:text-5xl">
          Teams who got tired of the Monday export.
        </h2>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {quotes.map((item) => (
            <figure key={item.name} className="flex flex-col justify-between rounded-[28px] bg-sand/70 p-6 sm:p-7">
              <blockquote className="font-serif text-2xl leading-snug tracking-tight text-ink">“{item.quote}”</blockquote>
              <figcaption className="mt-8 text-sm">
                <span className="block font-medium">{item.name}</span>
                <span className="text-muted">{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
