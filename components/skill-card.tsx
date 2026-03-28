"use client";

import { useLanguage } from "@/components/language-provider";
import type { Skill } from "@/data/skills";

interface SkillCardProps {
  skill: Skill;
  variant: "featured" | "backup";
}

export function SkillCard({ skill, variant }: SkillCardProps) {
  const { dictionary, getSkillCopy } = useLanguage();
  const copy = getSkillCopy(skill.url, {
    name: skill.name,
    tags: skill.tags,
    summary: skill.summary,
    useCases: skill.useCases,
    audience: skill.audience,
    reason: skill.reason,
  });

  return (
    <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-accent)]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,194,110,0.15)]">
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
          <h3 className="text-2xl font-bold tracking-tight text-neutral-950">
            {copy.name}
          </h3>
        </div>

        <a
          href={skill.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/20 hover:text-[var(--color-accent)]"
        >
          {dictionary.skillCard.openLink}
        </a>
      </div>

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

      <div className="mt-6 grid gap-x-6 gap-y-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-[var(--color-muted)] sm:grid-cols-2">
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
  );
}
