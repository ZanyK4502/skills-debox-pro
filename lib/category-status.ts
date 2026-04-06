import { hasActiveSkillsInCategory } from "@/data/skills";

export type CategoryDisplayStatus = "ready" | "soon";

export function getCategoryDisplayStatus(
  categorySlug: string,
): CategoryDisplayStatus {
  return hasActiveSkillsInCategory(categorySlug) ? "ready" : "soon";
}
