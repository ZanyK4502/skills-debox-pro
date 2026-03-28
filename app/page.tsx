"use client";

import Link from "next/link";

import { CategoryCard } from "@/components/category-card";
import { useLanguage } from "@/components/language-provider";
import { categories } from "@/data/categories";

export default function Home() {
  const { dictionary } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="hero-mesh-bg -mx-5 px-5 py-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="inline-flex rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--color-accent)] shadow-sm">
            {dictionary.home.badge}
          </span>
          <h1 className="mt-8 max-w-5xl text-5xl font-semibold tracking-tight text-[#111111] lg:text-6xl">
            {dictionary.home.title}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            {dictionary.home.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="#categories"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-8 py-3 text-base font-semibold tracking-[0.01em] text-white transition-all duration-300 hover:bg-[#00a85f] hover:shadow-lg"
            >
              {dictionary.home.primaryCta}
            </Link>
            <Link
              href="/about"
              className="inline-flex rounded-full border border-black/8 bg-white/80 px-5 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)]"
            >
              {dictionary.home.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="space-y-8">
        <div className="flex flex-col gap-4 text-center sm:items-center">
          <div>
            <p className="text-xl font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              {dictionary.home.categoryEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
              {dictionary.home.categoryTitle}
            </h2>
          </div>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            {dictionary.home.categoryDescription}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index + 1} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-2xl border border-black/[0.04] bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {dictionary.home.methodologyEyebrow}
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {dictionary.home.methodologyTitle}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            {dictionary.home.methodologyDescription}
          </p>
        </article>

        <article className="rounded-2xl border border-black/[0.04] bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {dictionary.home.logicEyebrow}
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {dictionary.home.logicTitle}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            {dictionary.home.logicDescription}
          </p>
        </article>

        <article className="rounded-2xl border border-black/[0.04] bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {dictionary.home.boundaryEyebrow}
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {dictionary.home.boundaryTitle}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            {dictionary.home.boundaryDescription}
          </p>
        </article>
      </section>
    </div>
  );
}
