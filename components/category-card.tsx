import Link from "next/link";

import type { Category } from "@/data/categories";

interface CategoryCardProps {
  category: Category;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const isReady = category.status === "ready";

  const cardClassName = isReady
    ? "group block rounded-2xl border border-[var(--color-accent)]/20 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/40 hover:shadow-xl"
    : "rounded-2xl border border-dashed border-slate-200 bg-transparent p-6 opacity-60 grayscale transition hover:opacity-80";

  const inner = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm font-semibold text-[var(--color-muted)]">
          {String(index).padStart(2, "0")}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isReady
              ? "bg-[rgba(15,111,127,0.12)] text-[var(--color-accent)]"
              : "bg-[rgba(148,163,184,0.14)] text-[var(--color-muted)]"
          }`}
        >
          {isReady ? "已完成" : "规划中"}
        </span>
      </div>

      <div className="mt-10 space-y-3">
        <h3 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
          {category.name}
        </h3>
        <p className="text-sm leading-7 text-[var(--color-muted)]">
          {category.description}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm">
        <span className="font-medium text-[var(--color-accent)]">
          {isReady ? "进入分类页" : "整理中"}
        </span>
        <span className="text-[var(--color-muted)]">
          {isReady ? "可查看精选结果" : "后续补充推荐"}
        </span>
      </div>
    </>
  );

  if (isReady) {
    return (
      <Link href={`/categories/${category.slug}`} className={cardClassName}>
        {inner}
      </Link>
    );
  }

  return <div className={cardClassName}>{inner}</div>;
}
