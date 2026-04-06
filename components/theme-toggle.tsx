"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeOption = {
  label: string;
  value: "system" | "light" | "dark";
  icon: typeof Laptop;
};

const themeOptions: ThemeOption[] = [
  { label: "System", value: "system", icon: Laptop },
  { label: "Light", value: "light", icon: Sun },
  { label: "Dark", value: "dark", icon: Moon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="inline-flex items-center rounded-full border border-black/5 bg-white/90 p-1 shadow-sm dark:border-white/10 dark:bg-[rgba(15,23,19,0.88)]">
      {themeOptions.map((option) => {
        const isActive = mounted ? theme === option.value : option.value === "system";
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
              isActive
                ? "bg-[var(--color-accent)] text-white shadow-sm"
                : "text-[var(--color-muted)] hover:bg-black/5 hover:text-[var(--color-foreground)] dark:hover:bg-white/8 dark:hover:text-[var(--color-foreground)]"
            }`}
            aria-label={option.label}
            title={option.label}
          >
            <Icon className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}
