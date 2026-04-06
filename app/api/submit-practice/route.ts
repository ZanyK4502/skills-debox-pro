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

    // 3. Read the latest commit from main so the contribution branch starts from the current head.
    const latestRef = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const latestCommitSha = latestRef.data.object.sha;
    const branchName = `practice-${slug}-${timestamp}`;

    // 4. Create an isolated branch for this contribution.
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

    // 5. Build Git tree entries for any pasted or dropped images.
    const imageTreeEntries = await Promise.all(
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

        return {
          path: repositoryAssetPath,
          mode: "100644" as const,
          type: "blob" as const,
          content: imageBuffer.toString("base64"),
          encoding: "base64" as const,
        };
      }),
    );

    // 6. Convert the rich text HTML into Markdown only after every temporary image URL
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
