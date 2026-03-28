"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";

export function SiteHeader() {
  const { dictionary, toggleLanguage } = useLanguage();

  const navItems = [
    { href: "/", label: dictionary.header.home },
    { href: "/#categories", label: dictionary.header.categories },
    { href: "/about", label: dictionary.header.about },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-[rgba(245,247,251,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-col">
          <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-accent)]">
            skills.debox.pro
          </span>
          <span className="text-base font-semibold text-[var(--color-foreground)]">
            Clawhub Skills Guide
          </span>
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <nav className="flex flex-wrap items-center justify-end gap-2 text-sm text-[var(--color-muted)]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 transition hover:bg-white hover:text-[var(--color-foreground)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={toggleLanguage}
            className="rounded-full border border-black/5 bg-white px-3 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)]"
            aria-label={dictionary.header.toggle}
          >
            {dictionary.header.toggle}
          </button>
        </div>
      </div>
    </header>
  );
}
