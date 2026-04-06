"use client";

interface ToastMessageProps {
  kind: "success" | "error";
  message: string;
  onClose: () => void;
  linkUrl?: string;
  linkLabel?: string;
}

export function ToastMessage({
  kind,
  message,
  onClose,
  linkUrl,
  linkLabel,
}: ToastMessageProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[80] max-w-sm rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-xl dark:border-white/10 dark:bg-[var(--surface-elevated)]">
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 h-2.5 w-2.5 rounded-full ${
            kind === "success" ? "bg-[var(--color-accent)]" : "bg-red-500"
          }`}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            {message}
          </p>
          {linkUrl && linkLabel ? (
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex text-sm font-medium text-[var(--color-accent)] transition hover:opacity-80"
            >
              {linkLabel}
            </a>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-[var(--color-muted)] transition hover:text-[var(--color-foreground)]"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
}
