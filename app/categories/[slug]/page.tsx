import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryPageContent } from "@/components/category-page-content";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getBackupSkills, getFeaturedSkills } from "@/data/skills";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

const categoryMetadataBySlug: Record<
  string,
  { title: string; description: string }
> = {
  research: {
    title: "Research & Discovery",
    description:
      "Curated search, summarization, and research skills for information-heavy workflows.",
  },
  "content-creation-translation": {
    title: "Content Creation & Translation",
    description:
      "Writing, rewriting, translation, and content-organization skills.",
  },
  "productivity-automation": {
    title: "Productivity & Automation",
    description:
      "Skills for office workflows, repetitive tasks, and practical automation.",
  },
  "data-spreadsheets": {
    title: "Data Processing & Spreadsheets",
    description:
      "Skills for spreadsheet-heavy workflows, cleanup, analysis, and structured output.",
  },
  "development-programming": {
    title: "Development & Programming",
    description:
      "Skills for coding, debugging, refactoring, and developer productivity.",
  },
  "websites-frontend": {
    title: "Websites & Frontend",
    description:
      "Skills for site building, frontend work, components, and page optimization.",
  },
  "devops-cloud": {
    title: "DevOps, Deployment & Cloud",
    description:
      "Skills for deployment, environments, cloud operations, and service stability.",
  },
  "security-risk": {
    title: "Security & Risk",
    description:
      "Curated skills for audits, security review, deployment risk, and Web3 safety checks.",
  },
  "market-intelligence": {
    title: "Market Intelligence",
    description:
      "Skills covering macro context, prediction markets, and crypto market information.",
  },
  "image-video-generation": {
    title: "Image & Video Generation",
    description:
      "Skills for visual generation, asset production, and creative workflows.",
  },
  "system-cli": {
    title: "System Enhancement & CLI",
    description:
      "Skills for terminal assistance, local system enhancement, and environment management.",
  },
  "ai-workflows-agents": {
    title: "AI Workflows & Multi-Agent",
    description:
      "Skills for orchestration, task decomposition, and multi-agent execution.",
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const metadata = categoryMetadataBySlug[slug];

  if (!metadata) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  return metadata;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const featuredSkills = getFeaturedSkills(category.slug);
  const backupSkills = getBackupSkills(category.slug);

  return (
    <CategoryPageContent
      category={category}
      featuredSkills={featuredSkills}
      backupSkills={backupSkills}
    />
  );
}
