import { Candle, isBullish } from "@/lib/types";

interface Props {
  candles: Candle[];
  /** Optional fixed width/height; defaults adapt to candle count. */
  height?: number;
}

const BULL = "#34d399";
const BEAR = "#f87171";

/**
 * Renders an OHLC series as an SVG candlestick chart. Pure/deterministic — the
 * same candles always produce the same SVG, so it is safe to render on the
 * server and hydrate on the client without mismatches.
 */
export default function CandlestickChart({ candles, height = 320 }: Props) {
  const n = candles.length;
  // Make a single candle look like a portrait, many candles look like a chart.
  const slotWidth = n <= 1 ? 90 : n <= 6 ? 56 : 30;
  const padX = 24;
  const padY = 24;
  const width = padX * 2 + slotWidth * n;
  const plotH = height - padY * 2;

  const highest = Math.max(...candles.map((c) => c.high));
  const lowest = Math.min(...candles.map((c) => c.low));
  const range = highest - lowest || 1;

  // Map a price to a Y coordinate (higher price = lower Y).
  const y = (price: number) => padY + ((highest - price) / range) * plotH;

  const bodyWidth = Math.max(6, slotWidth * 0.6);

  // A few horizontal gridlines for context.
  const gridLines = 4;
  const grid = Array.from({ length: gridLines + 1 }, (_, i) => {
    const price = lowest + (range * i) / gridLines;
    return { yPos: y(price), price };
  });

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
              stroke="#28392f"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <text
              x={width - padX + 2}
              y={g.yPos + 3}
              fontSize={9}
              fill="#88a298"
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
      </svg>
    </div>
  );
}
