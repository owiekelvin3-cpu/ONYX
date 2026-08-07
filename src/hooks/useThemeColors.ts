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
    brand: "#2962FF",
    textTertiary: "#787B86",
    bgSecondary: "#1E222D",
    border: "#2A2E39",
    textPrimary: "#D1D4DC",
  });

  useEffect(() => {
    setColors({
      brand: readCssVar("--brand", "#2962FF"),
      textTertiary: readCssVar("--text-tertiary", "#787B86"),
      bgSecondary: readCssVar("--bg-secondary", "#1E222D"),
      border: readCssVar("--border", "#2A2E39"),
      textPrimary: readCssVar("--text-primary", "#D1D4DC"),
    });
  }, [theme, mounted]);

  return colors;
}
