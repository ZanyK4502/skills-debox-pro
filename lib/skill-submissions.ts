import { categories } from "@/data/categories";

const SAFE_SLUG_PATTERN = /^[a-z0-9-]+$/;

export function normalizeSafeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSafeSlug(input: string) {
  return SAFE_SLUG_PATTERN.test(input);
}

export function isValidCategorySlug(categorySlug: string) {
  return categories.some((category) => category.slug === categorySlug);
}

export function formatPublishedAt(timestamp: number) {
  const date = new Date(timestamp);
  return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
}

export function getSubmittedSkillFilePath({
  categorySlug,
  timestamp,
  skillSlug,
}: {
  categorySlug: string;
  timestamp: number;
  skillSlug: string;
}) {
  return `data/submissions/skills/${categorySlug}/${timestamp}-${skillSlug}.json`;
}
