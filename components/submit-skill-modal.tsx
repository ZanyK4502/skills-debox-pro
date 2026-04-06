"use client";

import { signIn, useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { ToastMessage } from "@/components/toast-message";
import { useLanguage } from "@/components/language-provider";

interface SubmitSkillModalProps {
  open: boolean;
  categorySlug: string;
  categoryName: string;
  onClose: () => void;
}

type SkillTier = "featured" | "backup";

type ToastState =
  | {
      kind: "success" | "error";
      message: string;
      linkUrl?: string;
      linkLabel?: string;
    }
  | null;

type FormState = {
  name: string;
  tier: SkillTier;
  url: string;
  summary: string;
  useCases: string;
  audience: string;
  reason: string;
};

const initialFormState: FormState = {
  name: "",
  tier: "backup",
  url: "",
  summary: "",
  useCases: "",
  audience: "",
  reason: "",
};

function normalizeTags(tags: string[]) {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ).slice(0, 5);
}

export function SubmitSkillModal({
  open,
  categorySlug,
  categoryName,
  onClose,
}: SubmitSkillModalProps) {
  const { language } = useLanguage();
  const { data: session, status } = useSession();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const copy = useMemo(
    () =>
      language === "zh"
        ? {
            title: "贡献新工具",
            subtitle: "当前分类",
            signInPrompt: "请先使用 GitHub 登录，再提交新工具投稿。",
            signInAction: "使用 GitHub 登录",
            name: "工具名称",
            tier: "所属版块",
            tierFeatured: "主推荐 featured",
            tierBackup: "更多推荐 backup",
            url: "原始链接",
            tags: "标签 Tags",
            tagsHint: "输入标签后按回车生成，最多 5 个。",
            summary: "功能概览",
            summaryHint: "软限制：约 100 字",
            useCases: "典型场景",
            useCasesHint: "软限制：约 100 字",
            audience: "适用人群",
            audienceHint: "软限制：约 50 字",
            reason: "推荐理由",
            reasonHint: "软限制：约 150 字",
            submit: "提交新工具",
            submitting: "正在创建 PR...",
            close: "关闭",
            success: "投稿 JSON 已生成并成功创建 PR。",
            successLink: "打开 PR",
            requiredName: "请填写工具名称。",
            invalidUrl: "请输入合法的原始链接 URL。",
            tagLimit: "最多只能添加 5 个标签。",
          }
        : {
            title: "Submit a new skill",
            subtitle: "Current category",
            signInPrompt: "Please sign in with GitHub before submitting a new skill.",
            signInAction: "Sign in with GitHub",
            name: "Tool name",
            tier: "Recommendation tier",
            tierFeatured: "Featured",
            tierBackup: "More picks",
            url: "Original link",
            tags: "Tags",
            tagsHint: "Press Enter to add a tag. Up to 5 tags.",
            summary: "Overview",
            summaryHint: "Soft limit: around 100 characters",
            useCases: "Use cases",
            useCasesHint: "Soft limit: around 100 characters",
            audience: "Audience",
            audienceHint: "Soft limit: around 50 characters",
            reason: "Why recommend it",
            reasonHint: "Soft limit: around 150 characters",
            submit: "Submit skill",
            submitting: "Creating PR...",
            close: "Close",
            success: "The submission JSON has been created and a PR is ready for review.",
            successLink: "Open PR",
            requiredName: "Tool name is required.",
            invalidUrl: "Please enter a valid URL.",
            tagLimit: "You can add up to 5 tags only.",
          },
    [language],
  );

  if (!open) {
    return null;
  }

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const commitTagInput = () => {
    const normalized = normalizeTags([...tags, tagInput]);

    if (!tagInput.trim()) {
      setTagInput("");
      return;
    }

    if (tags.length >= 5 && !tags.includes(tagInput.trim())) {
      setToast({
        kind: "error",
        message: copy.tagLimit,
      });
      return;
    }

    setTags(normalized);
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags((current) => current.filter((tag) => tag !== tagToRemove));
  };

  const resetForm = () => {
    setForm(initialFormState);
    setTags([]);
    setTagInput("");
  };

  const handleSubmit = async () => {
    const normalizedTags = normalizeTags([...tags, tagInput]);
    const trimmedName = form.name.trim();
    const trimmedUrl = form.url.trim();
    const pendingTag = tagInput.trim();

    if (!trimmedName) {
      setToast({
        kind: "error",
        message: copy.requiredName,
      });
      return;
    }

    try {
      const parsedUrl = new URL(trimmedUrl);

      if (!/^https?:$/.test(parsedUrl.protocol)) {
        throw new Error(copy.invalidUrl);
      }
    } catch {
      setToast({
        kind: "error",
        message: copy.invalidUrl,
      });
      return;
    }

    if (pendingTag && !tags.includes(pendingTag) && tags.length >= 5) {
      setToast({
        kind: "error",
        message: copy.tagLimit,
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/submit-skill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categorySlug,
          name: trimmedName,
          tier: form.tier,
          url: trimmedUrl,
          tags: normalizedTags,
          summary: form.summary.trim(),
          useCases: form.useCases.trim(),
          audience: form.audience.trim(),
          reason: form.reason.trim(),
        }),
      });

      const payload = (await response.json()) as {
        prUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.prUrl) {
        throw new Error(payload.error || "Failed to submit skill.");
      }

      setToast({
        kind: "success",
        message: copy.success,
        linkUrl: payload.prUrl,
        linkLabel: copy.successLink,
      });

      window.open(payload.prUrl, "_blank", "noopener,noreferrer");
      resetForm();
      onClose();
    } catch (error) {
      setToast({
        kind: "error",
        message:
          error instanceof Error ? error.message : "Failed to submit skill.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--overlay)] px-4 py-8">
        <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-2xl dark:border-white/10 dark:bg-[var(--surface-elevated)]">
          <div className="flex items-center justify-between border-b border-black/5 px-6 py-5 dark:border-white/10">
            <div>
              <p className="text-sm font-medium text-[var(--color-accent)]">
                {copy.subtitle}: {categoryName}
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

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
            {status !== "authenticated" || !session?.user ? (
              <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] p-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-base text-[var(--color-foreground)]">
                  {copy.signInPrompt}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const callbackUrl = new URL(window.location.href);
                    callbackUrl.searchParams.set("action", "submit-skill");
                    callbackUrl.searchParams.set("category", categorySlug);

                    void signIn("github", {
                      callbackUrl: callbackUrl.toString(),
                    });
                  }}
                  className="mt-6 inline-flex rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#00a85f] hover:shadow-lg"
                >
                  {copy.signInAction}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <label className="block">
                  <span className="text-sm font-medium text-[var(--color-foreground)]">
                    {copy.name}
                  </span>
                  <input
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]/30 dark:border-white/10 dark:bg-[var(--surface)]"
                    placeholder={copy.name}
                  />
                </label>

                <div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">
                    {copy.tier}
                  </p>
                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => updateField("tier", "featured")}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        form.tier === "featured"
                          ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
                          : "border-black/5 bg-white text-[var(--color-foreground)] dark:border-white/10 dark:bg-[var(--surface)]"
                      }`}
                    >
                      {copy.tierFeatured}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField("tier", "backup")}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                        form.tier === "backup"
                          ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/8 text-[var(--color-accent)]"
                          : "border-black/5 bg-white text-[var(--color-foreground)] dark:border-white/10 dark:bg-[var(--surface)]"
                      }`}
                    >
                      {copy.tierBackup}
                    </button>
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-[var(--color-foreground)]">
                    {copy.url}
                  </span>
                  <input
                    type="url"
                    value={form.url}
                    onChange={(event) => updateField("url", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]/30 dark:border-white/10 dark:bg-[var(--surface)]"
                    placeholder="https://..."
                  />
                </label>

                <div>
                  <label className="block">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      {copy.tags}
                    </span>
                    <input
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          commitTagInput();
                        }
                      }}
                      className="mt-2 w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]/30 dark:border-white/10 dark:bg-[var(--surface)]"
                      placeholder={copy.tagsHint}
                    />
                  </label>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">{copy.tagsHint}</p>
                  {tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]"
                        >
                          {tag} ×
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>

                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      {copy.summary}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">{copy.summaryHint}</span>
                  </div>
                  <textarea
                    rows={4}
                    value={form.summary}
                    onChange={(event) => updateField("summary", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm leading-7 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]/30 dark:border-white/10 dark:bg-[var(--surface)]"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      {copy.useCases}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">{copy.useCasesHint}</span>
                  </div>
                  <textarea
                    rows={4}
                    value={form.useCases}
                    onChange={(event) => updateField("useCases", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm leading-7 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]/30 dark:border-white/10 dark:bg-[var(--surface)]"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      {copy.audience}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">{copy.audienceHint}</span>
                  </div>
                  <textarea
                    rows={3}
                    value={form.audience}
                    onChange={(event) => updateField("audience", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm leading-7 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]/30 dark:border-white/10 dark:bg-[var(--surface)]"
                  />
                </label>

                <label className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      {copy.reason}
                    </span>
                    <span className="text-xs text-[var(--color-muted)]">{copy.reasonHint}</span>
                  </div>
                  <textarea
                    rows={5}
                    value={form.reason}
                    onChange={(event) => updateField("reason", event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm leading-7 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)]/30 dark:border-white/10 dark:bg-[var(--surface)]"
                  />
                </label>
              </div>
            )}
          </div>

          {status === "authenticated" && session?.user ? (
            <div className="flex items-center justify-end border-t border-black/5 px-6 py-5 dark:border-white/10">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex rounded-full bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#00a85f] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? copy.submitting : copy.submit}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {toast ? (
        <ToastMessage
          kind={toast.kind}
          message={toast.message}
          linkUrl={toast.linkUrl}
          linkLabel={toast.linkLabel}
          onClose={() => setToast(null)}
        />
      ) : null}
    </>
  );
}
