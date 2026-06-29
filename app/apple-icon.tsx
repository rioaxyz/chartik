import { ImageResponse } from "next/og";

// Apple touch icon (home-screen / high-res contexts). Next.js auto-wires it.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0b0e14",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* tittle (dot of the i) */}
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 5,
              background: "#7c6af7",
              marginBottom: 10,
            }}
          />
          {/* upper wick */}
          <div style={{ width: 14, height: 16, background: "#26a69a" }} />
          {/* body */}
          <div
            style={{
              width: 52,
              height: 64,
              borderRadius: 8,
              background: "#26a69a",
            }}
          />
          {/* lower wick */}
          <div style={{ width: 14, height: 16, background: "#26a69a" }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
