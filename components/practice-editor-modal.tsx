"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";

import { PracticeRichEditor, type PendingPracticeImage } from "@/components/practice-rich-editor";
import { ToastMessage } from "@/components/toast-message";
import { useLanguage } from "@/components/language-provider";
import {
  defaultPracticeTemplateByLanguage,
  getPracticeTemplateFlagKey,
} from "@/lib/practice-editor";

interface PracticeEditorModalProps {
  open: boolean;
  slug: string;
  skillName: string;
  onClose: () => void;
}

type ToastState =
  | {
      kind: "success" | "error";
      message: string;
      linkUrl?: string;
      linkLabel?: string;
    }
  | null;

function hasMeaningfulContent(html: string) {
  const stripped = html
    .replace(/<img[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();

  return stripped.length > 0;
}

function getLiveImageSourcesFromHtml(html: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");

  return Array.from(document.querySelectorAll("img"))
    .map((image) => image.getAttribute("src")?.trim() ?? "")
    .filter(Boolean);
}

export function PracticeEditorModal({
  open,
  slug,
  skillName,
  onClose,
}: PracticeEditorModalProps) {
  const { language } = useLanguage();
  const { data: session, status } = useSession();
  const [editorHtml, setEditorHtml] = useState("");
  const [pendingImages, setPendingImages] = useState<PendingPracticeImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const pendingImagesRef = useRef<PendingPracticeImage[]>([]);

  const copy = useMemo(
    () =>
      language === "zh"
        ? {
            title: "贡献最佳实践",
            signInPrompt: "请先使用 GitHub 登录",
            signInAction: "使用 GitHub 登录",
            editorHint:
              "请直接像写文档一样整理这个 skill 的最佳实践，支持标题、列表、引用、代码块、链接和图片。",
            insertTemplate: "插入默认模板",
            submit: "提交最佳实践",
            submitting: "正在创建 PR...",
            close: "关闭",
            success: "PR 已创建，你可以继续查看或编辑其他内容。",
            successLink: "打开 PR",
            error: "提交失败，请稍后再试。",
            empty: "请先填写内容后再提交。",
          }
        : {
            title: "Contribute a best practice",
            signInPrompt: "Please sign in with GitHub first.",
            signInAction: "Sign in with GitHub",
            editorHint:
              "Write this best practice like a document. Headings, lists, quotes, code blocks, links, and images are all supported.",
            insertTemplate: "Insert default template",
            submit: "Submit best practice",
            submitting: "Creating PR...",
            close: "Close",
            success:
              "Pull request created. You can keep browsing or continue editing other skills.",
            successLink: "Open PR",
            error: "Submission failed. Please try again later.",
            empty: "Please add some content before submitting.",
          },
    [language],
  );

  const template = defaultPracticeTemplateByLanguage[language];

  useEffect(() => {
    pendingImagesRef.current = pendingImages;
  }, [pendingImages]);

  useEffect(() => {
    if (!open || typeof window === "undefined") {
      return;
    }

    const templateFlagKey = getPracticeTemplateFlagKey(slug);
    const alreadyInitialized = window.localStorage.getItem(templateFlagKey);

    if (!alreadyInitialized && !editorHtml) {
      setEditorHtml(template);
      window.localStorage.setItem(templateFlagKey, "1");
    }
  }, [editorHtml, open, slug, template]);

  useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  const addPendingImage = (image: PendingPracticeImage) => {
    setPendingImages((current) => {
      const nextImages = current.filter((item) => item.id !== image.id);
      return [...nextImages, image];
    });
  };

  if (!open) {
    return null;
  }

  const handleInsertTemplate = () => {
    setEditorHtml(template);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(getPracticeTemplateFlagKey(slug), "1");
    }
  };

  const handleSubmit = async () => {
    const liveImageSources = new Set(getLiveImageSourcesFromHtml(editorHtml));
    const referencedImages = pendingImages.filter((image) =>
      liveImageSources.has(image.previewUrl),
    );

    if (!hasMeaningfulContent(editorHtml) && referencedImages.length === 0) {
      setToast({
        kind: "error",
        message: copy.empty,
      });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("htmlContent", editorHtml);
      formData.append(
        "imageManifest",
        JSON.stringify(
          referencedImages.map((image) => ({
            id: image.id,
            src: image.previewUrl,
            fileName: image.fileName,
          })),
        ),
      );

      referencedImages.forEach((image) => {
        formData.append(`image:${image.id}`, image.file, image.fileName);
      });

      const response = await fetch("/api/submit-practice", {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        prUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.prUrl) {
        throw new Error(payload.error || copy.error);
      }

      setToast({
        kind: "success",
        message: copy.success,
        linkUrl: payload.prUrl,
        linkLabel: copy.successLink,
      });

      window.open(payload.prUrl, "_blank", "noopener,noreferrer");

      referencedImages.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });

      setPendingImages([]);
      setEditorHtml("");
      onClose();
    } catch (error) {
      setToast({
        kind: "error",
        message: error instanceof Error ? error.message : copy.error,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
                    callbackUrl.searchParams.set("action", "contribute");
                    callbackUrl.searchParams.set("slug", slug);

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
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-[var(--color-muted)]">{copy.editorHint}</p>
                  <button
                    type="button"
                    onClick={handleInsertTemplate}
                    className="inline-flex rounded-full border border-black/5 px-4 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:border-[var(--color-accent)]/20 hover:text-[var(--color-accent)] dark:border-white/10"
                  >
                    {copy.insertTemplate}
                  </button>
                </div>

                <PracticeRichEditor
                  value={editorHtml}
                  language={language}
                  onChange={setEditorHtml}
                  onImageAdd={addPendingImage}
                  onImageError={(message) =>
                    setToast({
                      kind: "error",
                      message,
                    })
                  }
                />
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
