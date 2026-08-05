import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/constants";

export const alt = `${BRAND.fullName} — ${BRAND.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0b0e11 0%, #181a20 50%, #0b0e11 100%)",
          color: "#eaecef",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#f0b90b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#0b0e11",
            }}
          >
            O
          </div>
          <span style={{ fontSize: 48, fontWeight: 700 }}>{BRAND.name}</span>
        </div>
        <p style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.3, maxWidth: 900 }}>
          {BRAND.tagline}
        </p>
        <p style={{ fontSize: 22, color: "#848e9c", marginTop: 24 }}>
          Crypto · Stocks · Forex — one dashboard
        </p>
      </div>
    ),
    { ...size }
  );
}
