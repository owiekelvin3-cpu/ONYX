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
          background: "#F0B90B",
          borderRadius: 6,
        }}
      >
        <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
          <path d="M8 18L14 8L20 18H16.5L14 14.5L11.5 18H8Z" fill="#0B0E11" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
