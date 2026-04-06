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
  Heading2,
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
  return (
    <button
      type="button"
      onClick={onClick}
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
          levels: [2, 3],
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
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor?.isActive("heading", { level: 2 })}
          title={copy.heading}
        >
          <Heading2 className="h-4 w-4" />
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
        className="min-h-[360px] [&_.ProseMirror]:min-h-[360px] [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_img]:my-4 [&_.ProseMirror_img]:max-h-[420px] [&_.ProseMirror_img]:rounded-2xl [&_.ProseMirror_img]:border [&_.ProseMirror_img]:border-black/5 [&_.ProseMirror_img]:object-contain [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:rounded-2xl [&_.ProseMirror_pre]:bg-neutral-950 [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:text-white"
      />
    </div>
  );
}
