import type { Skill } from "@/data/skills";

interface SkillCardProps {
  skill: Skill;
  variant: "featured" | "backup";
}

export function SkillCard({ skill, variant }: SkillCardProps) {
  return (
    <article
      className={`rounded-3xl border border-black/5 bg-white p-6 transition-all duration-500 hover:-translate-y-2 hover:border-[var(--color-accent)]/30 hover:shadow-[0_20px_40px_-15px_rgba(0,194,110,0.15)] ${
        variant === "featured" ? "shadow-sm" : "shadow-sm"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
            <span
              className={`inline-flex rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)] ${
                variant === "featured" ? "" : ""
              }`}
            >
              {variant === "featured" ? "主推荐" : "更多推荐"}
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-neutral-950">
            {skill.name}
          </h3>
        </div>

        <a
          href={skill.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/20 hover:text-[var(--color-accent)]"
        >
          打开原始链接
        </a>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {skill.tags.map((tag) => (
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
