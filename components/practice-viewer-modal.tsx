"use client";

import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
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

                  <article className="prose prose-slate max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {activePractice.content}
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
