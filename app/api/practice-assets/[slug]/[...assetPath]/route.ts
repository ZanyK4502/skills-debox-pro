import { readFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { getPracticeDirectory, isValidPracticeSlug } from "@/lib/practices";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    slug: string;
    assetPath: string[];
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug, assetPath } = await context.params;

  if (!isValidPracticeSlug(slug) || assetPath.length === 0) {
    return NextResponse.json({ error: "Invalid asset path." }, { status: 400 });
  }

  const practiceDirectory = getPracticeDirectory(slug);
  const resolvedAssetPath = path.resolve(
    practiceDirectory,
    ...assetPath,
  );
  const allowedRoot = path.resolve(practiceDirectory);

  if (!resolvedAssetPath.startsWith(allowedRoot)) {
    return NextResponse.json({ error: "Invalid asset path." }, { status: 400 });
  }

  try {
    const fileBuffer = await readFile(resolvedAssetPath);
    const extension = path.extname(resolvedAssetPath).toLowerCase();
    const contentTypeMap: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
    };

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentTypeMap[extension] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return NextResponse.json({ error: "Asset not found." }, { status: 404 });
    }

    console.error("Failed to read practice asset:", error);
    return NextResponse.json(
      { error: "Failed to load practice asset." },
      { status: 500 },
    );
  }
}
