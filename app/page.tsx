import Link from "next/link";

import { CategoryCard } from "@/components/category-card";
import { categories, completedCategoriesCount } from "@/data/categories";

const readyCategories = categories.filter((category) => category.status === "ready");

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 py-10 sm:px-6 lg:px-8 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:items-end">
        <div className="rounded-3xl border border-black/[0.04] bg-white/90 p-8 shadow-sm backdrop-blur-sm sm:p-10 lg:p-12">
          <span className="inline-flex rounded-full bg-[rgba(15,111,127,0.12)] px-4 py-2 text-sm font-semibold text-[var(--color-accent)]">
            Clawhub Skills Guide
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl lg:text-6xl">
            Clawhub Skills 精选导航：筛选真正产生业务价值的 AI 工具
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
            面对海量的 Clawhub Skills，探索成本往往很高。我们为你筛选出最容易上手、最能直接解决问题的优质工具，帮你省去盲目试错的时间，开箱即用。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#categories" className="hero-primary-button">
              查看精选分类
            </Link>
            <Link
              href="/about"
              className="inline-flex rounded-full border border-[rgba(13,32,51,0.12)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[rgba(15,111,127,0.22)] hover:text-[var(--color-accent)]"
            >
              了解筛选方法
            </Link>
          </div>
        </div>

        <aside className="rounded-3xl border border-[var(--color-accent)]/10 bg-gradient-to-b from-[var(--color-accent)]/5 to-white/60 p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            当前进度
          </p>
          <p className="mt-4 text-5xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {completedCategoriesCount} / {categories.length}
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            目前已优先上线需求最高频的 3 个分类：信息检索、安全风控、市场信息。其余场景的优质工具正在严选打磨中，后续将持续更新。
          </p>

          <div className="mt-8 space-y-3">
            {readyCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-white"
              >
                <span>{category.name}</span>
                <span className="text-[var(--color-accent)]">已上线</span>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section
        id="categories"
        className="rounded-3xl border border-black/[0.04] bg-white/50 p-6 shadow-sm sm:p-8 lg:p-10"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              分类导航
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
              12 个主分类先完整铺开，已完成分类优先高亮
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[var(--color-muted)]">
            这里展示了完整的工具应用场景。已完成的分类可直接探索精选推荐；“正在整理”的分类我们会尽快完成筛选并上线。
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
