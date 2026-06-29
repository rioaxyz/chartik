import { ImageResponse } from "next/og";

// Open Graph / social link-preview image (also used as the Twitter card).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Chartik — Get chart-literate.";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0b0e14",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* tagline pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "#131720",
            border: "2px solid #252d3d",
            borderRadius: 999,
            padding: "12px 28px",
            marginBottom: 44,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              background: "#26a69a",
            }}
          />
          <div style={{ color: "#7c6af7", fontSize: 34 }}>
            Get chart-literate.
          </div>
        </div>

        {/* wordmark with candlestick "i" */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            color: "#e8eaf0",
            fontSize: 176,
            fontWeight: 800,
            letterSpacing: -4,
          }}
        >
          <div style={{ display: "flex" }}>Chart</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "0 10px 18px",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "#7c6af7",
                marginBottom: 16,
              }}
            />
            <div style={{ width: 18, height: 16, background: "#26a69a" }} />
            <div
              style={{
                width: 64,
                height: 92,
                borderRadius: 10,
                background: "#26a69a",
              }}
            />
            <div style={{ width: 18, height: 22, background: "#26a69a" }} />
          </div>
          <div style={{ display: "flex" }}>k</div>
        </div>

        {/* subtitle */}
        <div style={{ color: "#7b8499", fontSize: 40, marginTop: 40 }}>
          Candlesticks · Chart patterns · Market momentum
        </div>
      </div>
    ),
    { ...size },
  );
}
