"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

function readCssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  );
}

export function useThemeColors() {
  const { theme, mounted } = useTheme();
  const [colors, setColors] = useState({
    brand: "#6B4AE3",
    textTertiary: "#94A3B8",
    bgSecondary: "#FFFFFF",
    border: "#E5E9EE",
    textPrimary: "#0F172A",
  });

  useEffect(() => {
    setColors({
      brand: readCssVar("--brand", "#6B4AE3"),
      textTertiary: readCssVar("--text-tertiary", "#94A3B8"),
      bgSecondary: readCssVar("--bg-secondary", "#FFFFFF"),
      border: readCssVar("--border", "#E5E9EE"),
      textPrimary: readCssVar("--text-primary", "#0F172A"),
    });
  }, [theme, mounted]);

  return colors;
}
