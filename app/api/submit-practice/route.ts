import path from "path";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getGitHubAppInstallationOctokit } from "@/lib/github-app";
import { htmlToMarkdown } from "@/lib/markdown";
import { PRACTICE_IMAGE_MAX_SIZE_BYTES } from "@/lib/practice-editor";
import {
  getPracticeAssetDirectoryPath,
  getPracticeFilePath,
  getRepositoryConfig,
  isValidPracticeSlug,
  sanitizeAssetFilename,
  sanitizeContributorName,
} from "@/lib/practices";

export const runtime = "nodejs";

type ImageManifestItem = {
  id: string;
  src: string;
  fileName: string;
};

const EXTERNAL_IMAGE_DOWNLOAD_ERROR =
  "External image download failed. Please upload the image file directly or paste a screenshot.";
const EXTERNAL_IMAGE_FETCH_TIMEOUT_MS = 10_000;

function formatPublishedDate(timestamp: number) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function getFallbackExtension(fileName: string, mimeType: string) {
  const extension = path.extname(fileName);

  if (extension) {
    return extension;
  }

  const fallbackMap: Record<string, string> = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  };

  return fallbackMap[mimeType] ?? ".png";
}

function getImageSourcesFromHtml(html: string) {
  const sources = new Set<string>();
  const quotedSourcePattern = /<img\b[^>]*\bsrc=(["'])(.*?)\1/gi;
  const unquotedSourcePattern = /<img\b[^>]*\bsrc=([^\s>]+)/gi;

  for (const match of html.matchAll(quotedSourcePattern)) {
    const source = match[2]?.trim();

    if (source) {
      sources.add(source);
    }
  }

  for (const match of html.matchAll(unquotedSourcePattern)) {
    const source = match[1]?.trim();

    if (source) {
      sources.add(source);
    }
  }

  return Array.from(sources);
}

function isExternalHttpImageSource(source: string) {
  try {
    const url = new URL(source);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getFileNameFromImageUrl(source: string) {
  try {
    const url = new URL(source);
    const fileName = decodeURIComponent(path.basename(url.pathname));

    return fileName || "external-image";
  } catch {
    return "external-image";
  }
}

async function downloadExternalImage(source: string) {
  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    EXTERNAL_IMAGE_FETCH_TIMEOUT_MS,
  );

  try {
    const response = await fetch(source, {
      signal: abortController.signal,
      headers: {
        Accept: "image/*",
      },
    });

    if (!response.ok) {
      throw new Error(EXTERNAL_IMAGE_DOWNLOAD_ERROR);
    }

    const mimeType = response.headers.get("content-type")?.split(";")[0] ?? "";

    if (!mimeType.startsWith("image/")) {
      throw new Error(EXTERNAL_IMAGE_DOWNLOAD_ERROR);
    }

    const contentLength = Number(response.headers.get("content-length") ?? 0);

    if (contentLength > PRACTICE_IMAGE_MAX_SIZE_BYTES) {
      throw new Error(EXTERNAL_IMAGE_DOWNLOAD_ERROR);
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    if (imageBuffer.length > PRACTICE_IMAGE_MAX_SIZE_BYTES) {
      throw new Error(EXTERNAL_IMAGE_DOWNLOAD_ERROR);
    }

    return {
      imageBuffer,
      mimeType,
    };
  } catch {
    throw new Error(EXTERNAL_IMAGE_DOWNLOAD_ERROR);
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  try {
    // 1. Verify the session before doing anything with the repository.
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must sign in before submitting a best practice." },
        { status: 401 },
      );
    }

    // 2. Parse the multipart payload coming from the rich text editor.
    const formData = await request.formData();
    const slug = String(formData.get("slug") ?? "")
      .trim()
      .toLowerCase();
    const htmlContent = String(formData.get("htmlContent") ?? "").trim();
    const rawImageManifest = String(formData.get("imageManifest") ?? "[]");

    if (!isValidPracticeSlug(slug)) {
      return NextResponse.json(
        {
          error:
            "Invalid slug. Only lowercase letters, numbers, and hyphens are allowed.",
        },
        { status: 400 },
      );
    }

    if (!htmlContent) {
      return NextResponse.json(
        { error: "Editor content is required." },
        { status: 400 },
      );
    }

    let imageManifest: ImageManifestItem[] = [];

    try {
      imageManifest = JSON.parse(rawImageManifest) as ImageManifestItem[];
    } catch {
      return NextResponse.json(
        { error: "Invalid image manifest payload." },
        { status: 400 },
      );
    }

    const contributorUsername = sanitizeContributorName(
      session.user.githubUsername ||
        session.user.name ||
        session.user.email?.split("@")[0] ||
        "contributor",
    );

    const { owner, repo, branch } = getRepositoryConfig();
    const octokit = await getGitHubAppInstallationOctokit();
    const timestamp = Date.now();
    const publishedAt = formatPublishedDate(timestamp);
    const branchName = `practice-${slug}-${timestamp}`;
    const practiceFilePath = getPracticeFilePath({
      slug,
      contributor: contributorUsername,
      timestamp,
    });

    const assetDirectoryPath = getPracticeAssetDirectoryPath({
      slug,
      contributor: contributorUsername,
      timestamp,
    });

    let htmlWithRepositoryImages = htmlContent;

    // 3. Build Git tree entries for any pasted, dropped, or externally linked images.
    const uploadedImageTreeEntries = await Promise.all(
      imageManifest.map(async (image, index) => {
        const uploadedFile = formData.get(`image:${image.id}`);

        if (!(uploadedFile instanceof File)) {
          throw new Error(`Missing uploaded file for image "${image.id}".`);
        }

        if (!uploadedFile.type.startsWith("image/")) {
          throw new Error(`Unsupported image type for "${uploadedFile.name}".`);
        }

        if (uploadedFile.size > PRACTICE_IMAGE_MAX_SIZE_BYTES) {
          throw new Error(
            `Image "${uploadedFile.name}" exceeds the 2MB upload limit.`,
          );
        }

        const sanitizedName = sanitizeAssetFilename(image.fileName);
        const extension = getFallbackExtension(sanitizedName, uploadedFile.type);
        const baseName = sanitizedName.replace(/\.[^.]+$/, "") || "image";
        const assetFileName = `${String(index + 1).padStart(2, "0")}-${baseName}${extension}`;
        const relativeMarkdownPath = `./assets/${contributorUsername}-${timestamp}/${assetFileName}`;
        const repositoryAssetPath = `${assetDirectoryPath}/${assetFileName}`;

        const imageBuffer = Buffer.from(await uploadedFile.arrayBuffer());

        // Replace temporary blob URLs in the editor HTML with repository-relative asset paths
        // before converting the content into Markdown.
        htmlWithRepositoryImages = htmlWithRepositoryImages.split(image.src).join(
          relativeMarkdownPath,
        );

        const imageBlob = await octokit.git.createBlob({
          owner,
          repo,
          content: imageBuffer.toString("base64"),
          encoding: "base64",
        });

        return {
          path: repositoryAssetPath,
          mode: "100644" as const,
          type: "blob" as const,
          sha: imageBlob.data.sha,
        };
      }),
    );

    const externalImageSources = getImageSourcesFromHtml(htmlWithRepositoryImages).filter(
      isExternalHttpImageSource,
    );

    const externalImageTreeEntries = await Promise.all(
      externalImageSources.map(async (source, index) => {
        const { imageBuffer, mimeType } = await downloadExternalImage(source);
        const sanitizedName = sanitizeAssetFilename(getFileNameFromImageUrl(source));
        const extension = getFallbackExtension(sanitizedName, mimeType);
        const baseName = sanitizedName.replace(/\.[^.]+$/, "") || "external-image";
        const imageNumber = imageManifest.length + index + 1;
        const assetFileName = `${String(imageNumber).padStart(2, "0")}-${baseName}${extension}`;
        const relativeMarkdownPath = `./assets/${contributorUsername}-${timestamp}/${assetFileName}`;
        const repositoryAssetPath = `${assetDirectoryPath}/${assetFileName}`;

        htmlWithRepositoryImages = htmlWithRepositoryImages
          .split(source)
          .join(relativeMarkdownPath);

        const imageBlob = await octokit.git.createBlob({
          owner,
          repo,
          content: imageBuffer.toString("base64"),
          encoding: "base64",
        });

        return {
          path: repositoryAssetPath,
          mode: "100644" as const,
          type: "blob" as const,
          sha: imageBlob.data.sha,
        };
      }),
    );

    const imageTreeEntries = [
      ...uploadedImageTreeEntries,
      ...externalImageTreeEntries,
    ];

    // 4. Convert the rich text HTML into Markdown only after every image URL
    //    has been replaced with the final repository-relative asset path.
    const markdownBody = htmlToMarkdown(htmlWithRepositoryImages);

    if (!markdownBody.trim()) {
      return NextResponse.json(
        { error: "Markdown output is empty after conversion." },
        { status: 400 },
      );
    }

    const markdownContent = [
      "---",
      `contributor: ${contributorUsername}`,
      `publishedAt: ${publishedAt}`,
      "---",
      "",
      markdownBody,
    ].join("\n");

    // 5. Read the latest commit from main so the contribution branch starts from the current head.
    const latestRef = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const latestCommitSha = latestRef.data.object.sha;

    // 6. Create an isolated branch for this contribution.
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha: latestCommitSha,
    });

    const latestCommit = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    });

    // 7. Create a new tree containing the Markdown document plus any referenced image assets.
    const nextTree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: latestCommit.data.tree.sha,
      tree: [
        {
          path: practiceFilePath,
          mode: "100644",
          type: "blob",
          content: markdownContent,
        },
        ...imageTreeEntries,
      ],
    });

    // 8. Commit the new tree on the contribution branch.
    const commit = await octokit.git.createCommit({
      owner,
      repo,
      message: `[Practice] Add best practice for ${slug}`,
      tree: nextTree.data.sha,
      parents: [latestCommitSha],
    });

    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
      sha: commit.data.sha,
      force: false,
    });

    // 9. Create a pull request back to main with the contributor attribution preserved.
    const pullRequest = await octokit.pulls.create({
      owner,
      repo,
      title: `[Practice] Add best practice for ${slug}`,
      head: branchName,
      base: branch,
      body: [
        `This best practice was contributed by @${contributorUsername}.`,
        "",
        `Markdown file: \`${practiceFilePath}\``,
      ].join("\n"),
    });

    return NextResponse.json({
      prUrl: pullRequest.data.html_url,
      branchName,
      filePath: practiceFilePath,
    });
  } catch (error) {
    console.error("Failed to submit best practice:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit best practice.",
      },
      { status: 500 },
    );
  }
}
