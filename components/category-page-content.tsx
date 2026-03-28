"use client";

import Link from "next/link";

import { SkillCard } from "@/components/skill-card";
import { useLanguage } from "@/components/language-provider";
import type { Category } from "@/data/categories";
import type { Skill } from "@/data/skills";

interface CategoryPageContentProps {
  category: Category;
  featuredSkills: Skill[];
  backupSkills: Skill[];
}

export function CategoryPageContent({
  category,
  featuredSkills,
  backupSkills,
}: CategoryPageContentProps) {
  const { dictionary, getCategoryCopy } = useLanguage();
  const copy = getCategoryCopy(category.slug, {
    name: category.name,
    description: category.description,
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="rounded-[36px] border border-white/70 bg-[rgba(255,255,255,0.86)] p-8 shadow-[0_24px_72px_rgba(13,32,51,0.08)] sm:p-10">
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

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              category.status === "ready"
                ? "bg-[rgba(15,111,127,0.12)] text-[var(--color-accent)]"
                : "bg-[rgba(148,163,184,0.14)] text-[var(--color-muted)]"
            }`}
          >
            {category.status === "ready"
              ? dictionary.categoryPage.readyStatus
              : dictionary.categoryPage.soonStatus}
          </span>
        </div>
      </section>

      {category.status === "soon" ? (
        <section className="rounded-[32px] border border-[rgba(160,174,192,0.24)] bg-[rgba(255,255,255,0.76)] p-8 text-center shadow-[0_18px_50px_rgba(13,32,51,0.04)] sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {dictionary.categoryPage.soonEyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {dictionary.categoryPage.soonTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            {dictionary.categoryPage.soonDescription}
          </p>
        </section>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
