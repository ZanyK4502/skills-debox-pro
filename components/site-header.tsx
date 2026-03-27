import Link from "next/link";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/#categories", label: "分类导航" },
  { href: "/about", label: "About / Methodology" },
];

export function SiteHeader() {
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
      </div>
    </header>
  );
}
