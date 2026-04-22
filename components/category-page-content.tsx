"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { ArchivedSkillsDrawer } from "@/components/archived-skills-drawer";
import { SkillCard } from "@/components/skill-card";
import { SubmitSkillModal } from "@/components/submit-skill-modal";
import { useLanguage } from "@/components/language-provider";
import type { Category } from "@/data/categories";
import type { Skill } from "@/data/skills";

interface CategoryPageContentProps {
  category: Category;
  featuredSkills: Skill[];
  backupSkills: Skill[];
  archivedSkills: Skill[];
  displayStatus: "ready" | "soon";
}

export function CategoryPageContent({
  category,
  featuredSkills,
  backupSkills,
  archivedSkills,
  displayStatus,
}: CategoryPageContentProps) {
  const { dictionary, getCategoryCopy, language } = useLanguage();
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const copy = getCategoryCopy(category.slug, {
    name: category.name,
    description: category.description,
  });
  const hasActiveSkills = featuredSkills.length > 0 || backupSkills.length > 0;
  const submitCopy = useMemo(
    () =>
      language === "zh"
        ? {
            submitButton: "+ 贡献新工具",
          }
        : {
            submitButton: "+ Submit new skill",
          },
    [language],
  );
  const placeholderCopy = useMemo(
    () => ({
      title: "敬请期待 Coming Soon",
      description:
        "该分类的精选工具正在整理中，后续会在这里持续补充主推荐与更多推荐。",
    }),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const currentSearchParams = new URLSearchParams(window.location.search);
    const action = currentSearchParams.get("action");
    const targetCategory = currentSearchParams.get("category");

    if (
      status === "authenticated" &&
      action === "submit-skill" &&
      targetCategory === category.slug
    ) {
      setSubmitModalOpen(true);

      const nextSearchParams = new URLSearchParams(currentSearchParams.toString());
      nextSearchParams.delete("action");
      nextSearchParams.delete("category");

      const nextQuery = nextSearchParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    }
  }, [category.slug, pathname, router, status]);

  return (
    <>
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="rounded-[36px] border border-white/70 bg-[rgba(255,255,255,0.86)] p-8 shadow-[0_24px_72px_rgba(13,32,51,0.08)] dark:border-white/10 dark:bg-[var(--surface-muted)] sm:p-10">
        <Link
          href="/"
          className="inline-flex rounded-full bg-[rgba(13,32,51,0.05)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[rgba(13,32,51,0.09)] hover:text-[var(--color-foreground)]"
        >
          {dictionary.categoryPage.backHome}
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {dictionary.categoryPage.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl">
              {copy.name}
            </h1>
            <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
              {copy.description}
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                displayStatus === "ready"
                  ? "bg-[rgba(15,111,127,0.12)] text-[var(--color-accent)]"
                  : "bg-[rgba(148,163,184,0.14)] text-[var(--color-muted)]"
              }`}
            >
              {displayStatus === "ready"
                ? dictionary.categoryPage.readyStatus
                : dictionary.categoryPage.soonStatus}
            </span>
            <button
              type="button"
              onClick={() => setSubmitModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#00a85f] hover:shadow-lg"
            >
              {submitCopy.submitButton}
            </button>
          </div>
        </div>
      </section>

      {!hasActiveSkills ? (
        <section className="rounded-[32px] border border-[rgba(160,174,192,0.24)] bg-[rgba(255,255,255,0.76)] p-8 text-center shadow-[0_18px_50px_rgba(13,32,51,0.04)] dark:border-white/10 dark:bg-[var(--surface-muted)] sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {dictionary.categoryPage.soonStatus}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {placeholderCopy.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            {placeholderCopy.description}
          </p>
        </section>
      ) : (
        <>
          {featuredSkills.length > 0 ? (
            <section className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    {dictionary.categoryPage.featuredEyebrow}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
                    {dictionary.categoryPage.featuredTitle}
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                  {dictionary.categoryPage.featuredDescription}
                </p>
              </div>

              <div className="grid gap-6">
                {featuredSkills.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} variant="featured" />
                ))}
              </div>
            </section>
          ) : null}

          {backupSkills.length > 0 ? (
            <section className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    {dictionary.categoryPage.backupEyebrow}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
                    {dictionary.categoryPage.backupTitle}
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
                  {dictionary.categoryPage.backupDescription}
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {backupSkills.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} variant="backup" />
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}

      <ArchivedSkillsDrawer skills={archivedSkills} categoryName={copy.name} />
    </div>
      <SubmitSkillModal
        open={submitModalOpen}
        categorySlug={category.slug}
        categoryName={copy.name}
        onClose={() => setSubmitModalOpen(false)}
      />
    </>
  );
}
