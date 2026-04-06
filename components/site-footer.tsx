"use client";

import { GitBranch } from "lucide-react";
import Image from "next/image";

import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { dictionary, language } = useLanguage();

  return (
    <footer className="mt-20 bg-[#0A0A0A] text-gray-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-16 text-sm sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p>{dictionary.footer.tagline}</p>
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://github.com/ZanyK4502/skills-debox-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-300 transition hover:text-white"
            >
              <GitBranch className="h-4 w-4" />
              <span>GitHub</span>
            </a>

            <a
              href="https://debox.pro/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center transition hover:opacity-90"
            >
              <Image
                src="/debox-logo.png"
                alt="DeBox"
                width={108}
                height={28}
                className="h-7 w-auto object-contain"
              />
              <span className="sr-only">
                {language === "zh" ? "访问 DeBox 官网" : "Visit DeBox"}
              </span>
            </a>

            <a
              href="https://clawhub.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center transition hover:opacity-90"
            >
              <Image
                src="/clawhub-logo.png"
                alt="Clawhub"
                width={104}
                height={28}
                className="h-7 w-auto object-contain"
              />
              <span className="sr-only">
                {language === "zh" ? "访问 Clawhub 官网" : "Visit Clawhub"}
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
