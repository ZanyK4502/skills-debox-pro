import "server-only";

import { readdir, readFile } from "fs/promises";
import path from "path";

import { skills, type Skill } from "@/data/skills";

type CategoryDisplayStatus = "ready" | "soon";

const submissionsRoot = path.join(
  process.cwd(),
  "data",
  "submissions",
  "skills",
);

async function collectJsonFiles(directoryPath: string): Promise<string[]> {
  try {
    const entries = await readdir(directoryPath, { withFileTypes: true });
    const nestedFiles = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(directoryPath, entry.name);

        if (entry.isDirectory()) {
          return collectJsonFiles(fullPath);
        }

        if (entry.isFile() && entry.name.endsWith(".json")) {
          return [fullPath];
        }

        return [];
      }),
    );

    return nestedFiles.flat();
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

function isSkillTier(value: unknown): value is Skill["tier"] {
  return value === "featured" || value === "backup";
}

function isLifecycleStatus(value: unknown): value is Skill["status"] {
  return value === "active" || value === "archived" || value === undefined;
}

function normalizeSkillPayload(payload: unknown): Skill | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Partial<Skill>;

  if (
    typeof candidate.name !== "string" ||
    typeof candidate.categorySlug !== "string" ||
    !isSkillTier(candidate.tier) ||
    !Array.isArray(candidate.tags) ||
    typeof candidate.summary !== "string" ||
    typeof candidate.useCases !== "string" ||
    typeof candidate.audience !== "string" ||
    typeof candidate.reason !== "string" ||
    typeof candidate.url !== "string" ||
    !isLifecycleStatus(candidate.status)
  ) {
    return null;
  }

  return {
    name: candidate.name,
    categorySlug: candidate.categorySlug,
    tier: candidate.tier,
    status: candidate.status,
    tags: candidate.tags.filter((tag): tag is string => typeof tag === "string"),
    summary: candidate.summary,
    useCases: candidate.useCases,
    audience: candidate.audience,
    reason: candidate.reason,
    url: candidate.url,
    contributor:
      typeof candidate.contributor === "string"
        ? candidate.contributor
        : undefined,
    publishedAt:
      typeof candidate.publishedAt === "string"
        ? candidate.publishedAt
        : undefined,
  };
}

export async function getSubmittedSkills(): Promise<Skill[]> {
  const files = await collectJsonFiles(submissionsRoot);

  const parsedSkills = await Promise.all(
    files.map(async (filePath) => {
      try {
        const raw = await readFile(filePath, "utf8");
        const parsed = JSON.parse(raw) as unknown;
        return normalizeSkillPayload(parsed);
      } catch {
        return null;
      }
    }),
  );

  return parsedSkills.filter((skill): skill is Skill => skill !== null);
}

export async function getDisplaySkills(): Promise<Skill[]> {
  const submittedSkills = await getSubmittedSkills();
  return [...skills, ...submittedSkills];
}

export async function getDisplaySkillsByCategory(
  categorySlug: string,
): Promise<Skill[]> {
  const allSkills = await getDisplaySkills();
  return allSkills.filter((skill) => skill.categorySlug === categorySlug);
}

export async function getDisplayFeaturedSkills(
  categorySlug: string,
): Promise<Skill[]> {
  const skillsByCategory = await getDisplaySkillsByCategory(categorySlug);
  return skillsByCategory.filter(
    (skill) => skill.tier === "featured" && skill.status !== "archived",
  );
}

export async function getDisplayBackupSkills(
  categorySlug: string,
): Promise<Skill[]> {
  const skillsByCategory = await getDisplaySkillsByCategory(categorySlug);
  return skillsByCategory.filter(
    (skill) => skill.tier === "backup" && skill.status !== "archived",
  );
}

export async function getDisplayArchivedSkills(
  categorySlug: string,
): Promise<Skill[]> {
  const skillsByCategory = await getDisplaySkillsByCategory(categorySlug);
  return skillsByCategory.filter((skill) => skill.status === "archived");
}

export async function getCategoryDisplayStatus(
  categorySlug: string,
): Promise<CategoryDisplayStatus> {
  const skillsByCategory = await getDisplaySkillsByCategory(categorySlug);
  const hasActiveSkills = skillsByCategory.some(
    (skill) => skill.status !== "archived",
  );

  return hasActiveSkills ? "ready" : "soon";
}

export async function getCategoryDisplayStatuses(categorySlugs: string[]) {
  const allSkills = await getDisplaySkills();

  return Object.fromEntries(
    categorySlugs.map((categorySlug) => {
      const hasActiveSkills = allSkills.some(
        (skill) =>
          skill.categorySlug === categorySlug && skill.status !== "archived",
      );

      return [categorySlug, hasActiveSkills ? "ready" : "soon"];
    }),
  ) as Record<string, CategoryDisplayStatus>;
}
