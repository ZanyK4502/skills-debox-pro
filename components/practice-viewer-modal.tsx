"use client";

import {
  useEffect,
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { useLanguage } from "@/components/language-provider";

type PracticeItem = {
  id: string;
  title: string;
  contributor: string;
  publishedAt: string | null;
  content: string;
  updatedAt: string;
};

interface PracticeViewerModalProps {
  open: boolean;
  slug: string;
  skillName: string;
  onClose: () => void;
}

function normalizePracticeMarkdown(content: string) {
  let insideFence = false;

  return content
    .split("\n")
    .map((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith("```")) {
        insideFence = !insideFence;
        return line;
      }

      if (insideFence || trimmedLine.length === 0) {
        return line;
      }

      const orderedListItem = line.match(/^(\s*)(\d+)、\s*(.+)$/);

      if (orderedListItem) {
        return `${orderedListItem[1]}${orderedListItem[2]}. ${orderedListItem[3]}`;
      }

      const nestedOrderedListItem = line.match(/^\s*[-*]\s+(\d+)、\s*(.+)$/);

      if (nestedOrderedListItem) {
        return `${nestedOrderedListItem[1]}. ${nestedOrderedListItem[2]}`;
      }

      if (
        trimmedLine.length <= 28 &&
        !trimmedLine.startsWith("#") &&
        !trimmedLine.startsWith(">") &&
        !trimmedLine.startsWith("[") &&
        !trimmedLine.startsWith("!") &&
        !trimmedLine.includes("://") &&
        /^([\p{Script=Han}A-Za-z0-9\s/()（）《》【】_-]+)\s*[:：]$/u.test(
          trimmedLine,
        )
      ) {
        return `### ${trimmedLine.replace(/\s*[:：]$/, "")}`;
      }

      return line;
    })
    .join("\n");
}

