"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, { ensureLocaleLoaded } from "@/i18n";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(i18n.isInitialized);

  useEffect(() => {
    const lng = (i18n.language || "en").split("-")[0];
    if (lng === "en") {
      setReady(true);
      return;
    }
    void ensureLocaleLoaded(lng).then(() => setReady(true));
  }, []);

  if (!ready) return children;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
