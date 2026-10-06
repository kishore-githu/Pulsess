import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-forest-mid">{children}</p>;
}

export function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-serif text-[2.4rem] leading-[1.05] tracking-tight text-ink sm:text-5xl">{title}</h2>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{body}</p>
    </div>
  );
}