const markdownComponents = {
  h1({ children, ...props }: ComponentPropsWithoutRef<"h1">) {
    return (
      <h1
        className="mb-5 mt-8 text-3xl font-semibold leading-tight text-[var(--color-foreground)] first:mt-0"
        {...props}
      >
        {children}
      </h1>
    );
  },
  h2({ children, ...props }: ComponentPropsWithoutRef<"h2">) {
    return (
      <h2
        className="mb-4 mt-8 text-2xl font-semibold leading-tight text-[var(--color-foreground)] first:mt-0"
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3({ children, ...props }: ComponentPropsWithoutRef<"h3">) {
    return (
      <h3
        className="mb-3 mt-6 text-xl font-semibold leading-snug text-[var(--color-foreground)] first:mt-0"
        {...props}
      >
        {children}
      </h3>
    );
  },
  p({ children, ...props }: ComponentPropsWithoutRef<"p">) {
    return (
      <p
        className="my-4 whitespace-pre-wrap text-[15px] leading-8 text-[var(--color-foreground)]"
        {...props}
      >
        {children}
      </p>
    );
  },
  a({ children, ...props }: ComponentPropsWithoutRef<"a">) {
    return (
      <a
        className="font-medium text-[var(--color-accent)] underline underline-offset-4 transition hover:text-[#00a85f]"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  blockquote({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) {
    return (
      <blockquote
        className="my-5 border-l-4 border-[var(--color-accent)]/45 bg-[var(--color-accent)]/8 px-4 py-3 text-[var(--color-foreground)]"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
  ul({ children, ...props }: ComponentPropsWithoutRef<"ul">) {
    return (
      <ul
        className="my-4 list-disc space-y-2 pl-6 text-[15px] leading-8 text-[var(--color-foreground)]"
        {...props}
      >
        {children}
      </ul>
    );
  },
  ol({ children, ...props }: ComponentPropsWithoutRef<"ol">) {
    return (
      <ol
        className="my-4 list-decimal space-y-2 pl-6 text-[15px] leading-8 text-[var(--color-foreground)]"
        {...props}
      >
        {children}
      </ol>
    );
  },
  li({ children, ...props }: ComponentPropsWithoutRef<"li">) {
    return (
      <li className="pl-1 marker:text-[var(--color-muted)]" {...props}>
        {children}
      </li>
    );
  },
  pre({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
    return (
      <pre
        className="my-5 overflow-x-auto rounded-xl border border-white/10 bg-neutral-950 px-4 py-4 text-sm leading-7 text-white shadow-inner"
        {...props}
      >
        {children}
      </pre>
    );
  },
  code({
    children,
    className,
    ...props
  }: ComponentPropsWithoutRef<"code">) {
    const isCodeBlock =
      Boolean(className?.startsWith("language-")) ||
      String(children).includes("\n");

    if (isCodeBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }

    return (
      <code
        className="rounded-md bg-black/5 px-1.5 py-0.5 font-mono text-[0.92em] text-[var(--color-foreground)] dark:bg-white/10"
        {...props}
      >
        {children}
      </code>
    );
  },
  img({ alt, ...props }: ComponentPropsWithoutRef<"img">) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={alt ?? ""}
        className="my-6 max-h-[720px] w-auto max-w-full rounded-xl border border-black/5 object-contain dark:border-white/10"
        loading="lazy"
        {...props}
      />
    );
  },
  table({ children, ...props }: ComponentPropsWithoutRef<"table">) {
    return (
      <div className="my-5 overflow-x-auto">
        <table
          className="w-full border-collapse text-left text-sm text-[var(--color-foreground)]"
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },
  th({ children, ...props }: ComponentPropsWithoutRef<"th">) {
    return (
      <th
        className="border-b border-black/10 px-3 py-2 font-semibold dark:border-white/10"
        {...props}
      >
        {children}
      </th>
    );
  },
  td({ children, ...props }: ComponentPropsWithoutRef<"td">) {
    return (
      <td className="border-b border-black/5 px-3 py-2 dark:border-white/10" {...props}>
        {children}
      </td>
    );
  },
};

export function PracticeViewerModal({
  open,
  slug,
  skillName,
  onClose,
}: PracticeViewerModalProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [practices, setPractices] = useState<PracticeItem[]>([]);
  const [activePracticeId, setActivePracticeId] = useState<string | null>(null);

  const copy = useMemo(
    () =>
      language === "zh"
        ? {
            title: "查看最佳实践",
            loading: "正在加载最佳实践...",
            empty: "暂无最佳实践",
            error: "最佳实践加载失败，请稍后重试。",
            close: "关闭",
            latest: "最新更新",
            contributor: "贡献用户",
            publishedAt: "贡献时间",
          }
        : {
            title: "View best practices",
            loading: "Loading best practices...",
            empty: "No best practices yet.",
            error: "Failed to load best practices. Please try again later.",
            close: "Close",
            latest: "Last updated",
            contributor: "Contributor",
            publishedAt: "Published at",
          },
    [language],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    let active = true;

    async function loadPractices() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/practices/${slug}`, {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(copy.error);
        }

        const payload = (await response.json()) as { practices?: PracticeItem[] };

        if (!active) {
          return;
        }

        const nextPractices = payload.practices ?? [];
        setPractices(nextPractices);
        setActivePracticeId(nextPractices[0]?.id ?? null);
      } catch {
        if (active) {
          setError(copy.error);
          setPractices([]);
          setActivePracticeId(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPractices();

    return () => {
      active = false;
    };
  }, [copy.error, open, slug]);

  if (!open) {
    return null;
  }

  const activePractice =
    practices.find((practice) => practice.id === activePracticeId) ?? practices[0];
  const normalizedPracticeContent = activePractice
    ? normalizePracticeMarkdown(activePractice.content)
    : "";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--overlay)] px-4 py-8">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-2xl dark:border-white/10 dark:bg-[var(--surface-elevated)]">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/10">
          <div>
            <p className="text-sm font-medium text-[var(--color-accent)]">
              {skillName}
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[var(--color-foreground)]">
              {copy.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/25 hover:text-[var(--color-accent)] dark:border-white/10"
          >
            {copy.close}
          </button>
        </div>

        {loading ? (
          <div className="px-6 py-10 text-sm text-[var(--color-muted)]">
            {copy.loading}
          </div>
        ) : error ? (
          <div className="px-6 py-10 text-sm text-red-500">{error}</div>
        ) : practices.length === 0 ? (
          <div className="px-6 py-10 text-sm text-[var(--color-muted)]">
            {copy.empty}
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 gap-0 md:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="overflow-y-auto border-b border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03] md:border-b-0 md:border-r">
              <div className="space-y-2">
                {practices.map((practice) => {
                  const isActive = practice.id === activePractice?.id;

                  return (
                    <button
                      key={practice.id}
                      type="button"
                      onClick={() => setActivePracticeId(practice.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        isActive
                          ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/8"
                          : "border-transparent bg-white hover:border-black/5 hover:bg-white dark:bg-[var(--surface)] dark:hover:border-white/10"
                      }`}
                    >
                      <p className="truncate text-sm font-medium text-[var(--color-foreground)]">
                        {practice.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
                        @{practice.contributor}
                      </p>
                    </button>
                  );
                })}
              </div>
            </aside>

            <div className="min-h-0 overflow-y-auto px-6 py-6">
              {activePractice ? (
                <>
                  <div className="mb-6 border-b border-black/5 pb-4 dark:border-white/10">
                    <h3 className="text-xl font-semibold text-[var(--color-foreground)]">
                      {activePractice.title}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-[var(--color-muted)]">
                      <p>
                        {copy.contributor}: @{activePractice.contributor}
                      </p>
                      <p>
                        {copy.publishedAt}:{" "}
                        {activePractice.publishedAt ??
                          new Date(activePractice.updatedAt).toLocaleDateString()}
                      </p>
                      <p>
                        {copy.latest}:{" "}
                        {new Date(activePractice.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <article className="max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={markdownComponents}
                    >
                      {normalizedPracticeContent}
                    </ReactMarkdown>
                  </article>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
