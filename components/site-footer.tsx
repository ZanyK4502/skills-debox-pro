"use client";

import { useLanguage } from "@/components/language-provider";

export function SiteFooter() {
  const { dictionary } = useLanguage();

  return (
    <footer className="mt-20 bg-[#0A0A0A] text-gray-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-5 py-16 text-sm md:flex-row md:items-center md:justify-between sm:px-6 lg:px-8">
        <p>{dictionary.footer.tagline}</p>
      </div>
    </footer>
  );
}
