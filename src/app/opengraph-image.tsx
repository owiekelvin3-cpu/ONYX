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
          background: "linear-gradient(135deg, #f2f6f7 0%, #ffffff 50%, #eeeafd 100%)",
          color: "#0f172a",
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
              borderRadius: 14,
              background: "#eeeafd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                d="M8 22L14 10L20 22"
                stroke="#6B4AE3"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ fontSize: 48, fontWeight: 700 }}>{BRAND.name}</span>
        </div>
        <p style={{ fontSize: 36, fontWeight: 600, lineHeight: 1.3, maxWidth: 900 }}>
          {BRAND.tagline}
        </p>
        <p style={{ fontSize: 22, color: "#475569", marginTop: 24 }}>
          Crypto · Stocks · Forex — one dashboard
        </p>
      </div>
    ),
    { ...size }
  );
}
