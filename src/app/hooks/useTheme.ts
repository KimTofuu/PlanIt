"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "planit-theme";

const getPreferredTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyTheme = (theme: ThemeMode) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  const body = document.body;
  if (body) {
    body.dataset.theme = theme;
  }
};

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => "light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const preferred = getPreferredTheme();
    setTheme(preferred);
    applyTheme(preferred);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [isReady, theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      isReady,
    }),
    [theme, toggleTheme, isReady]
  );

  return value;
}
