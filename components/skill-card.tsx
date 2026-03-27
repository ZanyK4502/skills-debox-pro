import type { Skill } from "@/data/skills";

interface SkillCardProps {
  skill: Skill;
  variant: "featured" | "backup";
}

export function SkillCard({ skill, variant }: SkillCardProps) {
  return (
    <article
      className={`rounded-2xl border p-6 ${
        variant === "featured"
          ? "border-[var(--color-accent)]/20 bg-white shadow-md transition hover:shadow-lg"
          : "border-slate-200 bg-white/60 shadow-sm transition hover:bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              variant === "featured"
                ? "bg-[rgba(15,111,127,0.12)] text-[var(--color-accent)]"
                : "bg-[rgba(15,111,127,0.08)] text-[var(--color-accent)]"
            }`}
          >
            {variant === "featured" ? "主推荐" : "更多推荐"}
          </span>
          <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {skill.name}
          </h3>
        </div>

        <a
          href={skill.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full border border-[rgba(15,111,127,0.18)] px-4 py-2 text-sm font-medium text-[var(--color-accent)] transition hover:bg-[rgba(15,111,127,0.06)]"
        >
          打开原始链接
        </a>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {skill.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-[rgba(13,32,51,0.06)] px-3 py-1 text-xs text-[var(--color-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 grid gap-x-6 gap-y-5 border-t border-slate-100 pt-5 text-sm leading-relaxed text-[var(--color-muted)] sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            功能概览
          </p>
          <p className="mt-2">{skill.summary}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            典型场景
          </p>
          <p className="mt-2">{skill.useCases}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            适用人群
          </p>
          <p className="mt-2">{skill.audience}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            推荐理由
          </p>
          <p className="mt-2">{skill.reason}</p>
        </div>
      </div>
    </article>
  );
}
