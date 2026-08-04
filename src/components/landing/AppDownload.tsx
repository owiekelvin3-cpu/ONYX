import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Apple, Play } from "lucide-react";

export function AppDownload() {
  return (
    <section className="bg-bg-primary py-12 sm:py-16 lg:py-20 border-t border-border">
      <div className="container-app">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          <div className="w-full max-w-md text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-balance">
              Trade Anywhere with the {BRAND.name} App
            </h2>
            <p className="text-sm text-text-tertiary mt-2 leading-relaxed">
              Download for iOS and Android. Full trading, biometric login, and price alerts.
            </p>
            <div className="flex flex-col xs:flex-row flex-wrap justify-center lg:justify-start gap-3 mt-6">
              <Link
                href="/download"
                className="flex items-center justify-center gap-2 h-11 px-5 bg-bg-secondary border border-border rounded hover:border-border-light transition-colors touch-target w-full xs:w-auto"
              >
                <Apple className="w-5 h-5 text-text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] text-text-tertiary leading-none">Download on the</p>
                  <p className="text-xs font-semibold text-text-primary">App Store</p>
                </div>
              </Link>
              <Link
                href="/download"
                className="flex items-center justify-center gap-2 h-11 px-5 bg-bg-secondary border border-border rounded hover:border-border-light transition-colors touch-target w-full xs:w-auto"
              >
                <Play className="w-5 h-5 text-text-primary shrink-0" />
                <div className="text-left">
                  <p className="text-[9px] text-text-tertiary leading-none">Get it on</p>
                  <p className="text-xs font-semibold text-text-primary">Google Play</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="w-[200px] h-[400px] sm:w-[240px] sm:h-[480px] bg-bg-secondary border-2 border-border rounded-[2rem] p-2.5 sm:p-3 shrink-0 mx-auto lg:mx-0">
            <div className="w-full h-full bg-bg-primary rounded-[1.5rem] overflow-hidden flex flex-col">
              <div className="px-3 sm:px-4 pt-5 sm:pt-6 pb-3">
                <p className="text-[10px] text-text-tertiary">Portfolio</p>
                <p className="text-lg sm:text-xl font-bold text-text-primary mt-0.5">$24,891.50</p>
                <p className="text-[10px] text-green mt-0.5">+$312.40 (1.27%)</p>
              </div>
              <div className="flex-1 px-2 sm:px-3 space-y-1.5 sm:space-y-2 overflow-hidden">
                {[
                  { sym: "BTC", price: "97,234", chg: "+2.34%", up: true },
                  { sym: "ETH", price: "3,456", chg: "+1.87%", up: true },
                  { sym: "SOL", price: "187.42", chg: "-0.56%", up: false },
                  { sym: "AAPL", price: "228.45", chg: "+0.67%", up: true },
                ].map((a) => (
                  <div key={a.sym} className="flex items-center justify-between bg-bg-secondary rounded px-2.5 sm:px-3 py-2 sm:py-2.5">
                    <span className="text-xs font-medium">{a.sym}</span>
                    <div className="text-right">
                      <p className="text-[11px] font-mono">${a.price}</p>
                      <p className={`text-[10px] font-mono ${a.up ? "text-green" : "text-red"}`}>{a.chg}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2.5 sm:p-3 border-t border-border">
                <Link href="/register">
                  <Button className="w-full" size="sm">Start Trading</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
