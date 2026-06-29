/** A single OHLC candle. */
export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
}

/** The category of a quiz question, used for grouping and scoring. */
export type Topic =
  | "candle-basics"
  | "next-move"
  | "pattern"
  | "chart-patterns"
  | "buy-sell"
  | "compare";

/** A multiple-choice option. */
export interface Choice {
  id: string;
  label: string;
}

/**
 * A lettered marker drawn on the chart at a specific candle, used by the
 * "Buy / Sell / Stop" questions where the answer is a location (A, B, C…).
 */
export interface Marker {
  /** The letter shown on the chart and used as the choice id. */
  label: string;
  /** Index into the question's `candles` array that the marker points to. */
  index: number;
  /** Anchor above the candle's high or below its low. Defaults to "high". */
  at?: "high" | "low";
}

/**
 * A quiz question. Every question renders a candlestick visual (one or many
 * candles) and asks a multiple-choice question about it.
 */
export interface Question {
  id: string;
  topic: Topic;
  /** The candle(s) to render as the visual. */
  candles: Candle[];
  prompt: string;
  choices: Choice[];
  /** The `id` of the correct choice. */
  answerId: string;
  /** Shown after answering to teach the concept. */
  explanation: string;
  /** Lettered locations overlaid on the chart (for "Buy / Sell / Stop"). */
  markers?: Marker[];
  /** Two side-by-side setups to compare (for "Strong vs Weak"). */
  compare?: { a: Candle[]; b: Candle[] };
}

/** Human-readable labels for each topic. */
export const TOPIC_LABELS: Record<Topic, string> = {
  "candle-basics": "Candle Basics",
  "next-move": "What Happens Next?",
  pattern: "Candlestick Patterns",
  "chart-patterns": "Chart Patterns",
  "buy-sell": "Buy, Sell & Stops",
  compare: "Strong vs Weak",
};

/** Returns true if a candle closed higher than it opened (bullish/green). */
export function isBullish(c: Candle): boolean {
  return c.close > c.open;
}
