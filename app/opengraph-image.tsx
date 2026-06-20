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
          background: "#08120f",
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
            background: "#0f1915",
            border: "2px solid #28392f",
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
              background: "#34d399",
            }}
          />
          <div style={{ color: "#5eead4", fontSize: 34 }}>
            Get chart-literate.
          </div>
        </div>

        {/* wordmark with candlestick "i" */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            color: "#e2ece7",
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
                background: "#5eead4",
                marginBottom: 16,
              }}
            />
            <div style={{ width: 18, height: 16, background: "#34d399" }} />
            <div
              style={{
                width: 64,
                height: 92,
                borderRadius: 10,
                background: "#34d399",
              }}
            />
            <div style={{ width: 18, height: 22, background: "#34d399" }} />
          </div>
          <div style={{ display: "flex" }}>k</div>
        </div>

        {/* subtitle */}
        <div style={{ color: "#88a298", fontSize: 40, marginTop: 40 }}>
          Candlesticks · Chart patterns · Market momentum
        </div>
      </div>
    ),
    { ...size },
  );
}
