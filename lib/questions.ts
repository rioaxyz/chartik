import { Candle, Question } from "./types";

/**
 * Deterministic PRNG (mulberry32). Using a fixed seed means the server and the
 * client generate byte-identical candle data, which avoids React hydration
 * mismatches and makes every question's "textbook" answer reproducible.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/* ------------------------------------------------------------------ *
 * Chart-pattern drawing helpers
 *
 * Large chart patterns (double top, cup & handle, head & shoulders…)
 * are defined by sculpting a "price skeleton" — a sequence of target
 * prices — and turning it into realistic candles. This lets us draw any
 * named formation by describing its shape rather than hand-typing OHLC.
 * ------------------------------------------------------------------ */

/** Linear ramp: `n` points moving from `from` (exclusive) to `to` (inclusive). */
function seg(from: number, to: number, n: number): number[] {
  const out: number[] = [];
  for (let i = 1; i <= n; i++) out.push(from + ((to - from) * i) / n);
  return out;
}

/**
 * Curved ramp from `from` to `to` over `n` points, bowed by `bow`.
 * `bow < 0` sags into a U (rounded bottom); `bow > 0` arches into a ∩.
 */
function curve(from: number, to: number, n: number, bow: number): number[] {
  const out: number[] = [];
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    out.push(from + (to - from) * t + bow * Math.sin(Math.PI * t));
  }
  return out;
}

/** Compose a price skeleton: a starting anchor plus any number of segments. */
function skeleton(start: number, ...segs: number[][]): number[] {
  return [start, ...segs.flat()];
}

/**
 * Convert a price skeleton into candles. Each candle opens at the prior close
 * and closes near the next skeleton point, so the bodies trace the shape's
 * slope (green going up, red going down) with small natural wicks.
 */
function candlesFromPath(seed: number, path: number[], jitter = 1.1): Candle[] {
  const rand = mulberry32(seed);
  const candles: Candle[] = [];
  let prevClose = path[0];
  for (let i = 0; i < path.length; i++) {
    const open = prevClose;
    const close = path[i] + (rand() - 0.5) * jitter;
    const high = Math.max(open, close) + rand() * jitter;
    const low = Math.min(open, close) - rand() * jitter;
    candles.push({
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
    });
    prevClose = close;
  }
  return candles;
}

interface MoveOpts {
  seed: number;
  /** Body diversity — higher means larger, more varied candle bodies. */
  residVol?: number;
  /** Mean-reversion on the body noise so price still tracks the shape. */
  pull?: number;
  /** Maximum wick length; each wick is randomly skewed up to this. */
  wickMax?: number;
}

/**
 * Turn a smooth price skeleton into a DIVERSE candle series for the
 * "What happens next?" charts. Bodies follow a mean-reverting random walk
 * around the skeleton, so sizes and colors vary candle-to-candle while the
 * overall pattern shape is preserved. Wicks are randomly skewed, producing a
 * realistic mix of marubozu-like, long-wick, and balanced candles — and
 * keeping bodies substantial rather than uniformly tiny.
 */
function richCandles(path: number[], opts: MoveOpts): Candle[] {
  const { seed, residVol = 5, pull = 0.5, wickMax = 8 } = opts;
  const rand = mulberry32(seed);
  const candles: Candle[] = [];
  let resid = 0;
  let prevClose = path[0];
  for (let i = 0; i < path.length; i++) {
    resid = resid * (1 - pull) + (rand() - 0.5) * 2 * residVol;
    const open = prevClose;
    const close = Math.max(1, path[i] + resid);
    const top = Math.max(open, close);
    const bottom = Math.min(open, close);
    const high = top + Math.pow(rand(), 1.6) * wickMax;
    const low = Math.max(0.5, bottom - Math.pow(rand(), 1.6) * wickMax);
    candles.push({
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
    });
    prevClose = close;
  }
  return candles;
}

const C3 = [
  { id: "bull", label: "Bullish momentum (price likely keeps rising)" },
  { id: "side", label: "Sideways / consolidation (no clear direction)" },
  { id: "bear", label: "Bearish momentum (price likely keeps falling)" },
];

/**
 * The vocabulary of single-candle types covered in "Candle Basics". Each
 * type-identification question reuses these so learners see consistent naming.
 */
