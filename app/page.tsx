import Link from "next/link";

import { CategoryCard } from "@/components/category-card";
import { categories } from "@/data/categories";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="hero-mesh-bg -mx-5 px-5 py-20 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="inline-flex rounded-full border border-black/5 bg-white/80 px-4 py-2 text-sm font-semibold text-[var(--color-accent)] shadow-sm">
            Clawhub Skills Guide
          </span>
          <h1 className="mt-8 max-w-5xl text-5xl font-semibold tracking-tight text-[#111111] lg:text-6xl">
            专注高频场景，发现真正好用的 AI 工具
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            面对海量的 Clawhub Skills，探索成本往往很高。我们为你筛选出最容易上手、最能直接解决问题的优质工具，帮你省去盲目试错的时间，开箱即用。
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="#categories"
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-8 py-3 text-base font-semibold tracking-[0.01em] text-white transition-all duration-300 hover:bg-[#00a85f] hover:shadow-lg"
            >
              查看精选分类
            </Link>
            <Link
              href="/about"
              className="inline-flex rounded-full border border-black/8 bg-white/80 px-5 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)]"
            >
              了解筛选方法
            </Link>
          </div>
        </div>
      </section>

      <section id="categories" className="space-y-8">
        <div className="flex flex-col gap-4 text-center sm:items-center">
          <div>
            <p className="text-xl font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              分类导航
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
              探索工具场景
            </h2>
          </div>
          <p className="mx-auto max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            按实际工作流划分，覆盖日常工作全流程。
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
            方法说明
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            核心理念：做减法，降门槛
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            重点不是盲目追求数量，而是提供一个高信噪比的精选入口。我们先把各个方向最有代表性的 skill 挑出来，帮你快速定位需要的工具。
          </p>
        </article>

        <article className="rounded-2xl border border-black/[0.04] bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            筛选逻辑
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            筛选标准：场景导向，即开即用
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            优先筛选边界清晰、能代表特定工作流方向的工具。剥离冗长的技术背景，直接提供适用人群与典型场景，一秒判断是否契合需求。
          </p>
        </article>

        <article className="rounded-2xl border border-black/[0.04] bg-white p-7 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            当前边界
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            宁缺毋滥，持续更新
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            当前版本优先覆盖需求最明确的核心场景。为了保证推荐质量，我们会花更多时间在工具的测试与验证上，并逐步开放更多分类。
          </p>
        </article>
      </section>
    </div>
  );
}
