import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EEEAFD",
          borderRadius: 8,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <path
            d="M8 22L14 10L20 22"
            stroke="#6B4AE3"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11 22L17 10L23 22"
            stroke="#9B87F5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.65"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
