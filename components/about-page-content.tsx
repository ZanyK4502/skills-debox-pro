"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";

export function AboutPageContent() {
  const { dictionary } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="hero-mesh-bg rounded-[36px] border border-white/70 bg-[rgba(255,255,255,0.86)] p-8 shadow-[0_24px_72px_rgba(13,32,51,0.08)] dark:border-white/10 dark:bg-[var(--surface-muted)] sm:p-10">
        <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {dictionary.about.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl">
            {dictionary.about.title}
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
            {dictionary.about.description}
          </p>
        </div>

        <div
          className="mt-8 flex flex-wrap gap-3 animate-fade-in"
          style={{ animationDelay: "150ms" }}
        >
          <Link
            href="/"
            className="inline-flex rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#00a85f] hover:shadow-lg"
          >
            {dictionary.about.backHome}
          </Link>
          <Link
            href="/#categories"
            className="inline-flex rounded-full border border-[rgba(13,32,51,0.12)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[rgba(15,111,127,0.22)] hover:text-[var(--color-accent)] dark:border-white/10 dark:bg-[var(--surface-elevated)]"
          >
            {dictionary.about.viewCategories}
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {dictionary.about.sections.map((section, index) => (
          <article
            key={section.title}
            className="animate-fade-in rounded-[30px] border border-white/70 bg-white/80 p-7 shadow-[0_14px_40px_rgba(13,32,51,0.05)] dark:border-white/10 dark:bg-[var(--surface-muted)]"
            style={{
              animationDelay:
                index === 0
                  ? "300ms"
                  : index === 1
                    ? "400ms"
                    : index === 2
                      ? "500ms"
                      : index === 3
                        ? "600ms"
                        : "700ms",
            }}
          >
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
              {section.title}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
              {section.content}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
