import { marks } from "@/lib/site";

export function LogoCloud() {
  return (
    <section aria-label="Teams in the Pulse story" className="border-y border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 sm:px-8 md:flex-row md:items-center md:gap-10">
        <p className="shrink-0 text-xs uppercase tracking-[0.16em] text-muted">In the story</p>
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {marks.map((mark) => (
            <li key={mark} className="font-serif text-lg tracking-tight text-ink/55">
              {mark}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
