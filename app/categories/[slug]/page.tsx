import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SkillCard } from "@/components/skill-card";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getBackupSkills, getFeaturedSkills } from "@/data/skills";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "分类不存在",
    };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const featuredSkills = getFeaturedSkills(category.slug);
  const backupSkills = getBackupSkills(category.slug);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="rounded-[36px] border border-white/70 bg-[rgba(255,255,255,0.86)] p-8 shadow-[0_24px_72px_rgba(13,32,51,0.08)] sm:p-10">
        <Link
          href="/"
          className="inline-flex rounded-full bg-[rgba(13,32,51,0.05)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[rgba(13,32,51,0.09)] hover:text-[var(--color-foreground)]"
        >
          返回首页
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              分类页面
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
              {category.description}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              category.status === "ready"
                ? "bg-[rgba(15,111,127,0.12)] text-[var(--color-accent)]"
                : "bg-[rgba(148,163,184,0.14)] text-[var(--color-muted)]"
            }`}
          >
            {category.status === "ready" ? "已完成整理" : "规划中"}
          </span>
        </div>
      </section>

      {category.status === "soon" ? (
        <section className="rounded-[32px] border border-[rgba(160,174,192,0.24)] bg-[rgba(255,255,255,0.76)] p-8 text-center shadow-[0_18px_50px_rgba(13,32,51,0.04)] sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            规划中
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
            该分类正在整理中
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            该分类的优质工具正在紧张测试与严格筛选中。我们希望为你呈现最有效率的生产力组合，敬请期待后续更新。
          </p>
        </section>
      ) : (
        <>
          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  主推荐
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
                  适合先看的代表性 skill
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                主推荐优先覆盖这个分类里最容易理解、最值得先试、最能代表方向的 skill，适合第一次建立分类印象时直接查看。
              </p>
            </div>

            <div className="grid gap-6">
              {featuredSkills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} variant="featured" />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  更多推荐
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
                  用来补充视角与场景覆盖
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                这些 skill 用来扩展同一分类下的不同使用方向，帮助你根据具体任务继续细分选择，而不是只停留在一个代表性工具上。
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {backupSkills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} variant="backup" />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
