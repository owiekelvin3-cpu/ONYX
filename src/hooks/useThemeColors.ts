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
    brand: "#5046E5",
    textTertiary: "#A1A1AA",
    bgSecondary: "#FFFFFF",
    border: "#E4E4EC",
    textPrimary: "#0A0A0F",
  });

  useEffect(() => {
    setColors({
      brand: readCssVar("--brand", "#5046E5"),
      textTertiary: readCssVar("--text-tertiary", "#A1A1AA"),
      bgSecondary: readCssVar("--bg-secondary", "#FFFFFF"),
      border: readCssVar("--border", "#E4E4EC"),
      textPrimary: readCssVar("--text-primary", "#0A0A0F"),
    });
  }, [theme, mounted]);

  return colors;
}
