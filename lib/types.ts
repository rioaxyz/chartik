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
  | "chart-patterns";

/** A multiple-choice option. */
export interface Choice {
  id: string;
  label: string;
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
}

/** Human-readable labels for each topic. */
export const TOPIC_LABELS: Record<Topic, string> = {
  "candle-basics": "Candle Basics",
  "next-move": "What Happens Next?",
  pattern: "Candlestick Patterns",
  "chart-patterns": "Chart Patterns",
};

/** Returns true if a candle closed higher than it opened (bullish/green). */
export function isBullish(c: Candle): boolean {
  return c.close > c.open;
}
