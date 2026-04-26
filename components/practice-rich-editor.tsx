"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import { PRACTICE_IMAGE_MAX_SIZE_BYTES } from "@/lib/practice-editor";

export type PendingPracticeImage = {
  id: string;
  file: File;
  previewUrl: string;
  fileName: string;
};

interface PracticeRichEditorProps {
  value: string;
  language: "en" | "zh";
  onChange: (value: string) => void;
  onImageAdd: (image: PendingPracticeImage) => void;
  onImageError: (message: string) => void;
}

const editorContentClassName = [
  "min-h-[360px]",
  "[&_.ProseMirror]:min-h-[360px]",
  "[&_.ProseMirror]:focus:outline-none",
  "[&_.ProseMirror_p]:my-3",
  "[&_.ProseMirror_p]:text-[15px]",
  "[&_.ProseMirror_p]:leading-8",
  "[&_.ProseMirror_h1]:mb-5",
  "[&_.ProseMirror_h1]:mt-7",
  "[&_.ProseMirror_h1]:text-3xl",
  "[&_.ProseMirror_h1]:font-semibold",
  "[&_.ProseMirror_h1]:leading-tight",
  "[&_.ProseMirror_h2]:mb-4",
  "[&_.ProseMirror_h2]:mt-6",
  "[&_.ProseMirror_h2]:text-2xl",
  "[&_.ProseMirror_h2]:font-semibold",
  "[&_.ProseMirror_h2]:leading-tight",
  "[&_.ProseMirror_h3]:mb-3",
  "[&_.ProseMirror_h3]:mt-5",
  "[&_.ProseMirror_h3]:text-xl",
  "[&_.ProseMirror_h3]:font-semibold",
  "[&_.ProseMirror_h3]:leading-snug",
  "[&_.ProseMirror_strong]:font-semibold",
  "[&_.ProseMirror_em]:italic",
  "[&_.ProseMirror_a]:font-medium",
  "[&_.ProseMirror_a]:text-[var(--color-accent)]",
  "[&_.ProseMirror_a]:underline",
  "[&_.ProseMirror_a]:underline-offset-4",
  "[&_.ProseMirror_blockquote]:my-4",
  "[&_.ProseMirror_blockquote]:border-l-4",
  "[&_.ProseMirror_blockquote]:border-[var(--color-accent)]/45",
  "[&_.ProseMirror_blockquote]:bg-[var(--color-accent)]/8",
  "[&_.ProseMirror_blockquote]:px-4",
  "[&_.ProseMirror_blockquote]:py-2",
  "[&_.ProseMirror_ul]:my-4",
  "[&_.ProseMirror_ul]:list-disc",
  "[&_.ProseMirror_ul]:space-y-2",
  "[&_.ProseMirror_ul]:pl-6",
  "[&_.ProseMirror_ol]:my-4",
  "[&_.ProseMirror_ol]:list-decimal",
  "[&_.ProseMirror_ol]:space-y-2",
  "[&_.ProseMirror_ol]:pl-6",
  "[&_.ProseMirror_li]:pl-1",
  "[&_.ProseMirror_li_p]:my-1",
  "[&_.ProseMirror_code]:rounded-md",
  "[&_.ProseMirror_code]:bg-black/5",
  "[&_.ProseMirror_code]:px-1.5",
  "[&_.ProseMirror_code]:py-0.5",
  "[&_.ProseMirror_code]:font-mono",
  "dark:[&_.ProseMirror_code]:bg-white/10",
  "[&_.ProseMirror_img]:my-4",
  "[&_.ProseMirror_img]:max-h-[420px]",
  "[&_.ProseMirror_img]:rounded-xl",
  "[&_.ProseMirror_img]:border",
  "[&_.ProseMirror_img]:border-black/5",
  "[&_.ProseMirror_img]:object-contain",
  "dark:[&_.ProseMirror_img]:border-white/10",
  "[&_.ProseMirror_pre]:my-5",
  "[&_.ProseMirror_pre]:overflow-x-auto",
  "[&_.ProseMirror_pre]:rounded-xl",
  "[&_.ProseMirror_pre]:border",
  "[&_.ProseMirror_pre]:border-white/10",
  "[&_.ProseMirror_pre]:bg-neutral-950",
  "[&_.ProseMirror_pre]:px-4",
  "[&_.ProseMirror_pre]:py-4",
  "[&_.ProseMirror_pre]:text-sm",
  "[&_.ProseMirror_pre]:leading-7",
  "[&_.ProseMirror_pre]:text-white",
  "[&_.ProseMirror_pre_code]:bg-transparent",
  "[&_.ProseMirror_pre_code]:p-0",
  "[&_.ProseMirror_pre_code]:text-white",
].join(" ");

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: ReactNode;
}) {
  const runAction = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    onClick();
  };

  return (
    <button
      type="button"
      onMouseDown={runAction}
      onClick={(event) => {
        if (event.detail === 0) {
          runAction(event);
          return;
        }

        event.preventDefault();
      }}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition ${
        active
          ? "border-[var(--color-accent)]/25 bg-[var(--color-accent)]/12 text-[var(--color-accent)]"
          : "border-black/5 bg-white text-[var(--color-muted)] hover:border-[var(--color-accent)]/20 hover:text-[var(--color-foreground)] dark:border-white/10 dark:bg-[var(--surface)]"
      }`}
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}

export function PracticeRichEditor({
  value,
  language,
  onChange,
  onImageAdd,
  onImageError,
}: PracticeRichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const copy = useMemo(
    () =>
      language === "zh"
        ? {
            placeholder: "直接开始编写这条最佳实践...",
            imageTooLarge: "单张图片不能超过 2MB。",
            imageTypeError: "只能粘贴或拖拽图片文件。",
            addLink: "请输入链接地址",
            heading: "标题",
            bold: "加粗",
            italic: "斜体",
            quote: "引用",
            bullet: "无序列表",
            ordered: "有序列表",
            code: "代码块",
            link: "插入链接",
            image: "插入图片",
          }
        : {
            placeholder: "Start writing this best practice...",
            imageTooLarge: "Each image must be smaller than 2MB.",
            imageTypeError: "Only image files can be pasted or dropped here.",
            addLink: "Enter a link URL",
            heading: "Heading",
            bold: "Bold",
            italic: "Italic",
            quote: "Quote",
            bullet: "Bullet list",
            ordered: "Ordered list",
            code: "Code block",
            link: "Insert link",
            image: "Insert image",
          },
    [language],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Placeholder.configure({
        placeholder: copy.placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[320px] px-5 py-5 text-[15px] leading-7 text-[var(--color-foreground)] outline-none dark:prose-invert",
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []);
        const imageFiles = files.filter((file) => file.type.startsWith("image/"));

        if (imageFiles.length === 0) {
          return false;
        }

        event.preventDefault();
        imageFiles.forEach((file) => {
          insertImageFile(file);
        });

        return true;
      },
      handleDrop: (view, event) => {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFiles = files.filter((file) => file.type.startsWith("image/"));

        if (imageFiles.length === 0) {
          return false;
        }

        event.preventDefault();
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });

        imageFiles.forEach((file, index) => {
          insertImageFile(
            file,
            coordinates?.pos ? coordinates.pos + index : undefined,
          );
        });

        return true;
      },
    },
    onUpdate({ editor: nextEditor }) {
      onChange(nextEditor.getHTML());
    },
  });

  const insertImageFile = (file: File, dropPosition?: number) => {
    if (!file.type.startsWith("image/")) {
      onImageError(copy.imageTypeError);
      return false;
    }

    if (file.size > PRACTICE_IMAGE_MAX_SIZE_BYTES) {
      onImageError(copy.imageTooLarge);
      return false;
    }

    const previewUrl = URL.createObjectURL(file);
    const imageId = crypto.randomUUID();

    onImageAdd({
      id: imageId,
      file,
      previewUrl,
      fileName: file.name,
    });

    if (!editor) {
      return true;
    }

    const chain = editor.chain().focus();

    if (typeof dropPosition === "number") {
      chain.setTextSelection(dropPosition);
    }

    chain
      .setImage({
        src: previewUrl,
        alt: file.name,
        title: imageId,
      })
      .run();

    return true;
  };

  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentHtml = editor.getHTML();

    if (value !== currentHtml) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  const openImagePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    files.forEach((file) => {
      insertImageFile(file);
    });

    event.target.value = "";
  };

  const handleLinkInsert = () => {
    if (!editor) {
      return;
    }

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(copy.addLink, previousUrl ?? "");

    if (url === null) {
      return;
    }

    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-black/5 bg-white dark:border-white/10 dark:bg-[var(--surface-elevated)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-black/5 px-4 py-3 dark:border-white/10">
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor?.isActive("heading", { level: 1 })}
          title={`${copy.heading} 1`}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor?.isActive("heading", { level: 2 })}
          title={`${copy.heading} 2`}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor?.isActive("heading", { level: 3 })}
          title={`${copy.heading} 3`}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBold().run()}
          active={editor?.isActive("bold")}
          title={copy.bold}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          active={editor?.isActive("italic")}
          title={copy.italic}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          active={editor?.isActive("blockquote")}
          title={copy.quote}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          active={editor?.isActive("bulletList")}
          title={copy.bullet}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          active={editor?.isActive("orderedList")}
          title={copy.ordered}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
          active={editor?.isActive("codeBlock")}
          title={copy.code}
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={handleLinkInsert}
          active={editor?.isActive("link")}
          title={copy.link}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={openImagePicker} title={copy.image}>
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageSelection}
        />
      </div>

      <EditorContent
        editor={editor}
        className={editorContentClassName}
      />
    </div>
  );
}
