import path from "path";

export const PRACTICE_SLUG_PATTERN = /^[a-z0-9-]+$/;

export function isValidPracticeSlug(slug: string) {
  return PRACTICE_SLUG_PATTERN.test(slug);
}

export function sanitizeContributorName(input: string) {
  const normalized = input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "contributor";
}

export function getPracticeDirectory(slug: string) {
  return path.join(process.cwd(), "content", "practices", slug);
}

export function getPracticeFilePath({
  slug,
  contributor,
  timestamp,
}: {
  slug: string;
  contributor: string;
  timestamp: number;
}) {
  return `content/practices/${slug}/${sanitizeContributorName(contributor)}-${timestamp}.md`;
}

export function getPracticeAssetDirectoryPath({
  slug,
  contributor,
  timestamp,
}: {
  slug: string;
  contributor: string;
  timestamp: number;
}) {
  return `content/practices/${slug}/assets/${sanitizeContributorName(contributor)}-${timestamp}`;
}

export function sanitizeAssetFilename(fileName: string) {
  const normalized = fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "image";
}

export function getRepositoryConfig() {
  return {
    owner: process.env.GITHUB_REPO_OWNER || "ZanyK4502",
    repo: process.env.GITHUB_REPO_NAME || "skills-debox-pro",
    branch: "main",
  };
}
