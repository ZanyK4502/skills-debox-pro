"use client";

import { useMemo, useState } from "react";

import { PracticeViewerModal } from "@/components/practice-viewer-modal";
import { useLanguage } from "@/components/language-provider";
import type { Skill } from "@/data/skills";
import { getSkillDisplayMeta, getSkillIdentifier } from "@/lib/skill-utils";

interface ArchivedSkillsDrawerProps {
  skills: Skill[];
  categoryName: string;
}

type SortOrder = "latest" | "oldest";

function getArchiveMeta(skill: Skill) {
  return getSkillDisplayMeta(skill);
}

function parsePublishedAt(value: string) {
  const [year, month, day] = value.split(".").map((part) => Number(part));

  if (!year || !month || !day) {
    return new Date(2026, 3, 6).getTime();
  }

  return new Date(year, month - 1, day).getTime();
}

export function ArchivedSkillsDrawer({
  skills,
  categoryName,
}: ArchivedSkillsDrawerProps) {
  const { language, dictionary, getSkillCopy } = useLanguage();
  const [open, setOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [viewerSkill, setViewerSkill] = useState<Skill | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const copy = useMemo(
    () =>
      language === "zh"
        ? {
            openDrawer: "查看过往推荐",
            title: "过往推荐 Skill",
            description: "这里收录了当前分类中已经归档的历史推荐，方便回看与对比。",
            sortLabel: "根据上线时间排序",
            latest: "最新",
            oldest: "最旧",
            archived: "已归档",
            contributor: "贡献用户",
            publishedAt: "上线时间",
            detailTitle: "历史推荐详情",
            detailHint: "该工具已归档，仍可查看最佳实践与过往推荐信息。",
            viewPractice: "查看最佳实践",
            openLink: dictionary.skillCard.openLink,
            close: "关闭",
          }
        : {
            openDrawer: "View past recommendations",
            title: "Archived recommendations",
            description:
              "This drawer keeps historical recommendations for the current category so you can review them later.",
            sortLabel: "Sort by launch date",
            latest: "Newest first",
            oldest: "Oldest first",
            archived: "Archived",
            contributor: "Contributor",
            publishedAt: "Published at",
            detailTitle: "Archived skill details",
            detailHint:
              "This tool is archived, but you can still review its best practices and historical context.",
            viewPractice: "View best practices",
            openLink: dictionary.skillCard.openLink,
            close: "Close",
          },
    [dictionary.skillCard.openLink, language],
  );

  const sortedSkills = useMemo(() => {
    return [...skills].sort((left, right) => {
      const leftTime = parsePublishedAt(getArchiveMeta(left).publishedAt);
      const rightTime = parsePublishedAt(getArchiveMeta(right).publishedAt);

      return sortOrder === "latest" ? rightTime - leftTime : leftTime - rightTime;
    });
  }, [skills, sortOrder]);

  if (skills.length === 0) {
    return null;
  }

  const selectedSkillCopy = selectedSkill
    ? getSkillCopy(selectedSkill.url, {
        name: selectedSkill.name,
        tags: selectedSkill.tags,
        summary: selectedSkill.summary,
        useCases: selectedSkill.useCases,
        audience: selectedSkill.audience,
        reason: selectedSkill.reason,
      })
    : null;
  const selectedMeta = selectedSkill ? getArchiveMeta(selectedSkill) : null;

  return (
    <>
      <section className="rounded-[32px] border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[var(--surface-elevated)] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
              {copy.title}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              {copy.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#00a85f] hover:shadow-lg"
          >
            {copy.openDrawer}
          </button>
        </div>
      </section>

      {open ? (
        <div className="fixed inset-0 z-[70]">
          <button
            type="button"
            aria-label={copy.close}
            className="absolute inset-0 bg-[var(--overlay)]"
            onClick={() => {
              setOpen(false);
              setSelectedSkill(null);
            }}
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col border-l border-black/5 bg-white shadow-2xl dark:border-white/10 dark:bg-[var(--surface-elevated)]">
            <div className="border-b border-black/5 px-6 py-5 dark:border-white/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[var(--color-accent)]">
                    {categoryName}
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-[var(--color-foreground)]">
                    {copy.title}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                    {copy.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setSelectedSkill(null);
                  }}
                  className="rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)] dark:border-white/10"
                >
                  {copy.close}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-[var(--color-muted)]">
                  {copy.sortLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setSortOrder((current) => (current === "latest" ? "oldest" : "latest"))}
                  className="inline-flex rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)] dark:border-white/10"
                >
                  {sortOrder === "latest" ? copy.latest : copy.oldest}
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-4">
                {sortedSkills.map((skill) => {
                  const skillCopy = getSkillCopy(skill.url, {
                    name: skill.name,
                    tags: skill.tags,
                    summary: skill.summary,
                    useCases: skill.useCases,
                    audience: skill.audience,
                    reason: skill.reason,
                  });
                  const meta = getArchiveMeta(skill);

                  return (
                    <button
                      key={`${skill.categorySlug}-${skill.name}`}
                      type="button"
                      onClick={() => setSelectedSkill(skill)}
                      className="w-full rounded-3xl border border-black/5 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[var(--color-accent)]/25 hover:shadow-lg dark:border-white/10 dark:bg-[var(--surface)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                              {skillCopy.name}
                            </h3>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                            {skillCopy.summary}
                          </p>
                        </div>

                        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-[var(--color-foreground)] dark:bg-white/10 dark:text-white">
                          {copy.archived}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-[var(--color-muted)]">
                        <span>
                          {copy.publishedAt}: {meta.publishedAt}
                        </span>
                        <span>
                          {copy.contributor}: @{meta.contributor}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {selectedSkill && selectedSkillCopy && selectedMeta ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[var(--overlay)] px-4 py-8">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-2xl dark:border-white/10 dark:bg-[var(--surface-elevated)]">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/10">
              <div>
                <p className="text-sm font-medium text-[var(--color-accent)]">
                  {copy.detailTitle}
                </p>
                <h3 className="mt-1 text-2xl font-semibold text-[var(--color-foreground)]">
                  {selectedSkillCopy.name}
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                  {copy.detailHint}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)] dark:border-white/10"
              >
                {copy.close}
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
                    <span>
                      {copy.publishedAt}: {selectedMeta.publishedAt}
                    </span>
                    <span>
                      {copy.contributor}: @{selectedMeta.contributor}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedSkillCopy.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setViewerSkill(selectedSkill);
                      setSelectedSkill(null);
                      setViewerOpen(true);
                    }}
                    className="inline-flex rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)] dark:border-white/10"
                  >
                    {copy.viewPractice}
                  </button>
                  <a
                    href={selectedSkill.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)] dark:border-white/10"
                  >
                    {copy.openLink}
                  </a>
                </div>
              </div>

              <div className="mt-8 grid gap-x-6 gap-y-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-[var(--color-muted)] dark:border-white/10 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {dictionary.skillCard.overview}
                  </p>
                  <p className="mt-2">{selectedSkillCopy.summary}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {dictionary.skillCard.useCases}
                  </p>
                  <p className="mt-2">{selectedSkillCopy.useCases}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {dictionary.skillCard.audience}
                  </p>
                  <p className="mt-2">{selectedSkillCopy.audience}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {dictionary.skillCard.reason}
                  </p>
                  <p className="mt-2">{selectedSkillCopy.reason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {viewerSkill ? (
        <PracticeViewerModal
          open={viewerOpen}
          slug={getSkillIdentifier(viewerSkill)}
          skillName={
            getSkillCopy(viewerSkill.url, {
              name: viewerSkill.name,
              tags: viewerSkill.tags,
              summary: viewerSkill.summary,
              useCases: viewerSkill.useCases,
              audience: viewerSkill.audience,
              reason: viewerSkill.reason,
            }).name
          }
          onClose={() => {
            setViewerOpen(false);
            setViewerSkill(null);
          }}
        />
      ) : null}
    </>
  );
}
