import { Candle, Marker, isBullish } from "@/lib/types";

interface Props {
  candles: Candle[];
  /** Optional fixed height; defaults adapt to candle count. */
  height?: number;
  /** Lettered locations to overlay on the chart. */
  markers?: Marker[];
  /** After answering: the correct marker label (turns green). */
  revealCorrect?: string | null;
  /** After answering: the label the user picked (turns red if wrong). */
  revealPicked?: string | null;
}

const BULL = "#26a69a";
const BEAR = "#ef5350";
const ACCENT = "#7c6af7";
const GOOD = "#26a69a";
const BAD = "#ef5350";

/**
 * Renders an OHLC series as an SVG candlestick chart. Pure/deterministic — the
 * same candles always produce the same SVG, so it is safe to render on the
 * server and hydrate on the client without mismatches. Optionally overlays
 * lettered markers (for "Buy / Sell / Stop" questions).
 */
export default function CandlestickChart({
  candles,
  height = 320,
  markers,
  revealCorrect,
  revealPicked,
}: Props) {
  const n = candles.length;
  // Make a single candle look like a portrait, many candles look like a chart.
  const slotWidth = n <= 1 ? 90 : n <= 6 ? 56 : 30;
  const padX = 24;
  const padY = 24;
  // Reserve vertical headroom for marker labels so they never clip.
  const mPad = markers && markers.length ? 34 : 0;
  const width = padX * 2 + slotWidth * n;
  const plotTop = padY + mPad;
  const plotBottom = height - padY - mPad;
  const plotH = plotBottom - plotTop;

  const highest = Math.max(...candles.map((c) => c.high));
  const lowest = Math.min(...candles.map((c) => c.low));
  const range = highest - lowest || 1;

  // Map a price to a Y coordinate (higher price = lower Y).
  const y = (price: number) => plotTop + ((highest - price) / range) * plotH;

  const bodyWidth = Math.max(6, slotWidth * 0.6);

  // A few horizontal gridlines for context.
  const gridLines = 4;
  const grid = Array.from({ length: gridLines + 1 }, (_, i) => {
    const price = lowest + (range * i) / gridLines;
    return { yPos: y(price), price };
  });

  const markerR = 15;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Candlestick chart with ${n} candle${n === 1 ? "" : "s"}`}
        className="mx-auto block"
      >
        {/* gridlines */}
        {grid.map((g, i) => (
          <g key={i}>
            <line
              x1={padX}
              x2={width - padX}
              y1={g.yPos}
              y2={g.yPos}
              stroke="#252d3d"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <text
              x={width - padX + 2}
              y={g.yPos + 3}
              fontSize={9}
              fill="#7b8499"
              fontFamily="ui-monospace, monospace"
            >
              {g.price.toFixed(0)}
            </text>
          </g>
        ))}

        {/* candles */}
        {candles.map((c, i) => {
          const cx = padX + slotWidth * i + slotWidth / 2;
          const up = isBullish(c);
          const color = up ? BULL : BEAR;
          const bodyTop = y(Math.max(c.open, c.close));
          const bodyBottom = y(Math.min(c.open, c.close));
          const bodyH = Math.max(1, bodyBottom - bodyTop);
          return (
            <g key={i}>
              {/* wick */}
              <line
                x1={cx}
                x2={cx}
                y1={y(c.high)}
                y2={y(c.low)}
                stroke={color}
                strokeWidth={Math.max(1.5, bodyWidth * 0.12)}
              />
              {/* body */}
              <rect
                x={cx - bodyWidth / 2}
                y={bodyTop}
                width={bodyWidth}
                height={bodyH}
                fill={color}
                rx={1.5}
              />
            </g>
          );
        })}

        {/* lettered markers */}
        {markers?.map((m) => {
          const c = candles[m.index];
          if (!c) return null;
          const cx = padX + slotWidth * m.index + slotWidth / 2;
          const above = (m.at ?? "high") === "high";
          const anchorY = above ? y(c.high) : y(c.low);
          const labelY = above
            ? Math.max(padY + markerR, anchorY - 26)
            : Math.min(height - padY - markerR, anchorY + 26);

          // Color: reveal correct/incorrect after answering, else accent.
          let color = ACCENT;
          if (revealCorrect) {
            if (m.label === revealCorrect) color = GOOD;
            else if (m.label === revealPicked) color = BAD;
            else color = "#5b6b63";
          }

          return (
            <g key={m.label}>
              <line
                x1={cx}
                y1={anchorY}
                x2={cx}
                y2={above ? labelY + markerR : labelY - markerR}
                stroke={color}
                strokeWidth={1.5}
                strokeDasharray="2 3"
                opacity={0.8}
              />
              <circle
                cx={cx}
                cy={labelY}
                r={markerR}
                fill="#0b150f"
                stroke={color}
                strokeWidth={2.5}
              />
              <text
                x={cx}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={18}
                fontWeight={700}
                fill={color}
                fontFamily="system-ui, sans-serif"
              >
                {m.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