const TYPE = {
  bull: { id: "bull", label: "Bullish candle (large green body, close > open)" },
  bear: { id: "bear", label: "Bearish candle (large red body, close < open)" },
  doji: { id: "doji", label: "Doji (open ≈ close — indecision)" },
  spinning: {
    id: "spinning",
    label: "Spinning top (small body, long wicks both sides)",
  },
  hammer: {
    id: "hammer",
    label: "Hammer (small body up top, long lower wick)",
  },
  star: {
    id: "star",
    label: "Shooting star (small body, long upper wick)",
  },
  marubull: {
    id: "marubull",
    label: "Bullish Marubozu (full green body, no wicks)",
  },
  marubear: {
    id: "marubear",
    label: "Bearish Marubozu (full red body, no wicks)",
  },
} as const;

type TypeId = keyof typeof TYPE;

/** Build a choices array from type ids, preserving the given order. */
function types(...ids: TypeId[]) {
  return ids.map((id) => TYPE[id]);
}

/**
 * The vocabulary of classic multi-candle CHART patterns. Each label notes the
 * conventional directional bias so the explanations stay consistent.
 */
const CP = {
  doubletop: { id: "doubletop", label: "Double top (bearish reversal)" },
  doublebottom: { id: "doublebottom", label: "Double bottom (bullish reversal)" },
  tripletop: { id: "tripletop", label: "Triple top (bearish reversal)" },
  triplebottom: { id: "triplebottom", label: "Triple bottom (bullish reversal)" },
  hns: { id: "hns", label: "Head and shoulders (bearish reversal)" },
  invhns: { id: "invhns", label: "Inverse head and shoulders (bullish reversal)" },
  cup: { id: "cup", label: "Cup and handle (bullish continuation)" },
  rounding: { id: "rounding", label: "Rounding bottom / saucer (bullish)" },
  asctri: { id: "asctri", label: "Ascending triangle (bullish)" },
  desctri: { id: "desctri", label: "Descending triangle (bearish)" },
  symtri: { id: "symtri", label: "Symmetrical triangle (continuation)" },
  risewedge: { id: "risewedge", label: "Rising wedge (bearish)" },
  fallwedge: { id: "fallwedge", label: "Falling wedge (bullish)" },
  bullflag: { id: "bullflag", label: "Bull flag (bullish continuation)" },
  bearflag: { id: "bearflag", label: "Bear flag (bearish continuation)" },
  rectangle: { id: "rectangle", label: "Rectangle / range (consolidation)" },
  pennant: { id: "pennant", label: "Pennant (continuation)" },
} as const;

type CpId = keyof typeof CP;

/** Build a choices array from chart-pattern ids, preserving the given order. */
function cp(...ids: CpId[]) {
  return ids.map((id) => CP[id]);
}

/**
 * The full question bank. Hand-tuned so each visual has a clear, defensible
 * "textbook" answer that the explanation backs up.
 */
