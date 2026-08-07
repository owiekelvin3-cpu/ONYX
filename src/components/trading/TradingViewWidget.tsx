"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type TradingViewWidgetProps = {
  scriptSrc: string;
  config: Record<string, unknown>;
  className?: string;
  showAttribution?: boolean;
};

export function TradingViewWidget({
  scriptSrc,
  config,
  className,
  showAttribution = true,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const configKey = JSON.stringify(config);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.cssText = "height:100%;width:100%";
    container.appendChild(widget);

    const script = document.createElement("script");
    script.src = scriptSrc;
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = configKey;
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [scriptSrc, configKey]);

  return (
    <div
      className={cn(
        "tradingview-widget-container h-full w-full overflow-hidden",
        className
      )}
    >
      <div ref={containerRef} className="h-full w-full" />
      {showAttribution && (
        <div className="tradingview-widget-copyright px-2 py-1 text-[10px] text-text-tertiary border-t border-border">
          <a
            href="https://www.tradingview.com/"
            rel="noopener noreferrer nofollow"
            target="_blank"
            className="text-brand hover:underline"
          >
            Track all markets on TradingView
          </a>
        </div>
      )}
    </div>
  );
}
