"use client";

import Link from "next/link";

import { useLanguage } from "@/components/language-provider";
import type { Category } from "@/data/categories";
import { getCategoryDisplayStatus } from "@/lib/category-status";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const { dictionary, getCategoryCopy } = useLanguage();
  const computedStatus = getCategoryDisplayStatus(category.slug);
  const isReady = computedStatus === "ready";
  const copy = getCategoryCopy(category.slug, {
    name: category.name,
    description: category.description,
  });

  const cardClassName = isReady
    ? "group block rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-accent)]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,194,110,0.15)] dark:border-white/10 dark:bg-[var(--surface-elevated)]"
    : "group block rounded-3xl border border-dashed border-black/5 bg-white p-6 opacity-65 grayscale transition-all duration-500 hover:-translate-y-2 hover:opacity-85 hover:border-[var(--color-accent)]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,194,110,0.15)] dark:border-white/10 dark:bg-[var(--surface-elevated)]";

  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
          <span className="text-sm font-semibold text-neutral-950 dark:text-white">
            {String(index).padStart(2, "0")}
          </span>
        </div>
        <span className="rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
          {isReady
            ? dictionary.categoryCard.readyStatus
            : dictionary.categoryCard.soonStatus}
        </span>
      </div>

      <div className="mt-8 space-y-3">
        <h3 className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white">
          {copy.name}
        </h3>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {copy.description}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-5 text-sm">
        <span className="font-medium text-[var(--color-accent)]">
          {isReady
            ? dictionary.categoryCard.readyAction
            : dictionary.categoryCard.soonAction}
        </span>
        <span className="text-[var(--color-muted)]">
          {isReady
            ? dictionary.categoryCard.readyNote
            : dictionary.categoryCard.soonNote}
        </span>
      </div>
    </>
  );

  return (
    <Link href={`/categories/${category.slug}`} className={cardClassName}>
      {inner}
    </Link>
  );
}
