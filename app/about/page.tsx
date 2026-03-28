import type { Metadata } from "next";

import { AboutPageContent } from "@/components/about-page-content";

export const metadata: Metadata = {
  title: "About / Methodology",
  description:
    "Why Clawhub Skills Guide exists, how categories are defined, and how recommendations are selected.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