export const QUESTIONS: Question[] = [
  // ---- Topic 1: Candle basics — identify the single-candle type ----
  {
    id: "cb-1",
    topic: "candle-basics",
    candles: [{ open: 100, high: 118, low: 98, close: 115 }],
    prompt: "What type of candle is this?",
    choices: types("bull", "doji", "bear", "hammer"),
    answerId: "bull",
    explanation:
      "The close (115) is well above the open (100), giving a large green body with only small wicks. A higher close than open means buyers won the session — a standard bullish candle.",
  },
  {
    id: "cb-2",
    topic: "candle-basics",
    candles: [{ open: 120, high: 122, low: 100, close: 103 }],
    prompt: "What type of candle is this?",
    choices: types("doji", "bear", "spinning", "bull"),
    answerId: "bear",
    explanation:
      "The close (103) is far below the open (120), leaving a large red body. Sellers controlled the whole session — a standard bearish candle.",
  },
  {
    id: "cb-3",
    topic: "candle-basics",
    candles: [{ open: 100, high: 104, low: 96, close: 100 }],
    prompt: "What type of candle is this?",
    choices: types("bull", "doji", "spinning", "bear"),
    answerId: "doji",
    explanation:
      "Open (100) and close (100) are essentially equal, leaving almost no body with wicks on both sides. That is a Doji — neither buyers nor sellers won, signalling indecision and a possible turning point.",
  },
  {
    id: "cb-4",
    topic: "candle-basics",
    candles: [{ open: 100, high: 110, low: 90, close: 102 }],
    prompt: "What type of candle is this?",
    choices: types("doji", "spinning", "hammer", "marubull"),
    answerId: "spinning",
    explanation:
      "A small body in the middle with long wicks on BOTH sides is a Spinning Top. Price ranged widely but closed near where it opened — like a doji, it shows indecision, just with a slightly larger body.",
  },
  {
    id: "cb-5",
    topic: "candle-basics",
    candles: [{ open: 99, high: 101, low: 85, close: 100 }],
    prompt: "What type of candle is this?",
    choices: types("hammer", "star", "doji", "bear"),
    answerId: "hammer",
    explanation:
      "A small body near the TOP of the range with a long lower wick (down to 85) is a Hammer. Sellers pushed price down but buyers reclaimed it by the close — a potential bullish reversal signal.",
  },
  {
    id: "cb-6",
    topic: "candle-basics",
    candles: [{ open: 100, high: 116, low: 99, close: 101 }],
    prompt: "What type of candle is this?",
    choices: types("hammer", "spinning", "star", "bull"),
    answerId: "star",
    explanation:
      "A small body near the BOTTOM of the range with a long upper wick (up to 116) is a Shooting Star. Buyers pushed high but got rejected — a potential bearish reversal signal.",
  },
  {
    id: "cb-7",
    topic: "candle-basics",
    candles: [{ open: 90, high: 110, low: 90, close: 110 }],
    prompt: "What type of candle is this?",
    choices: types("bull", "marubull", "marubear", "doji"),
    answerId: "marubull",
    explanation:
      "The body fills the entire range — open equals the low and close equals the high, so there are no wicks at all. A full green body like this is a Bullish Marubozu: buyers were in control from open to close.",
  },
  {
    id: "cb-8",
    topic: "candle-basics",
    candles: [{ open: 110, high: 110, low: 90, close: 90 }],
    prompt: "What type of candle is this?",
    choices: types("bear", "marubull", "marubear", "spinning"),
    answerId: "marubear",
    explanation:
      "Open equals the high and close equals the low, so the red body has no wicks. That is a Bearish Marubozu: sellers dominated from the first tick to the last — a sign of strong downward conviction.",
  },

  // ---- Topic 2: What happens next? — predict the move from the setup ----
  {
    id: "nm-uptrend",
    topic: "next-move",
    candles: richCandles(skeleton(80, seg(80, 150, 25)), { seed: 211 }),
    prompt: "These candles lead up to now. What is the most likely next move?",
    choices: C3,
    answerId: "bull",
    explanation:
      "A clean staircase of higher highs and higher lows is a strong uptrend. With momentum firmly up and no reversal in sight, the textbook read is continued bullish momentum.",
  },
  {
    id: "nm-downtrend",
    topic: "next-move",
    candles: richCandles(skeleton(150, seg(150, 80, 25)), { seed: 212 }),
    prompt: "Read the momentum. What comes next?",
    choices: C3,
    answerId: "bear",
    explanation:
      "Lower highs and lower lows define a downtrend. Sellers are in control with no base forming, so the expectation is continued bearish momentum.",
  },
  {
    id: "nm-cup-handle",
    topic: "next-move",
    candles: richCandles(
      skeleton(120, curve(120, 118, 16, -30), seg(118, 110, 5), seg(110, 113, 3)),
      { seed: 213 },
    ),
    prompt: "A rounded base formed, then a small dip on the right. What's next?",
    choices: C3,
    answerId: "bull",
    explanation:
      "A smooth U-shaped 'cup' followed by a shallow 'handle' pullback is a Cup and Handle — a bullish continuation. The expected resolution is a breakout to the upside.",
  },
  {
    id: "nm-asc-triangle",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        108,
        seg(108, 130, 4),
        seg(130, 116, 3),
        seg(116, 130, 3),
        seg(130, 121, 3),
        seg(121, 130, 3),
        seg(130, 126, 2),
      ),
      { seed: 214 },
    ),
    prompt: "Price keeps hitting the same ceiling while the lows rise. What's next?",
    choices: C3,
    answerId: "bull",
    explanation:
      "Flat resistance with rising lows is an Ascending Triangle. Buyers grow more aggressive into a fixed ceiling, which usually breaks upward — bullish.",
  },
  {
    id: "nm-bull-flag",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        85,
        seg(85, 132, 8),
        seg(132, 124, 3),
        seg(124, 128, 2),
        seg(128, 121, 3),
        seg(121, 125, 2),
      ),
      { seed: 215 },
    ),
    prompt: "A sharp rally is drifting lower in a small channel. What's next?",
    choices: C3,
    answerId: "bull",
    explanation:
      "A steep pole followed by a gentle down-sloping channel is a Bull Flag — a bullish continuation. After the brief pause, the prior uptrend typically resumes.",
  },
  {
    id: "nm-falling-wedge",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        140,
        seg(140, 124, 3),
        seg(124, 131, 3),
        seg(131, 117, 3),
        seg(117, 123, 3),
        seg(123, 113, 3),
        seg(113, 117, 3),
      ),
      { seed: 216 },
    ),
    prompt: "Highs and lows are both falling but converging. What's next?",
    choices: C3,
    answerId: "bull",
    explanation:
      "A Falling Wedge — lower highs and lower lows narrowing together — looks bearish but usually resolves UP. Selling pressure fades as the range tightens.",
  },
  {
    id: "nm-inv-hns",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        140,
        seg(140, 118, 5),
        seg(118, 128, 4),
        seg(128, 104, 5),
        seg(104, 127, 5),
        seg(127, 116, 4),
        seg(116, 123, 3),
      ),
      { seed: 217 },
    ),
    prompt: "A low, then a deeper low, then a higher low. What's next?",
    choices: C3,
    answerId: "bull",
    explanation:
      "A trough, a deeper trough (the head), then a shallower trough (right shoulder) is an Inverse Head and Shoulders — a bullish reversal that breaks up through the neckline.",
  },
  {
    id: "nm-double-bottom",
    topic: "next-move",
    candles: richCandles(
      skeleton(145, seg(145, 104, 7), seg(104, 124, 5), seg(124, 106, 6), seg(106, 120, 5)),
      { seed: 218 },
    ),
    prompt: "Price tested the same low twice and is turning up. What's next?",
    choices: C3,
    answerId: "bull",
    explanation:
      "Two distinct lows at the same level with a bounce between them form a Double Bottom ('W') — a bullish reversal. Holding support twice signals buyers taking control.",
  },
  {
    id: "nm-bull-pennant",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        85,
        seg(85, 132, 8),
        seg(132, 121, 2),
        seg(121, 129, 2),
        seg(129, 123, 2),
        seg(123, 127, 2),
        seg(127, 125, 2),
      ),
      { seed: 219 },
    ),
    prompt: "A strong rally is coiling into a tight triangle. What's next?",
    choices: C3,
    answerId: "bull",
    explanation:
      "A sharp pole followed by a small converging coil is a Bullish Pennant — a continuation pattern. The energy from the rally usually pushes price out the top.",
  },
  {
    id: "nm-rounding-bottom",
    topic: "next-move",
    candles: richCandles(skeleton(125, curve(125, 128, 22, -32)), { seed: 220 }),
    prompt: "Price carved a long, smooth bowl and is curling up. What's next?",
    choices: C3,
    answerId: "bull",
    explanation:
      "A gradual, saucer-shaped base with no sharp lows is a Rounding Bottom — a slow shift from sellers to buyers. The curl upward points to bullish continuation.",
  },
  {
    id: "nm-desc-triangle",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        122,
        seg(122, 100, 4),
        seg(100, 116, 3),
        seg(116, 100, 3),
        seg(100, 110, 3),
        seg(110, 100, 3),
        seg(100, 105, 2),
      ),
      { seed: 221 },
    ),
    prompt: "Price keeps hitting the same floor while the highs drop. What's next?",
    choices: C3,
    answerId: "bear",
    explanation:
      "Flat support with lower highs is a Descending Triangle. Sellers press into a fixed floor, which usually gives way to the downside — bearish.",
  },
  {
    id: "nm-bear-flag",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        150,
        seg(150, 103, 8),
        seg(103, 111, 3),
        seg(111, 107, 2),
        seg(107, 114, 3),
        seg(114, 109, 2),
      ),
      { seed: 222 },
    ),
    prompt: "A sharp drop is drifting back up in a small channel. What's next?",
    choices: C3,
    answerId: "bear",
    explanation:
      "A steep down-pole followed by a gentle up-sloping channel is a Bear Flag — a bearish continuation. The pause usually gives way to another leg down.",
  },
  {
    id: "nm-rising-wedge",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        95,
        seg(95, 112, 3),
        seg(112, 104, 3),
        seg(104, 118, 3),
        seg(118, 112, 3),
        seg(112, 122, 3),
        seg(122, 118, 3),
      ),
      { seed: 223 },
    ),
    prompt: "Highs and lows are both rising but converging. What's next?",
    choices: C3,
    answerId: "bear",
    explanation:
      "A Rising Wedge — higher highs and higher lows narrowing together — looks bullish but usually resolves DOWN. The advance loses steam as the range tightens.",
  },
  {
    id: "nm-hns",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        85,
        seg(85, 112, 5),
        seg(112, 102, 4),
        seg(102, 128, 5),
        seg(128, 102, 5),
        seg(102, 112, 4),
        seg(112, 106, 3),
      ),
      { seed: 224 },
    ),
    prompt: "A peak, a higher peak, then a lower peak rolling over. What's next?",
    choices: C3,
    answerId: "bear",
    explanation:
      "A peak (left shoulder), a higher peak (head), then a lower peak (right shoulder) is a Head and Shoulders — a bearish reversal that breaks down through the neckline.",
  },
  {
    id: "nm-double-top",
    topic: "next-move",
    candles: richCandles(
      skeleton(85, seg(85, 130, 7), seg(130, 110, 5), seg(110, 129, 6), seg(129, 116, 5)),
      { seed: 225 },
    ),
    prompt: "Price hit the same high twice and is rolling over. What's next?",
    choices: C3,
    answerId: "bear",
    explanation:
      "Two highs at the same level with a dip between them form a Double Top ('M') — a bearish reversal. Failing twice at resistance hands control to sellers.",
  },
  {
    id: "nm-bear-pennant",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        150,
        seg(150, 103, 8),
        seg(103, 113, 2),
        seg(113, 106, 2),
        seg(106, 111, 2),
        seg(111, 108, 2),
        seg(108, 110, 2),
      ),
      { seed: 226 },
    ),
    prompt: "A sharp sell-off is coiling into a tight triangle. What's next?",
    choices: C3,
    answerId: "bear",
    explanation:
      "A steep down-pole followed by a small converging coil is a Bearish Pennant — a continuation pattern. The coil usually breaks downward in the trend's direction.",
  },
  {
    id: "nm-rounding-top",
    topic: "next-move",
    candles: richCandles(skeleton(110, curve(110, 107, 22, 32)), { seed: 227 }),
    prompt: "Price arched over in a smooth dome and is rolling down. What's next?",
    choices: C3,
    answerId: "bear",
    explanation:
      "A smooth, inverted-bowl top is a Rounding Top — a gradual shift from buyers to sellers. The roll-over points to bearish continuation.",
  },
  {
    id: "nm-rectangle",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        106,
        seg(106, 124, 4),
        seg(124, 107, 4),
        seg(107, 124, 4),
        seg(124, 107, 4),
        seg(107, 122, 4),
      ),
      { seed: 228 },
    ),
    prompt: "Price keeps bouncing between the same floor and ceiling. What's next?",
    choices: C3,
    answerId: "side",
    explanation:
      "A Rectangle range — flat support and flat resistance with no net progress — is consolidation. Until one side breaks, more sideways chop is the base case.",
  },
  {
    id: "nm-sym-triangle",
    topic: "next-move",
    candles: richCandles(
      skeleton(
        100,
        seg(100, 128, 4),
        seg(128, 104, 3),
        seg(104, 123, 3),
        seg(123, 110, 3),
        seg(110, 119, 3),
        seg(119, 114, 3),
      ),
      { seed: 229 },
    ),
    prompt: "Highs are falling and lows are rising into a point. What's next?",
    choices: C3,
    answerId: "side",
    explanation:
      "A Symmetrical Triangle coils with lower highs AND higher lows and no prior trend to lean on. Direction is undecided until the breakout, so the immediate read is more sideways consolidation.",
  },
  {
    id: "nm-coil",
    topic: "next-move",
    candles: richCandles(
      skeleton(112, seg(112, 117, 5), seg(117, 111, 5), seg(111, 116, 5), seg(116, 112, 5)),
      { seed: 230, residVol: 2, wickMax: 3.5 },
    ),
    prompt: "Volatility has dried up into a tight, flat range. What's next?",
    choices: C3,
    answerId: "side",
    explanation:
      "Small candles drifting in a narrow band with no direction is low-volatility consolidation. The highest-probability near-term outcome is continued sideways action until a catalyst.",
  },

  // ---- Topic 3: Pattern recognition — multi-candle formations ----
  {
    id: "pt-1",
    topic: "pattern",
    candles: [
      { open: 110, high: 111, low: 95, close: 96 },
      { open: 95, high: 116, low: 94, close: 114 },
    ],
    prompt: "Two candles. What pattern do these form?",
    choices: [
      { id: "engulf", label: "Bullish engulfing (green body swallows the prior red)" },
      { id: "doji", label: "Doji star" },
      { id: "harami", label: "Bearish harami" },
    ],
    answerId: "engulf",
    explanation:
      "A red candle is followed by a larger green candle whose body completely engulfs it. This bullish engulfing pattern often marks a reversal from down to up.",
  },
  {
    id: "pt-2",
    topic: "pattern",
    candles: [
      { open: 96, high: 106, low: 95, close: 105 },
      { open: 106, high: 108, low: 92, close: 94 },
    ],
    prompt: "Two candles. What pattern do these form?",
    choices: [
      { id: "bearengulf", label: "Bearish engulfing (red body swallows the prior green)" },
      { id: "bullengulf", label: "Bullish engulfing" },
      { id: "tweezer", label: "Tweezer bottom" },
    ],
    answerId: "bearengulf",
    explanation:
      "A green candle is followed by a larger red candle whose body completely engulfs it. This bearish engulfing pattern often marks a reversal from up to down.",
  },
  {
    id: "pt-3",
    topic: "pattern",
    candles: [
      { open: 90, high: 100, low: 89, close: 99 },
      { open: 96, high: 108, low: 95, close: 107 },
      { open: 104, high: 116, low: 103, close: 115 },
    ],
    prompt: "Three candles. What pattern is this?",
    choices: [
      { id: "soldiers", label: "Three white soldiers (bullish continuation)" },
      { id: "crows", label: "Three black crows (bearish)" },
      { id: "morning", label: "Morning star" },
    ],
    answerId: "soldiers",
    explanation:
      "Three strong green candles in a row, each opening within the prior body and closing at a new high, is 'three white soldiers' — a powerful sign that buyers are firmly in control.",
  },
  {
    id: "pt-4",
    topic: "pattern",
    candles: [
      { open: 120, high: 121, low: 104, close: 105 },
      { open: 103, high: 106, low: 101, close: 104 },
      { open: 106, high: 122, low: 105, close: 121 },
    ],
    prompt: "Three candles. What reversal pattern is this?",
    choices: [
      { id: "morning", label: "Morning star (bullish reversal)" },
      { id: "evening", label: "Evening star (bearish reversal)" },
      { id: "crows", label: "Three black crows" },
    ],
    answerId: "morning",
    explanation:
      "A big red candle, then a small indecisive candle (the 'star'), then a big green candle that recovers the loss. This morning star marks a bottoming reversal from down to up.",
  },

  // ---- Topic 4: Chart patterns — large multi-candle formations ----
  {
    id: "cp-doubletop",
    topic: "chart-patterns",
    candles: candlesFromPath(
      101,
      skeleton(
        88,
        seg(88, 132, 8),
        seg(132, 108, 7),
        seg(108, 131, 7),
        seg(131, 90, 9),
      ),
    ),
    prompt: "Which chart pattern is forming here?",
    choices: cp("tripletop", "doubletop", "hns", "doublebottom"),
    answerId: "doubletop",
    explanation:
      "Price rallies to a high, pulls back to a 'neckline', then rallies to roughly the SAME high and fails — an 'M' shape. When it breaks below the neckline this Double Top signals a bearish reversal.",
  },
  {
    id: "cp-doublebottom",
    topic: "chart-patterns",
    candles: candlesFromPath(
      102,
      skeleton(
        142,
        seg(142, 100, 8),
        seg(100, 124, 7),
        seg(124, 101, 7),
        seg(101, 146, 9),
      ),
    ),
    prompt: "Which chart pattern is this?",
    choices: cp("invhns", "doublebottom", "doubletop", "triplebottom"),
    answerId: "doublebottom",
    explanation:
      "Two distinct lows at roughly the same level separated by a bounce — a 'W' shape. Breaking above the middle peak confirms this Double Bottom, a bullish reversal.",
  },
  {
    id: "cp-tripletop",
    topic: "chart-patterns",
    candles: candlesFromPath(
      103,
      skeleton(
        88,
        seg(88, 130, 7),
        seg(130, 110, 5),
        seg(110, 130, 5),
        seg(130, 110, 5),
        seg(110, 130, 5),
        seg(130, 95, 8),
      ),
    ),
    prompt: "Identify this chart pattern.",
    choices: cp("doubletop", "hns", "tripletop", "rectangle"),
    answerId: "tripletop",
    explanation:
      "Three failed attempts at the same resistance level, then a breakdown. A Triple Top shows buyers repeatedly rejected — a bearish reversal once support gives way.",
  },
  {
    id: "cp-triplebottom",
    topic: "chart-patterns",
    candles: candlesFromPath(
      104,
      skeleton(
        142,
        seg(142, 102, 7),
        seg(102, 122, 5),
        seg(122, 102, 5),
        seg(102, 122, 5),
        seg(122, 102, 5),
        seg(102, 145, 8),
      ),
    ),
    prompt: "Which pattern is this?",
    choices: cp("doublebottom", "triplebottom", "invhns", "rectangle"),
    answerId: "triplebottom",
    explanation:
      "Three tests of the same support that hold, then a breakout higher. A Triple Bottom is a bullish reversal — sellers failed three times to push lower.",
  },
  {
    id: "cp-hns",
    topic: "chart-patterns",
    candles: candlesFromPath(
      105,
      skeleton(
        88,
        seg(88, 116, 6),
        seg(116, 104, 5),
        seg(104, 136, 6),
        seg(136, 104, 6),
        seg(104, 116, 5),
        seg(116, 86, 7),
      ),
    ),
    prompt: "Which reversal pattern is this?",
    choices: cp("tripletop", "hns", "doubletop", "invhns"),
    answerId: "hns",
    explanation:
      "A peak (left shoulder), a higher peak (head), then a lower peak (right shoulder) — all bouncing off the same neckline. Breaking the neckline confirms Head and Shoulders, a classic bearish reversal.",
  },
  {
    id: "cp-invhns",
    topic: "chart-patterns",
    candles: candlesFromPath(
      106,
      skeleton(
        142,
        seg(142, 114, 6),
        seg(114, 126, 5),
        seg(126, 94, 6),
        seg(94, 126, 6),
        seg(126, 114, 5),
        seg(114, 144, 7),
      ),
    ),
    prompt: "Which pattern is forming?",
    choices: cp("triplebottom", "doublebottom", "invhns", "hns"),
    answerId: "invhns",
    explanation:
      "A trough (left shoulder), a deeper trough (head), then a shallower trough (right shoulder). Breaking above the neckline confirms an Inverse Head and Shoulders — a bullish reversal.",
  },
  {
    id: "cp-cup",
    topic: "chart-patterns",
    candles: candlesFromPath(
      107,
      skeleton(
        130,
        curve(130, 128, 18, -34),
        seg(128, 120, 5),
        seg(120, 142, 7),
      ),
    ),
    prompt: "Which chart pattern is this?",
    choices: cp("rounding", "doublebottom", "cup", "invhns"),
    answerId: "cup",
    explanation:
      "A smooth, rounded 'U' base (the cup) followed by a small downward drift (the handle), then a breakout. The Cup and Handle is a bullish continuation pattern.",
  },
  {
    id: "cp-rounding",
    topic: "chart-patterns",
    candles: candlesFromPath(
      108,
      skeleton(130, curve(130, 130, 32, -40), seg(130, 140, 4)),
    ),
    prompt: "Identify this pattern.",
    choices: cp("cup", "rounding", "doublebottom", "symtri"),
    answerId: "rounding",
    explanation:
      "A long, smooth, saucer-shaped base with no sharp lows — a gradual shift from sellers to buyers. The Rounding Bottom (saucer) is a slow bullish reversal.",
  },
  {
    id: "cp-asctri",
    topic: "chart-patterns",
    candles: candlesFromPath(
      109,
      skeleton(
        108,
        seg(108, 130, 4),
        seg(130, 112, 3),
        seg(112, 130, 3),
        seg(130, 118, 3),
        seg(118, 130, 3),
        seg(130, 123, 3),
        seg(123, 130, 3),
        seg(130, 144, 5),
      ),
    ),
    prompt: "Which pattern is this?",
    choices: cp("symtri", "asctri", "desctri", "bullflag"),
    answerId: "asctri",
    explanation:
      "A flat horizontal resistance at the top with rising lows squeezing price upward. An Ascending Triangle usually breaks out to the upside — a bullish pattern.",
  },
  {
    id: "cp-desctri",
    topic: "chart-patterns",
    candles: candlesFromPath(
      110,
      skeleton(
        132,
        seg(132, 104, 4),
        seg(104, 128, 3),
        seg(128, 104, 3),
        seg(104, 122, 3),
        seg(122, 104, 3),
        seg(104, 116, 3),
        seg(116, 104, 3),
        seg(104, 90, 5),
      ),
    ),
    prompt: "Which pattern is this?",
    choices: cp("symtri", "asctri", "desctri", "bearflag"),
    answerId: "desctri",
    explanation:
      "A flat horizontal support at the bottom with lower highs pressing price down. A Descending Triangle usually breaks down — a bearish pattern.",
  },
  {
    id: "cp-symtri",
    topic: "chart-patterns",
    candles: candlesFromPath(
      111,
      skeleton(
        100,
        seg(100, 132, 4),
        seg(132, 102, 3),
        seg(102, 127, 3),
        seg(127, 108, 3),
        seg(108, 122, 3),
        seg(122, 113, 3),
        seg(113, 118, 3),
        seg(118, 134, 5),
      ),
    ),
    prompt: "Identify this pattern.",
    choices: cp("asctri", "symtri", "desctri", "pennant"),
    answerId: "symtri",
    explanation:
      "Lower highs AND higher lows converge toward a point — both trendlines slope inward. A Symmetrical Triangle is a coiling, continuation-biased pattern that breaks out either way.",
  },
  {
    id: "cp-risewedge",
    topic: "chart-patterns",
    candles: candlesFromPath(
      112,
      skeleton(
        98,
        seg(98, 114, 3),
        seg(114, 104, 3),
        seg(104, 120, 3),
        seg(120, 112, 3),
        seg(112, 125, 3),
        seg(125, 120, 3),
        seg(120, 128, 3),
        seg(128, 104, 5),
      ),
    ),
    prompt: "Which pattern is this?",
    choices: cp("fallwedge", "risewedge", "asctri", "bullflag"),
    answerId: "risewedge",
    explanation:
      "Both the highs and lows rise, but the lows rise faster so the lines converge upward. A Rising Wedge is deceptively weak — it typically resolves DOWN (bearish).",
  },
  {
    id: "cp-fallwedge",
    topic: "chart-patterns",
    candles: candlesFromPath(
      113,
      skeleton(
        140,
        seg(140, 124, 3),
        seg(124, 132, 3),
        seg(132, 116, 3),
        seg(116, 124, 3),
        seg(124, 112, 3),
        seg(112, 118, 3),
        seg(118, 110, 3),
        seg(110, 134, 5),
      ),
    ),
    prompt: "Which pattern is this?",
    choices: cp("risewedge", "desctri", "fallwedge", "bullflag"),
    answerId: "fallwedge",
    explanation:
      "Both highs and lows fall, but the highs fall faster so the lines converge downward. A Falling Wedge usually resolves UP (bullish).",
  },
  {
    id: "cp-bullflag",
    topic: "chart-patterns",
    candles: candlesFromPath(
      114,
      skeleton(
        90,
        seg(90, 134, 7),
        seg(134, 126, 3),
        seg(126, 130, 2),
        seg(130, 122, 3),
        seg(122, 126, 2),
        seg(126, 150, 6),
      ),
    ),
    prompt: "Which continuation pattern is this?",
    choices: cp("pennant", "bullflag", "bearflag", "risewedge"),
    answerId: "bullflag",
    explanation:
      "A sharp rally (the flagpole) followed by a small downward-sloping PARALLEL channel (the flag), then a breakout higher. A Bull Flag is a bullish continuation pattern.",
  },
  {
    id: "cp-bearflag",
    topic: "chart-patterns",
    candles: candlesFromPath(
      115,
      skeleton(
        140,
        seg(140, 96, 7),
        seg(96, 104, 3),
        seg(104, 100, 2),
        seg(100, 108, 3),
        seg(108, 104, 2),
        seg(104, 80, 6),
      ),
    ),
    prompt: "Which continuation pattern is this?",
    choices: cp("pennant", "bullflag", "bearflag", "fallwedge"),
    answerId: "bearflag",
    explanation:
      "A sharp drop (the flagpole) followed by a small upward-sloping parallel channel (the flag), then a breakdown. A Bear Flag is a bearish continuation pattern.",
  },
  {
    id: "cp-rectangle",
    topic: "chart-patterns",
    candles: candlesFromPath(
      116,
      skeleton(
        106,
        seg(106, 126, 4),
        seg(126, 106, 4),
        seg(106, 126, 4),
        seg(126, 106, 4),
        seg(106, 126, 4),
        seg(126, 106, 4),
      ),
    ),
    prompt: "Identify this pattern.",
    choices: cp("symtri", "doubletop", "rectangle", "tripletop"),
    answerId: "rectangle",
    explanation:
      "Price bounces repeatedly between flat horizontal support and resistance. A Rectangle is a consolidation/range — it breaks in the direction of the eventual breakout.",
  },
  {
    id: "cp-pennant",
    topic: "chart-patterns",
    candles: candlesFromPath(
      117,
      skeleton(
        90,
        seg(90, 134, 7),
        seg(134, 120, 3),
        seg(120, 130, 2),
        seg(130, 123, 2),
        seg(123, 128, 2),
        seg(128, 125, 2),
        seg(125, 150, 6),
      ),
    ),
    prompt: "Which continuation pattern is this?",
    choices: cp("bullflag", "pennant", "symtri", "fallwedge"),
    answerId: "pennant",
    explanation:
      "A sharp move (the pole) followed by a small CONVERGING triangle of consolidation, then a breakout. A Pennant is like a flag, but its consolidation tightens to a point instead of running parallel.",
  },
];

/** Return all questions for a given topic, or all questions if none given. */
export function getQuestions(topic?: string): Question[] {
  if (!topic || topic === "all") return QUESTIONS;
  return QUESTIONS.filter((q) => q.topic === topic);
}
