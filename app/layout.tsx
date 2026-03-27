import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://skills.debox.pro"),
  title: {
    default: "Clawhub Skills Guide",
    template: "%s | Clawhub Skills Guide",
  },
  description:
    "面向普通用户的 Clawhub skills 精选导航，先上线 12 个主分类中的 3 个已完成分类。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full font-sans text-[var(--color-foreground)]">
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
