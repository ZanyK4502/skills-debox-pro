"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { PracticeEditorModal } from "@/components/practice-editor-modal";
import { PracticeViewerModal } from "@/components/practice-viewer-modal";
import { useLanguage } from "@/components/language-provider";
import type { Skill } from "@/data/skills";
import { getSkillDisplayMeta, getSkillIdentifier } from "@/lib/skill-utils";

interface SkillCardProps {
  skill: Skill;
  variant: "featured" | "backup";
}

export function SkillCard({ skill, variant }: SkillCardProps) {
  const { dictionary, getSkillCopy, language } = useLanguage();
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const skillIdentifier = getSkillIdentifier(skill);
  const skillMeta = getSkillDisplayMeta(skill);

  const copy = getSkillCopy(skill.url, {
    name: skill.name,
    tags: skill.tags,
    summary: skill.summary,
    useCases: skill.useCases,
    audience: skill.audience,
    reason: skill.reason,
  });

  const practiceCopy = useMemo(
    () =>
      language === "zh"
        ? {
            view: "查看最佳实践",
            contribute: "贡献最佳实践",
            meta: "贡献者",
          }
        : {
            view: "View best practices",
            contribute: "Contribute best practice",
            meta: "Contributor",
          },
    [language],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const currentSearchParams = new URLSearchParams(window.location.search);
    const action = currentSearchParams.get("action");
    const targetSlug = currentSearchParams.get("slug");

    if (
      status === "authenticated" &&
      action === "contribute" &&
      targetSlug === skillIdentifier
    ) {
      setEditorOpen(true);

      const nextSearchParams = new URLSearchParams(currentSearchParams.toString());
      nextSearchParams.delete("action");
      nextSearchParams.delete("slug");

      const nextQuery = nextSearchParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    }
  }, [pathname, router, skillIdentifier, status]);

  return (
    <>
      <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-accent)]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,194,110,0.15)] dark:border-white/10 dark:bg-[var(--surface-elevated)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
              <span className="inline-flex rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                {variant === "featured"
                  ? dictionary.skillCard.featured
                  : dictionary.skillCard.backup}
              </span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              {copy.name}
            </h3>
          </div>

          <a
            href={skill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/20 hover:text-[var(--color-accent)] dark:border-white/10"
          >
            {dictionary.skillCard.openLink}
          </a>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            className="inline-flex rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/20 hover:text-[var(--color-accent)] dark:border-white/10"
          >
            {practiceCopy.view}
          </button>
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            className="inline-flex rounded-full bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#00a85f] hover:shadow-lg"
          >
            {practiceCopy.contribute}
          </button>
        </div>

        <p className="mt-4 text-xs leading-6 text-[var(--color-muted)]">
          {practiceCopy.meta}: @{skillMeta.contributor} · {skillMeta.publishedAt}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {copy.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-x-6 gap-y-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-[var(--color-muted)] dark:border-white/10 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {dictionary.skillCard.overview}
            </p>
            <p className="mt-2">{copy.summary}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {dictionary.skillCard.useCases}
            </p>
            <p className="mt-2">{copy.useCases}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {dictionary.skillCard.audience}
            </p>
            <p className="mt-2">{copy.audience}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              {dictionary.skillCard.reason}
            </p>
            <p className="mt-2">{copy.reason}</p>
          </div>
        </div>
      </article>

      <PracticeViewerModal
        open={viewerOpen}
        slug={skillIdentifier}
        skillName={copy.name}
        onClose={() => setViewerOpen(false)}
      />

      <PracticeEditorModal
        open={editorOpen}
        slug={skillIdentifier}
        skillName={copy.name}
        onClose={() => setEditorOpen(false)}
      />
    </>
  );
}
