import type { Metadata } from "next";
import type { ChangelogSection } from "@/features/changelog/data/entries";
import { CHANGELOG } from "@/features/changelog/data/entries";
import Footer from "@/features/landing/ui/components/Footer";
import Navbar from "@/features/landing/ui/components/Navbar";

export const metadata: Metadata = {
  title: "Novedades",
  description:
    "Todas las actualizaciones de CaseShell: casos nuevos, eventos de temporada y mejoras.",
};

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Muestra los fragmentos entre `comillas invertidas` como código. */
function RichText({ text }: { text: string }) {
  return text.split("`").map((part, i) =>
    i % 2 ? (
      <code
        // biome-ignore lint/suspicious/noArrayIndexKey: fragmentos fijos de un texto
        key={i}
        className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-emerald-300"
      >
        {part}
      </code>
    ) : (
      part
    ),
  );
}

function Section({ title, items }: ChangelogSection) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <ul className="flex list-disc flex-col gap-2 pl-5 text-zinc-300 marker:text-red-500">
        {items.map((item) => (
          <li key={item} className="leading-relaxed">
            <RichText text={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function ChangelogPage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="min-h-screen bg-zinc-950 px-4 pt-24 pb-20 font-sans text-white sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-14">
          <section className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-5xl font-semibold tracking-tight lg:text-6xl">
              <span className="text-red-600">Novedades</span>
            </h1>
            <p className="max-w-2xl text-lg text-zinc-400">
              Todo lo que ha cambiado en CaseShell, de lo más reciente a lo más
              antiguo.
            </p>
          </section>

          <ol className="relative flex flex-col gap-12 border-l border-white/10 pl-6 sm:pl-10">
            {CHANGELOG.map((entry) => (
              <li key={entry.date} className="relative">
                <span
                  aria-hidden="true"
                  className={`absolute top-2 -left-[31px] size-3 rounded-full sm:-left-[47px] ${
                    entry.major
                      ? "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.7)]"
                      : "bg-zinc-600"
                  }`}
                />
                <article
                  className={`flex flex-col gap-6 rounded-3xl border p-6 sm:p-8 ${
                    entry.major
                      ? "border-red-500/40 bg-red-500/5"
                      : "border-white/10 bg-zinc-900/40"
                  }`}
                >
                  <header className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <time dateTime={entry.date} className="text-zinc-400">
                        {dateFormat.format(new Date(`${entry.date}T00:00:00Z`))}
                      </time>
                      {entry.version && (
                        <span className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-xs text-zinc-300">
                          v{entry.version}
                        </span>
                      )}
                      {entry.major && (
                        <span className="rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
                          Gran actualización
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      {entry.title}
                    </h2>
                    <p className="leading-relaxed text-zinc-400">
                      {entry.summary}
                    </p>
                  </header>

                  {entry.sections.map((section) => (
                    <Section key={section.title} {...section} />
                  ))}

                  {entry.technical && (
                    <details className="group rounded-2xl border border-white/10 bg-black/30 p-5">
                      <summary className="cursor-pointer select-none font-semibold text-zinc-200 marker:text-red-500">
                        Detalles técnicos (para desarrolladores)
                      </summary>
                      <div className="mt-6 flex flex-col gap-6">
                        {entry.technical.map((section) => (
                          <Section key={section.title} {...section} />
                        ))}
                      </div>
                    </details>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </main>
      <Footer />
    </>
  );
}
