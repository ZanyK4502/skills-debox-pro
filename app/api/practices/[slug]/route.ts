import { promises as fs } from "fs";
import path from "path";

import matter from "gray-matter";
import { NextResponse } from "next/server";

import {
  getPracticeDirectory,
  isValidPracticeSlug,
} from "@/lib/practices";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;

  if (!isValidPracticeSlug(slug)) {
    return NextResponse.json(
      { error: "Invalid practice slug." },
      { status: 400 },
    );
  }

  const practiceDirectory = getPracticeDirectory(slug);

  try {
    const files = await fs.readdir(practiceDirectory);
    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    const practices = await Promise.all(
      markdownFiles.map(async (fileName) => {
        const absolutePath = path.join(practiceDirectory, fileName);
        const [content, stats] = await Promise.all([
          fs.readFile(absolutePath, "utf8"),
          fs.stat(absolutePath),
        ]);
        const parsedContent = matter(content);
        const contentWithResolvedAssets = parsedContent.content.replaceAll(
          "(./assets/",
          `(/api/practice-assets/${slug}/assets/`,
        );

        const practiceId = fileName.replace(/\.md$/i, "");
        const contributor =
          typeof parsedContent.data.contributor === "string" &&
          parsedContent.data.contributor.trim()
            ? parsedContent.data.contributor.trim()
            : practiceId.replace(/-\d+$/, "") || "contributor";
        const publishedAt =
          typeof parsedContent.data.publishedAt === "string" &&
          parsedContent.data.publishedAt.trim()
            ? parsedContent.data.publishedAt.trim()
            : null;

        return {
          id: practiceId,
          title: practiceId.replace(/-/g, " "),
          contributor,
          publishedAt,
          content: contentWithResolvedAssets,
          updatedAt: stats.mtime.toISOString(),
        };
      }),
    );

    practices.sort((left, right) => {
      return right.updatedAt.localeCompare(left.updatedAt);
    });

    return NextResponse.json({ practices });
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return NextResponse.json({ practices: [] });
    }

    console.error("Failed to load best practices:", error);
    return NextResponse.json(
      { error: "Failed to load best practices." },
      { status: 500 },
    );
  }
}
