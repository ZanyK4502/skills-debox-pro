import type { Skill } from "@/data/skills";

export function getSkillIdentifier(skill: Skill) {
  try {
    const url = new URL(skill.url);
    const lastSegment = url.pathname.split("/").filter(Boolean).pop();

    if (lastSegment) {
      return lastSegment.toLowerCase();
    }
  } catch {
    // Fall through to the name-based fallback below.
  }

  return skill.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSkillDisplayMeta(skill: Skill) {
  return {
    contributor: skill.contributor ?? "ZanyK4502",
    publishedAt: skill.publishedAt ?? "2026.4.6",
  };
}
