import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { getGitHubAppInstallationOctokit } from "@/lib/github-app";
import { sanitizeContributorName } from "@/lib/practices";
import {
  formatPublishedAt,
  getSubmittedSkillFilePath,
  isValidCategorySlug,
  isValidSafeSlug,
  normalizeSafeSlug,
} from "@/lib/skill-submissions";
import { getRepositoryConfig } from "@/lib/practices";
import type { Skill, SkillTier } from "@/data/skills";

export const runtime = "nodejs";

type SubmitSkillPayload = {
  categorySlug?: string;
  name?: string;
  tier?: SkillTier;
  url?: string;
  tags?: string[];
  summary?: string;
  useCases?: string;
  audience?: string;
  reason?: string;
};

function isValidTier(value: string): value is SkillTier {
  return value === "featured" || value === "backup";
}

function normalizeTags(tags: string[] | undefined) {
  const uniqueTags = Array.from(
    new Set(
      (tags ?? [])
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );

  return uniqueTags.slice(0, 5);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must sign in before submitting a new skill." },
        { status: 401 },
      );
    }

    const payload = (await request.json()) as SubmitSkillPayload;
    const categorySlug = String(payload.categorySlug ?? "").trim().toLowerCase();
    const name = String(payload.name ?? "").trim();
    const tier = String(payload.tier ?? "").trim();
    const url = String(payload.url ?? "").trim();
    const summary = String(payload.summary ?? "").trim();
    const useCases = String(payload.useCases ?? "").trim();
    const audience = String(payload.audience ?? "").trim();
    const reason = String(payload.reason ?? "").trim();
    const tags = normalizeTags(payload.tags);

    if (!name) {
      return NextResponse.json(
        { error: "Tool name is required." },
        { status: 400 },
      );
    }

    if (!isValidCategorySlug(categorySlug)) {
      return NextResponse.json(
        { error: "Invalid category slug." },
        { status: 400 },
      );
    }

    if (!isValidTier(tier)) {
      return NextResponse.json(
        { error: "Invalid tier. Please choose featured or backup." },
        { status: 400 },
      );
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Original link must be a valid URL." },
        { status: 400 },
      );
    }

    if (!/^https?:$/.test(parsedUrl.protocol)) {
      return NextResponse.json(
        { error: "Only http and https links are supported." },
        { status: 400 },
      );
    }

    const skillSlug = normalizeSafeSlug(name);

    if (!skillSlug || !isValidSafeSlug(skillSlug)) {
      return NextResponse.json(
        {
          error:
            "Failed to generate a safe skill slug. Please use letters, numbers, or common separators in the name.",
        },
        { status: 400 },
      );
    }

    const contributor = sanitizeContributorName(
      session.user.githubUsername ||
        session.user.name ||
        session.user.email?.split("@")[0] ||
        "contributor",
    );
    const timestamp = Date.now();
    const publishedAt = formatPublishedAt(timestamp);

    const submission: Skill = {
      name,
      categorySlug,
      tier,
      status: "active",
      tags,
      summary,
      useCases,
      audience,
      reason,
      url,
      publishedAt,
      contributor,
    };

    const { owner, repo, branch } = getRepositoryConfig();
    const octokit = await getGitHubAppInstallationOctokit();
    const latestRef = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });

    const latestCommitSha = latestRef.data.object.sha;
    const branchName = `submit-skill-${categorySlug}-${skillSlug}-${timestamp}`;

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

    const filePath = getSubmittedSkillFilePath({
      categorySlug,
      timestamp,
      skillSlug,
    });
    const fileContent = `${JSON.stringify(submission, null, 2)}\n`;

    const nextTree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: latestCommit.data.tree.sha,
      tree: [
        {
          path: filePath,
          mode: "100644",
          type: "blob",
          content: fileContent,
        },
      ],
    });

    const commit = await octokit.git.createCommit({
      owner,
      repo,
      message: `feat: submit new skill ${name}`,
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

    const pullRequest = await octokit.pulls.create({
      owner,
      repo,
      title: `feat: 提交新工具 [${name}]`,
      head: branchName,
      base: branch,
      body: [
        `This skill submission was contributed by @${contributor}.`,
        "",
        `Category: \`${categorySlug}\``,
        `Tier: \`${tier}\``,
        `JSON file: \`${filePath}\``,
      ].join("\n"),
    });

    return NextResponse.json({
      prUrl: pullRequest.data.html_url,
      branchName,
      filePath,
    });
  } catch (error) {
    console.error("Failed to submit skill:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to submit the new skill.",
      },
      { status: 500 },
    );
  }
}
