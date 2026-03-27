import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About / Methodology",
  description: "Clawhub Skills Guide 的定位、分类标准与筛选方法说明。",
};

const sections = [
  {
    title: "初衷：解决“不知从何试起”的痛点",
    content:
      "Clawhub 上的 skills 非常丰富，但普通用户最常见的困扰是“太多了，不知道先用哪个”。这个网站的目标是作为你的“前置过滤器”，把真正值得一试的工具提炼出来，降低探索门槛。",
  },
  {
    title: "分类：以“任务目标”为原点",
    content:
      "我们完全按照用户的“任务目标”来划分。我们关心的是一个 skill 能帮你解决什么实际问题、适合什么工作场景，而不是它背后调用了什么接口。一切以“好用、能用”为先。",
  },
  {
    title: "skill 的筛选标准是什么",
    content:
      "第一版优先选择用途清楚、边界明确、适合快速理解的 skill。除了功能本身，我们还会看它是否能代表一个方向、是否适合做入口、是否有明显使用场景，以及是否值得推荐给非重度技术用户。每条推荐都保留了适用人群、典型场景与推荐理由，方便快速判断。",
  },
  {
    title: "演进：从最高频的场景切入",
    content:
      "首批上线的“信息检索、安全风控、市场信息”是大家日常需求最迫切的三个方向。我们希望先把这部分的内容做精做透，确保每一条推荐都有极高的参考价值。",
  },
  {
    title: "后续会持续更新",
    content:
      "精选导航不是一个静态列表，而是一个会随着 Clawhub 生态共同生长的活文档。我们会持续发掘新的优质 skill，并逐步补齐余下的分类，欢迎保持关注。",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
      <section className="rounded-[36px] border border-white/70 bg-[rgba(255,255,255,0.86)] p-8 shadow-[0_24px_72px_rgba(13,32,51,0.08)] sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          About / Methodology
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl">
          拒绝信息过载，重塑团队的 AI 工具探索体验
        </h1>
        <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-muted)]">
          Clawhub Skills Guide 的目标很直接：把值得优先尝试的 skill 按用户场景整理出来，先让人快速看懂，再决定要不要深入。第一版重点是方法清楚、结构稳定、便于后续继续补齐。
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="hero-primary-button">
            返回首页
          </Link>
          <Link
            href="/#categories"
            className="inline-flex rounded-full border border-[rgba(13,32,51,0.12)] bg-white px-5 py-3 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[rgba(15,111,127,0.22)] hover:text-[var(--color-accent)]"
          >
            查看分类结构
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.title}
            className="rounded-[30px] border border-white/70 bg-white/80 p-7 shadow-[0_14px_40px_rgba(13,32,51,0.05)]"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
              {section.title}
            </h2>
            <p className="mt-4 text-sm leading-8 text-[var(--color-muted)]">
              {section.content}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
