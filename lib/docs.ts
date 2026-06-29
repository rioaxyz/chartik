/**
 * Learning-material registry. Each doc is a pattern guide rendered in the
 * docs theme (see `.docs-scope` styles in globals.css). To add a new guide,
 * append a `Doc` here — provide a chart SVG string (hand-authored or built with
 * `buildChart` from lib/chartSvg), the four metric cards, and the trading
 * rules. No new components needed.
 */

import { buildChart, bigCdl, cdl, LEVEL } from "./chartSvg";

export type Bias = "bullish" | "bearish" | "neutral";

export interface DocCard {
  kind: "buy" | "short" | "stop" | "target" | "rr" | "neutral" | "info";
  icon: string;
  label: string;
  value: string;
  /** May contain <strong>/<em>. */
  desc: string;
}

export interface DocVariant {
  /** Tab label, e.g. "Ascending". */
  name: string;
  /** Inline SVG markup for the annotated chart. */
  chart: string;
  cards: DocCard[];
  rulesTitle: string;
  /** Each entry may contain <strong>/<em>. */
  rules: string[];
}

export interface Doc {
  slug: string;
  title: string;
  subtitle: string;
  /** Short blurb for the docs index card. */
  blurb: string;
  icon: string;
  /** One or more variants shown as tabs. */
  variants: DocVariant[];
}

const ASCENDING_SVG = `
<svg viewBox="0 0 780 340" width="100%" style="min-width:520px;display:block">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e2535" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="780" height="340" fill="#131720"/>
  <rect width="780" height="340" fill="url(#grid)"/>
  <text x="16" y="58"  fill="#7b8499" font-size="10">170</text>
  <text x="16" y="108" fill="#7b8499" font-size="10">160</text>
  <text x="16" y="158" fill="#7b8499" font-size="10">150</text>
  <text x="16" y="208" fill="#7b8499" font-size="10">140</text>
  <text x="16" y="258" fill="#7b8499" font-size="10">130</text>
  <text x="16" y="308" fill="#7b8499" font-size="10">120</text>
  <line x1="55" y1="100" x2="660" y2="100" stroke="#facc15" stroke-width="1.8" stroke-dasharray="6,4"/>
  <text x="664" y="104" fill="#facc15" font-size="11" font-weight="700">Resistance</text>
  <line x1="55" y1="295" x2="620" y2="128" stroke="#7c6af7" stroke-width="1.8" stroke-dasharray="6,4"/>
  <text x="24" y="300" fill="#7c6af7" font-size="11">Support</text>
  <line x1="75" y1="265" x2="75" y2="305" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="68" y="270" width="14" height="30" fill="#ef5350" rx="1"/>
  <line x1="115" y1="235" x2="115" y2="270" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="108" y="240" width="14" height="25" fill="#26a69a" rx="1"/>
  <line x1="155" y1="108" x2="155" y2="250" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="148" y="115" width="14" height="130" fill="#ef5350" rx="1"/>
  <line x1="195" y1="220" x2="195" y2="260" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="188" y="225" width="14" height="30" fill="#26a69a" rx="1"/>
  <line x1="235" y1="103" x2="235" y2="225" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="228" y="110" width="14" height="110" fill="#ef5350" rx="1"/>
  <line x1="275" y1="195" x2="275" y2="230" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="268" y="200" width="14" height="25" fill="#26a69a" rx="1"/>
  <line x1="315" y1="100" x2="315" y2="200" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="308" y="105" width="14" height="90" fill="#ef5350" rx="1"/>
  <line x1="355" y1="168" x2="355" y2="195" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="348" y="172" width="14" height="20" fill="#26a69a" rx="1"/>
  <line x1="395" y1="143" x2="395" y2="170" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="388" y="148" width="14" height="18" fill="#26a69a" rx="1"/>
  <rect x="448" y="30" width="14" height="70" fill="#00e676" rx="1"/>
  <line x1="455" y1="25" x2="455" y2="105" stroke="#00e676" stroke-width="1.5"/>
  <rect x="446" y="28" width="18" height="74" fill="none" stroke="rgba(0,230,118,0.3)" stroke-width="3" rx="2"/>
  <polygon points="455,22 449,36 461,36" fill="#00e676"/>
  <text x="466" y="38" fill="#00e676" font-size="11" font-weight="700">BUY (breakout close)</text>
  <line x1="455" y1="36" x2="455" y2="100" stroke="#00e676" stroke-width="1" stroke-dasharray="3,3"/>
  <rect x="488" y="10" width="14" height="50" fill="#26a69a" rx="1"/>
  <line x1="495" y1="5" x2="495" y2="68" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="528" y="-5" width="14" height="45" fill="#26a69a" rx="1"/>
  <line x1="535" y1="-10" x2="535" y2="48" stroke="#26a69a" stroke-width="1.5"/>
  <line x1="440" y1="18" x2="700" y2="18" stroke="#40c4ff" stroke-width="1.5" stroke-dasharray="5,4"/>
  <text x="630" y="14" fill="#40c4ff" font-size="11" font-weight="700">Target</text>
  <polygon points="700,18 690,13 690,23" fill="#40c4ff"/>
  <line x1="440" y1="128" x2="700" y2="128" stroke="#ff6d00" stroke-width="1.5" stroke-dasharray="5,4"/>
  <text x="630" y="124" fill="#ff6d00" font-size="11" font-weight="700">Stop Loss</text>
  <polygon points="700,128 690,123 690,133" fill="#ff6d00"/>
  <rect x="55" y="315" width="190" height="22" rx="4" fill="rgba(124,106,247,0.15)"/>
  <text x="150" y="330" fill="#7c6af7" font-size="11" font-weight="700" text-anchor="middle">ASCENDING TRIANGLE (Bullish)</text>
  <line x1="42" y1="100" x2="42" y2="295" stroke="#fff" stroke-width="1" stroke-dasharray="2,3" opacity="0.3"/>
  <polygon points="42,100 38,112 46,112" fill="white" opacity="0.3"/>
  <polygon points="42,295 38,283 46,283" fill="white" opacity="0.3"/>
  <text x="6" y="205" fill="white" font-size="9" opacity="0.4">H</text>
</svg>`;

const DESCENDING_SVG = `
<svg viewBox="0 0 780 340" width="100%" style="min-width:520px;display:block">
  <defs>
    <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e2535" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="780" height="340" fill="#131720"/>
  <rect width="780" height="340" fill="url(#grid2)"/>
  <text x="16" y="68"  fill="#7b8499" font-size="10">170</text>
  <text x="16" y="118" fill="#7b8499" font-size="10">160</text>
  <text x="16" y="168" fill="#7b8499" font-size="10">150</text>
  <text x="16" y="218" fill="#7b8499" font-size="10">140</text>
  <text x="16" y="268" fill="#7b8499" font-size="10">130</text>
  <text x="16" y="310" fill="#7b8499" font-size="10">120</text>
  <line x1="55" y1="248" x2="660" y2="248" stroke="#facc15" stroke-width="1.8" stroke-dasharray="6,4"/>
  <text x="664" y="252" fill="#facc15" font-size="11" font-weight="700">Support</text>
  <line x1="55" y1="60" x2="620" y2="228" stroke="#7c6af7" stroke-width="1.8" stroke-dasharray="6,4"/>
  <text x="24" y="58" fill="#7c6af7" font-size="11">Resistance</text>
  <line x1="75" y1="65" x2="75" y2="115" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="68" y="70" width="14" height="40" fill="#26a69a" rx="1"/>
  <line x1="115" y1="60" x2="115" y2="120" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="108" y="65" width="14" height="50" fill="#ef5350" rx="1"/>
  <line x1="155" y1="168" x2="155" y2="255" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="148" y="175" width="14" height="73" fill="#26a69a" rx="1"/>
  <line x1="195" y1="110" x2="195" y2="180" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="188" y="115" width="14" height="60" fill="#ef5350" rx="1"/>
  <line x1="235" y1="188" x2="235" y2="252" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="228" y="192" width="14" height="55" fill="#26a69a" rx="1"/>
  <line x1="275" y1="148" x2="275" y2="193" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="268" y="153" width="14" height="36" fill="#ef5350" rx="1"/>
  <line x1="315" y1="210" x2="315" y2="252" stroke="#26a69a" stroke-width="1.5"/>
  <rect x="308" y="215" width="14" height="33" fill="#26a69a" rx="1"/>
  <line x1="355" y1="175" x2="355" y2="214" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="348" y="179" width="14" height="31" fill="#ef5350" rx="1"/>
  <line x1="395" y1="200" x2="395" y2="250" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="388" y="204" width="14" height="42" fill="#ef5350" rx="1"/>
  <rect x="448" y="248" width="14" height="75" fill="#ef5350" rx="1"/>
  <line x1="455" y1="240" x2="455" y2="332" stroke="#ef5350" stroke-width="1.5"/>
  <rect x="446" y="246" width="18" height="79" fill="none" stroke="rgba(239,83,80,0.35)" stroke-width="3" rx="2"/>
  <polygon points="455,336 449,322 461,322" fill="#ef5350"/>
  <text x="466" y="337" fill="#ef5350" font-size="11" font-weight="700">SHORT (breakdown close)</text>
  <line x1="455" y1="248" x2="455" y2="322" stroke="#ef5350" stroke-width="1" stroke-dasharray="3,3"/>
  <rect x="488" y="320" width="14" height="14" fill="#ef5350" rx="1"/>
  <line x1="495" y1="315" x2="495" y2="340" stroke="#ef5350" stroke-width="1.5"/>
  <line x1="440" y1="328" x2="700" y2="328" stroke="#40c4ff" stroke-width="1.5" stroke-dasharray="5,4"/>
  <text x="620" y="324" fill="#40c4ff" font-size="11" font-weight="700">Target</text>
  <polygon points="700,328 690,323 690,333" fill="#40c4ff"/>
  <line x1="440" y1="200" x2="700" y2="200" stroke="#ff6d00" stroke-width="1.5" stroke-dasharray="5,4"/>
  <text x="620" y="196" fill="#ff6d00" font-size="11" font-weight="700">Stop Loss</text>
  <polygon points="700,200 690,195 690,205" fill="#ff6d00"/>
  <rect x="55" y="10" width="200" height="22" rx="4" fill="rgba(239,83,80,0.12)"/>
  <text x="155" y="25" fill="#ef5350" font-size="11" font-weight="700" text-anchor="middle">DESCENDING TRIANGLE (Bearish)</text>
  <line x1="42" y1="60" x2="42" y2="248" stroke="#fff" stroke-width="1" stroke-dasharray="2,3" opacity="0.3"/>
  <polygon points="42,60 38,72 46,72" fill="white" opacity="0.3"/>
  <polygon points="42,248 38,236 46,236" fill="white" opacity="0.3"/>
  <text x="6" y="160" fill="white" font-size="9" opacity="0.4">H</text>
</svg>`;

export const DOCS: Doc[] = [
  {
    slug: "triangle-patterns",
    title: "Triangle Chart Patterns",
    subtitle: "Visual guide to entries, stop losses & targets",
    blurb:
      "Ascending and descending triangles — where to enter, where to set your stop, and how to project a target.",
    icon: "📐",
    variants: [
      {
        name: "▲ Ascending",
        chart: ASCENDING_SVG,
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Buy Zone",
            value: "Above Resistance",
            desc: "Enter on a <strong>candle close</strong> above the flat resistance line, not just a wick breach. Wait for confirmation.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Below Last Higher Low",
            desc: "Place stop just below the most recent rising support touch — the last low before the breakout.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Breakout + Pattern Height",
            desc: "Measure the height (H) of the triangle at its widest point. Project that distance upward from the breakout level.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Only take the trade if your target is at least 2× your risk (distance to stop loss). Skip weak setups.",
          },
        ],
        rulesTitle: "Trading Rules — Ascending Triangle",
        rules: [
          "<strong>Flat top, rising bottom.</strong> A valid ascending triangle has a horizontal resistance line tested 2–3+ times and a rising support line making higher lows.",
          "<strong>Volume matters.</strong> Look for volume to <em>decrease</em> during consolidation, then surge on the breakout candle — that confirms real buying pressure.",
          "<strong>Wait for the close.</strong> Do not buy on a wick spike above resistance. The candle must <em>close</em> above it to confirm the breakout.",
          "<strong>Retest opportunity.</strong> Price often pulls back to retest the broken resistance as new support. This is a second, lower-risk entry with a tighter stop.",
          "<strong>False breakouts happen.</strong> If price closes back below resistance after breaking out, exit — the pattern has failed.",
        ],
      },
      {
        name: "▽ Descending",
        chart: DESCENDING_SVG,
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Short Zone",
            value: "Below Support",
            desc: "Enter short on a <strong>candle close</strong> below the flat support line. For long-only traders, this is an <em>exit</em> signal if holding the stock.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Above Last Lower High",
            desc: "Place stop just above the most recent lower high — the last swing high before the breakdown candle.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Breakdown − Pattern Height",
            desc: "Measure the height (H) at the widest point of the triangle. Project that distance <em>downward</em> from the breakdown level.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Target must be at least 2× your risk. On a breakdown, nearby support levels can cut your target short — check the chart.",
          },
        ],
        rulesTitle: "Trading Rules — Descending Triangle",
        rules: [
          "<strong>Flat bottom, falling top.</strong> Valid descending triangles have a horizontal support line tested 2–3+ times and a descending resistance line of lower highs.",
          "<strong>Selling pressure building.</strong> Each rally is weaker than the last (lower highs). Sellers are becoming more aggressive — a key signal of distribution.",
          "<strong>Wait for the candle close.</strong> A wick through support is not confirmation. You need a full candle close below the support line.",
          "<strong>Long traders: cut or hedge.</strong> If you're long in the stock, a close below support is a strong signal to reduce or exit your position.",
          "<strong>Watch for fakeouts.</strong> Sometimes price dips below support, then reverses sharply. The stop above the last lower high protects you from holding a failed short.",
        ],
      },
    ],
  },

  {
    slug: "flag-patterns",
    title: "Flag Patterns",
    subtitle: "Bull & bear flags — continuation breakouts",
    blurb:
      "A sharp move (the pole) then a brief consolidation that breaks in the trend's direction.",
    icon: "🚩",
    variants: [
      {
        name: "▲ Bull Flag",
        chart: buildChart({
          id: "flag-bull",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          trendlines: [
            { x1: 212, p1: 151, x2: 362, p2: 143, label: "Flag", labelAt: "start" },
            { x1: 212, p1: 141, x2: 362, p2: 132 },
          ],
          levels: [
            { p: 130, x1: 370, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 171, x1: 370, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 100, 104, 98, 103),
            cdl(113, 103, 116, 102, 114),
            cdl(151, 114, 133, 113, 131),
            cdl(189, 131, 150, 129, 148),
            cdl(227, 147, 150, 141, 143),
            cdl(265, 143, 146, 137, 139),
            cdl(303, 139, 144, 135, 142),
            cdl(341, 142, 144, 133, 135),
            cdl(379, 136, 159, 135, 157, "buy", true),
            cdl(417, 157, 166, 156, 164),
            cdl(455, 164, 172, 162, 170),
          ],
          marks: [{ x: 379, p: 152, dir: "up", color: LEVEL.buy, label: "BUY (breakout)" }],
          label: {
            text: "BULL FLAG (Bullish)",
            color: "#7c6af7",
            bg: "rgba(124,106,247,0.15)",
            x: 55,
            y: 10,
            w: 168,
          },
        }),
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Buy Zone",
            value: "Above the Flag",
            desc: "Enter on a <strong>candle close</strong> above the flag's upper trendline as the prior uptrend resumes.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Below the Flag Low",
            desc: "Place the stop just under the lowest point of the flag consolidation.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Breakout + Pole Height",
            desc: "Measure the flagpole (the sharp rally) and project that distance up from the breakout level.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Flags can run fast — but only take the trade if the projected target is at least 2× your risk.",
          },
        ],
        rulesTitle: "Trading Rules — Bull Flag",
        rules: [
          "<strong>Pole then channel.</strong> A bull flag is a steep rally (the pole) followed by a slight <em>downward</em>-sloping consolidation on lighter volume.",
          "<strong>Tight and brief.</strong> The best flags are shallow and short-lived. A deep, drawn-out pullback weakens the pattern.",
          "<strong>Wait for the breakout close.</strong> Enter when a candle closes above the upper flag line, not on an intrabar poke.",
          "<strong>Volume confirms.</strong> Volume should dry up during the flag and surge on the breakout candle.",
          "<strong>Invalidation.</strong> A close back below the flag low means the pattern failed — stand aside.",
        ],
      },
      {
        name: "▽ Bear Flag",
        chart: buildChart({
          id: "flag-bear",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          trendlines: [
            { x1: 212, p1: 131, x2: 362, p2: 137, label: "Flag", labelAt: "start" },
            { x1: 212, p1: 120, x2: 362, p2: 128 },
          ],
          levels: [
            { p: 138, x1: 370, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 100, x1: 370, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 168, 170, 164, 165),
            cdl(113, 165, 166, 150, 152),
            cdl(151, 152, 153, 134, 136),
            cdl(189, 136, 138, 118, 120),
            cdl(227, 121, 130, 120, 128),
            cdl(265, 128, 132, 125, 126),
            cdl(303, 126, 133, 124, 131),
            cdl(341, 131, 135, 129, 133),
            cdl(379, 132, 133, 112, 114, "short", true),
            cdl(417, 114, 116, 104, 106),
            cdl(455, 106, 108, 98, 100),
          ],
          marks: [{ x: 379, p: 118, dir: "down", color: LEVEL.short, label: "SHORT (breakdown)" }],
          label: {
            text: "BEAR FLAG (Bearish)",
            color: "#ef5350",
            bg: "rgba(239,83,80,0.12)",
            x: 55,
            y: 300,
            w: 168,
          },
        }),
        cards: [
          {
            kind: "short",
            icon: "📍",
            label: "Entry / Short Zone",
            value: "Below the Flag",
            desc: "Enter short on a <strong>candle close</strong> below the flag's lower trendline. Long-only traders treat this as an <em>exit</em>.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Above the Flag High",
            desc: "Place the stop just above the highest point of the bear-flag bounce.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Breakdown − Pole Height",
            desc: "Measure the flagpole (the sharp drop) and project that distance down from the breakdown level.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Only take the trade if the projected target is at least 2× your risk to the stop.",
          },
        ],
        rulesTitle: "Trading Rules — Bear Flag",
        rules: [
          "<strong>Pole then channel.</strong> A bear flag is a sharp sell-off (the pole) followed by a slight <em>upward</em>-sloping bounce on lighter volume.",
          "<strong>Weak bounce.</strong> The flag is just profit-taking — each up-candle should lack conviction.",
          "<strong>Wait for the breakdown close.</strong> Enter on a candle close below the lower flag line.",
          "<strong>Volume confirms.</strong> Volume fades during the flag and expands on the breakdown.",
          "<strong>Invalidation.</strong> A close back above the flag high voids the setup.",
        ],
      },
    ],
  },

  {
    slug: "head-and-shoulders",
    title: "Head & Shoulders",
    subtitle: "The classic reversal — and its inverse",
    blurb:
      "Three peaks (or troughs) with a neckline trigger. One of the most reliable reversal patterns.",
    icon: "👤",
    variants: [
      {
        name: "▽ Head & Shoulders",
        chart: buildChart({
          id: "hns",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          levels: [
            { p: 130, x1: 130, x2: 430, color: LEVEL.level, label: "Neckline", labelAt: "start" },
            { p: 143, x1: 400, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 104, x1: 400, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 118, 122, 116, 120),
            cdl(113, 120, 140, 119, 138),
            cdl(151, 138, 142, 128, 130),
            cdl(189, 130, 133, 128, 132),
            cdl(227, 132, 158, 131, 156),
            cdl(265, 156, 159, 130, 132),
            cdl(303, 132, 135, 129, 133),
            cdl(341, 133, 142, 131, 140),
            cdl(379, 140, 141, 129, 130),
            cdl(417, 129, 130, 112, 114, "short", true),
            cdl(455, 114, 116, 104, 106),
          ],
          marks: [{ x: 417, p: 127, dir: "down", color: LEVEL.short, label: "SHORT (neckline break)" }],
          label: {
            text: "HEAD & SHOULDERS (Bearish)",
            color: "#ef5350",
            bg: "rgba(239,83,80,0.12)",
            x: 55,
            y: 10,
            w: 228,
          },
        }),
        cards: [
          {
            kind: "short",
            icon: "📍",
            label: "Entry / Short Zone",
            value: "Neckline Break",
            desc: "Short on a <strong>candle close</strong> below the neckline connecting the two troughs.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Above Right Shoulder",
            desc: "Place the stop just above the right shoulder's high.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Neckline − Head Height",
            desc: "Measure from the head's peak down to the neckline, then project that distance below the breakdown.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Skip the setup unless the measured target is at least twice your risk to the stop.",
          },
        ],
        rulesTitle: "Trading Rules — Head & Shoulders",
        rules: [
          "<strong>Three peaks.</strong> A higher middle peak (the head) flanked by two lower peaks (the shoulders) of roughly equal height.",
          "<strong>The neckline.</strong> Connect the two troughs between the peaks — that line is your trigger when broken.",
          "<strong>Wait for the close.</strong> A wick below the neckline is not enough; require a full candle close.",
          "<strong>Retest is common.</strong> Price often pulls back to the broken neckline (now resistance) — a second, lower-risk short.",
          "<strong>Volume clue.</strong> Volume is often lighter on the head and right shoulder than the left — fading momentum.",
        ],
      },
      {
        name: "▲ Inverse H&S",
        chart: buildChart({
          id: "inv-hns",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          levels: [
            { p: 146, x1: 130, x2: 430, color: LEVEL.level, label: "Neckline", labelAt: "start" },
            { p: 131, x1: 400, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 170, x1: 400, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 150, 152, 146, 148),
            cdl(113, 148, 150, 128, 130),
            cdl(151, 130, 146, 129, 144),
            cdl(189, 144, 147, 142, 145),
            cdl(227, 145, 147, 120, 122),
            cdl(265, 122, 146, 121, 144),
            cdl(303, 144, 147, 142, 145),
            cdl(341, 145, 147, 131, 133),
            cdl(379, 133, 146, 132, 144),
            cdl(417, 145, 162, 144, 160, "buy", true),
            cdl(455, 160, 170, 158, 168),
          ],
          marks: [{ x: 417, p: 148, dir: "up", color: LEVEL.buy, label: "BUY (neckline break)" }],
          label: {
            text: "INVERSE H&S (Bullish)",
            color: "#7c6af7",
            bg: "rgba(124,106,247,0.15)",
            x: 55,
            y: 300,
            w: 200,
          },
        }),
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Buy Zone",
            value: "Neckline Break",
            desc: "Buy on a <strong>candle close</strong> above the neckline connecting the two intervening peaks.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Below Right Shoulder",
            desc: "Place the stop just below the right shoulder's low.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Neckline + Head Depth",
            desc: "Measure from the head's low up to the neckline, then project that distance above the breakout.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Only take it when the measured target gives at least a 2:1 reward-to-risk ratio.",
          },
        ],
        rulesTitle: "Trading Rules — Inverse Head & Shoulders",
        rules: [
          "<strong>Three troughs.</strong> A lower middle trough (the head) between two shallower troughs (the shoulders).",
          "<strong>The neckline.</strong> Connect the two peaks between the troughs; a close above it confirms the reversal.",
          "<strong>Wait for the close.</strong> Require a full candle close above the neckline, not just a wick.",
          "<strong>Retest opportunity.</strong> A pullback to the broken neckline (now support) offers a tighter-stop entry.",
          "<strong>Volume clue.</strong> Look for a volume surge on the breakout candle to confirm real demand.",
        ],
      },
    ],
  },

  {
    slug: "double-tops-bottoms",
    title: "Double Tops & Bottoms",
    subtitle: "Twin-peak and twin-trough reversals",
    blurb:
      "Price tests a level twice and fails — an 'M' top or a 'W' bottom that breaks the neckline.",
    icon: "⛰️",
    variants: [
      {
        name: "▽ Double Top",
        chart: buildChart({
          id: "dbl-top",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          levels: [
            { p: 158, x1: 55, x2: 360, color: LEVEL.level, label: "Resistance", labelAt: "start" },
            { p: 131, x1: 130, x2: 430, color: LEVEL.trend, label: "Neckline", labelAt: "start" },
            { p: 160, x1: 400, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 106, x1: 400, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 120, 124, 118, 123),
            cdl(113, 123, 140, 122, 138),
            cdl(151, 138, 158, 137, 156),
            cdl(189, 156, 159, 133, 135),
            cdl(227, 135, 138, 131, 133),
            cdl(265, 133, 150, 132, 148),
            cdl(303, 148, 158, 147, 156),
            cdl(341, 156, 159, 140, 142),
            cdl(379, 142, 144, 131, 133),
            cdl(417, 132, 133, 114, 116, "short", true),
            cdl(455, 116, 118, 106, 108),
          ],
          marks: [{ x: 417, p: 129, dir: "down", color: LEVEL.short, label: "SHORT (neckline break)" }],
          label: {
            text: "DOUBLE TOP (Bearish)",
            color: "#ef5350",
            bg: "rgba(239,83,80,0.12)",
            x: 55,
            y: 300,
            w: 176,
          },
        }),
        cards: [
          {
            kind: "short",
            icon: "📍",
            label: "Entry / Short Zone",
            value: "Neckline Break",
            desc: "Short on a <strong>candle close</strong> below the neckline — the trough between the two peaks.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Above the Peaks",
            desc: "Place the stop just above the double-top resistance.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Neckline − Pattern Height",
            desc: "Measure from the peaks down to the neckline, then project that distance below the break.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Only trade it when the measured target offers at least twice your risk to the stop.",
          },
        ],
        rulesTitle: "Trading Rules — Double Top",
        rules: [
          "<strong>Two equal peaks.</strong> Price tests the same resistance twice and fails, forming an 'M'.",
          "<strong>The neckline.</strong> The low between the peaks is support; breaking it confirms the reversal.",
          "<strong>Second peak weaker.</strong> Lower volume or momentum on the second peak signals buyers are exhausted.",
          "<strong>Wait for the close.</strong> Don't anticipate — require a candle close below the neckline.",
          "<strong>Aggressive option.</strong> Some traders short the second-peak rejection with a tight stop above resistance.",
        ],
      },
      {
        name: "▲ Double Bottom",
        chart: buildChart({
          id: "dbl-bottom",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          levels: [
            { p: 118, x1: 55, x2: 360, color: LEVEL.level, label: "Support", labelAt: "start" },
            { p: 145, x1: 130, x2: 430, color: LEVEL.trend, label: "Neckline", labelAt: "start" },
            { p: 116, x1: 400, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 170, x1: 400, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 156, 158, 152, 154),
            cdl(113, 154, 155, 136, 138),
            cdl(151, 138, 140, 118, 120),
            cdl(189, 120, 143, 119, 141),
            cdl(227, 141, 145, 140, 143),
            cdl(265, 143, 144, 126, 128),
            cdl(303, 128, 130, 118, 120),
            cdl(341, 120, 138, 119, 136),
            cdl(379, 136, 145, 135, 143),
            cdl(417, 144, 162, 143, 160, "buy", true),
            cdl(455, 160, 170, 158, 168),
          ],
          marks: [{ x: 417, p: 147, dir: "up", color: LEVEL.buy, label: "BUY (neckline break)" }],
          label: {
            text: "DOUBLE BOTTOM (Bullish)",
            color: "#7c6af7",
            bg: "rgba(124,106,247,0.15)",
            x: 55,
            y: 10,
            w: 200,
          },
        }),
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Buy Zone",
            value: "Neckline Break",
            desc: "Buy on a <strong>candle close</strong> above the neckline — the peak between the two lows.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Below the Lows",
            desc: "Place the stop just below the double-bottom support.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Neckline + Pattern Height",
            desc: "Measure from the lows up to the neckline, then project that distance above the break.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Take the trade only when the measured target is at least 2× your risk to the stop.",
          },
        ],
        rulesTitle: "Trading Rules — Double Bottom",
        rules: [
          "<strong>Two equal lows.</strong> Price tests the same support twice and holds, forming a 'W'.",
          "<strong>The neckline.</strong> The peak between the lows is resistance; breaking it confirms the reversal.",
          "<strong>Second low holds.</strong> A higher low or lighter volume on the second dip shows sellers fading.",
          "<strong>Wait for the close.</strong> Require a candle close above the neckline before entering.",
          "<strong>Aggressive option.</strong> Some traders buy the second-low hold with a tight stop below support.",
        ],
      },
    ],
  },

  {
    slug: "wedge-patterns",
    title: "Wedge Patterns",
    subtitle: "Rising & falling wedges — the deceptive reversals",
    blurb:
      "Two converging trendlines that slope the same way — and usually break the opposite direction.",
    icon: "📉",
    variants: [
      {
        name: "▽ Rising Wedge",
        chart: buildChart({
          id: "wedge-rising",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          trendlines: [
            { x1: 65, p1: 130, x2: 405, p2: 152 },
            { x1: 65, p1: 110, x2: 405, p2: 148, label: "Wedge", labelAt: "start" },
          ],
          levels: [
            { p: 150, x1: 400, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 110, x1: 400, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 111, 131, 110, 129),
            cdl(113, 129, 130, 116, 118),
            cdl(151, 118, 138, 117, 136),
            cdl(189, 136, 137, 125, 127),
            cdl(227, 127, 143, 126, 141),
            cdl(265, 141, 142, 134, 136),
            cdl(303, 136, 147, 135, 145),
            cdl(341, 145, 146, 141, 142),
            cdl(379, 142, 148, 140, 146),
            cdl(417, 145, 146, 126, 128, "short", true),
            cdl(455, 128, 130, 116, 118),
          ],
          marks: [{ x: 417, p: 126, dir: "down", color: LEVEL.short, label: "SHORT (breakdown)" }],
          label: {
            text: "RISING WEDGE (Bearish)",
            color: "#ef5350",
            bg: "rgba(239,83,80,0.12)",
            x: 55,
            y: 10,
            w: 200,
          },
        }),
        cards: [
          {
            kind: "short",
            icon: "📍",
            label: "Entry / Short Zone",
            value: "Below Lower Line",
            desc: "Short on a <strong>candle close</strong> below the rising lower trendline as the wedge breaks down.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Above Recent High",
            desc: "Place the stop just above the last swing high inside the wedge.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Back to Wedge Start",
            desc: "Wedges often retrace fully — project toward the level where the pattern began.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Only take the trade when the projected target gives at least twice your risk.",
          },
        ],
        rulesTitle: "Trading Rules — Rising Wedge",
        rules: [
          "<strong>Up but tiring.</strong> Both highs and lows rise, but the lows rise faster — the range narrows as momentum fades.",
          "<strong>Bearish bias.</strong> Despite the upward slope, a rising wedge usually resolves <em>downward</em>.",
          "<strong>Wait for the breakdown close.</strong> Enter on a close below the lower trendline, not a wick.",
          "<strong>Volume fades.</strong> Declining volume into the apex warns the trend is running out of buyers.",
          "<strong>Invalidation.</strong> A decisive close back above the upper line voids the short.",
        ],
      },
      {
        name: "▲ Falling Wedge",
        chart: buildChart({
          id: "wedge-falling",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          trendlines: [
            { x1: 65, p1: 160, x2: 405, p2: 128, label: "Wedge", labelAt: "start" },
            { x1: 65, p1: 140, x2: 405, p2: 124 },
          ],
          levels: [
            { p: 126, x1: 400, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 160, x1: 400, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 157, 159, 143, 145),
            cdl(113, 145, 147, 134, 136),
            cdl(151, 136, 152, 135, 150),
            cdl(189, 150, 151, 132, 134),
            cdl(227, 134, 147, 133, 145),
            cdl(265, 145, 146, 130, 132),
            cdl(303, 132, 142, 131, 140),
            cdl(341, 140, 141, 128, 130),
            cdl(379, 130, 135, 128, 133),
            cdl(417, 132, 150, 131, 148, "buy", true),
            cdl(455, 148, 160, 146, 158),
          ],
          marks: [{ x: 417, p: 150, dir: "up", color: LEVEL.buy, label: "BUY (breakout)" }],
          label: {
            text: "FALLING WEDGE (Bullish)",
            color: "#7c6af7",
            bg: "rgba(124,106,247,0.15)",
            x: 55,
            y: 300,
            w: 204,
          },
        }),
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Buy Zone",
            value: "Above Upper Line",
            desc: "Buy on a <strong>candle close</strong> above the falling upper trendline as the wedge breaks out.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Below Recent Low",
            desc: "Place the stop just below the last swing low inside the wedge.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Back to Wedge Start",
            desc: "Falling wedges often retrace fully — project toward where the pattern began.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Take it only when the projected target offers at least a 2:1 reward-to-risk ratio.",
          },
        ],
        rulesTitle: "Trading Rules — Falling Wedge",
        rules: [
          "<strong>Down but tiring.</strong> Both highs and lows fall, but the highs fall faster — the range narrows as selling fades.",
          "<strong>Bullish bias.</strong> Despite the downward slope, a falling wedge usually resolves <em>upward</em>.",
          "<strong>Wait for the breakout close.</strong> Enter on a close above the upper trendline.",
          "<strong>Volume clue.</strong> A volume surge on the breakout confirms buyers stepping in.",
          "<strong>Invalidation.</strong> A close back below the lower line voids the long.",
        ],
      },
    ],
  },

  {
    slug: "pennant-patterns",
    title: "Pennant Patterns",
    subtitle: "Bullish & bearish pennants — the coiled continuation",
    blurb:
      "A sharp pole then a small converging triangle that breaks in the trend's direction.",
    icon: "🎌",
    variants: [
      {
        name: "▲ Bull Pennant",
        chart: buildChart({
          id: "pennant-bull",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          trendlines: [
            { x1: 205, p1: 148, x2: 372, p2: 140, label: "Pennant", labelAt: "start" },
            { x1: 205, p1: 132, x2: 372, p2: 138 },
          ],
          levels: [
            { p: 131, x1: 380, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 171, x1: 380, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 100, 104, 98, 103),
            cdl(113, 103, 118, 102, 116),
            cdl(151, 116, 134, 115, 132),
            cdl(189, 132, 150, 130, 148),
            cdl(227, 147, 148, 134, 136),
            cdl(265, 136, 145, 135, 143),
            cdl(303, 143, 144, 137, 139),
            cdl(341, 139, 142, 138, 141),
            cdl(379, 140, 159, 139, 157, "buy", true),
            cdl(417, 157, 166, 156, 164),
            cdl(455, 164, 172, 162, 170),
          ],
          marks: [{ x: 379, p: 152, dir: "up", color: LEVEL.buy, label: "BUY (breakout)" }],
          label: {
            text: "BULL PENNANT (Bullish)",
            color: "#7c6af7",
            bg: "rgba(124,106,247,0.15)",
            x: 55,
            y: 10,
            w: 196,
          },
        }),
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Buy Zone",
            value: "Above the Pennant",
            desc: "Buy on a <strong>candle close</strong> above the small converging triangle as the trend resumes.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Below Pennant Low",
            desc: "Place the stop just below the lowest point of the pennant.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Breakout + Pole Height",
            desc: "Measure the pole (the sharp rally) and project that distance up from the breakout.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Pennants resolve fast — but only trade when the target is at least 2× your risk.",
          },
        ],
        rulesTitle: "Trading Rules — Bull Pennant",
        rules: [
          "<strong>Pole then coil.</strong> A sharp rally (the pole) followed by a small symmetrical triangle of consolidation.",
          "<strong>Brief and tight.</strong> Pennants are short-lived — a few candles of coiling, not a long base.",
          "<strong>Flag vs pennant.</strong> A flag is a parallel channel; a pennant <em>converges</em> to a point.",
          "<strong>Wait for the breakout.</strong> Enter on a close above the upper boundary, with volume.",
          "<strong>Invalidation.</strong> A close below the pennant low ends the setup.",
        ],
      },
      {
        name: "▽ Bear Pennant",
        chart: buildChart({
          id: "pennant-bear",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          trendlines: [
            { x1: 205, p1: 136, x2: 372, p2: 128, label: "Pennant", labelAt: "start" },
            { x1: 205, p1: 120, x2: 372, p2: 126 },
          ],
          levels: [
            { p: 137, x1: 380, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 100, x1: 380, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 168, 170, 164, 165),
            cdl(113, 165, 166, 150, 152),
            cdl(151, 152, 153, 134, 136),
            cdl(189, 136, 138, 120, 122),
            cdl(227, 123, 135, 122, 133),
            cdl(265, 133, 134, 124, 126),
            cdl(303, 126, 132, 125, 130),
            cdl(341, 130, 131, 126, 128),
            cdl(379, 128, 129, 110, 112, "short", true),
            cdl(417, 112, 114, 102, 104),
            cdl(455, 104, 106, 96, 98),
          ],
          marks: [{ x: 379, p: 118, dir: "down", color: LEVEL.short, label: "SHORT (breakdown)" }],
          label: {
            text: "BEAR PENNANT (Bearish)",
            color: "#ef5350",
            bg: "rgba(239,83,80,0.12)",
            x: 55,
            y: 300,
            w: 200,
          },
        }),
        cards: [
          {
            kind: "short",
            icon: "📍",
            label: "Entry / Short Zone",
            value: "Below the Pennant",
            desc: "Short on a <strong>candle close</strong> below the small converging triangle as the downtrend resumes.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Above Pennant High",
            desc: "Place the stop just above the highest point of the pennant.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Breakdown − Pole Height",
            desc: "Measure the pole (the sharp drop) and project that distance down from the breakdown.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Only take the trade when the measured target is at least twice your risk to the stop.",
          },
        ],
        rulesTitle: "Trading Rules — Bear Pennant",
        rules: [
          "<strong>Pole then coil.</strong> A sharp drop (the pole) followed by a small symmetrical triangle of consolidation.",
          "<strong>Brief and tight.</strong> The coil should be short — just a pause before the next leg down.",
          "<strong>Flag vs pennant.</strong> A flag runs parallel; a pennant <em>converges</em> to a point.",
          "<strong>Wait for the breakdown.</strong> Enter on a close below the lower boundary.",
          "<strong>Invalidation.</strong> A close above the pennant high voids the short.",
        ],
      },
    ],
  },

  {
    slug: "cup-and-handle",
    title: "Cup & Handle",
    subtitle: "The rounded base — and the rounding bottom",
    blurb:
      "A smooth U-shaped base that builds energy for a breakout — with or without a handle.",
    icon: "☕",
    variants: [
      {
        name: "▲ Cup & Handle",
        chart: buildChart({
          id: "cup-handle",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          levels: [
            { p: 150, x1: 55, x2: 430, color: LEVEL.level, label: "Rim", labelAt: "start" },
            { p: 140, x1: 440, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 172, x1: 440, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(70, 150, 152, 147, 149),
            cdl(108, 149, 150, 129, 131),
            cdl(146, 131, 133, 116, 118),
            cdl(184, 118, 120, 109, 111),
            cdl(222, 111, 119, 109, 117),
            cdl(260, 117, 124, 116, 122),
            cdl(298, 122, 132, 121, 130),
            cdl(336, 130, 151, 129, 149),
            cdl(374, 149, 151, 141, 143),
            cdl(412, 143, 146, 141, 145),
            cdl(450, 146, 161, 145, 159, "buy", true),
            cdl(488, 159, 168, 157, 166),
          ],
          marks: [{ x: 450, p: 153, dir: "up", color: LEVEL.buy, label: "BUY (breakout)" }],
          label: {
            text: "CUP & HANDLE (Bullish)",
            color: "#7c6af7",
            bg: "rgba(124,106,247,0.15)",
            x: 55,
            y: 10,
            w: 196,
          },
        }),
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Buy Zone",
            value: "Above the Rim",
            desc: "Buy on a <strong>candle close</strong> above the cup's rim (resistance) as the handle completes.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Below the Handle",
            desc: "Place the stop just below the low of the handle pullback.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Breakout + Cup Depth",
            desc: "Measure the depth of the cup and project that distance up from the breakout.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Only take the trade when the measured target gives at least twice your risk.",
          },
        ],
        rulesTitle: "Trading Rules — Cup & Handle",
        rules: [
          "<strong>Rounded base.</strong> A smooth, U-shaped cup — not a sharp V — shows gradual accumulation.",
          "<strong>The handle.</strong> A small, shallow pullback near the rim shakes out weak hands before the breakout.",
          "<strong>Wait for the rim break.</strong> Enter on a close above the cup's rim, ideally on rising volume.",
          "<strong>Handle depth matters.</strong> A handle that retraces more than ~⅓ of the cup weakens the pattern.",
          "<strong>Bullish continuation.</strong> Best when it forms after a prior uptrend, as a pause before higher prices.",
        ],
      },
      {
        name: "▲ Rounding Bottom",
        chart: buildChart({
          id: "rounding-bottom",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          levels: [
            { p: 150, x1: 55, x2: 425, color: LEVEL.level, label: "Rim", labelAt: "start" },
            { p: 138, x1: 430, x2: 690, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 172, x1: 430, x2: 690, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(70, 150, 152, 147, 149),
            cdl(104, 149, 150, 134, 136),
            cdl(138, 136, 138, 122, 124),
            cdl(172, 124, 126, 114, 116),
            cdl(206, 116, 118, 109, 111),
            cdl(240, 110, 116, 107, 109),
            cdl(274, 109, 117, 108, 115),
            cdl(308, 115, 125, 114, 123),
            cdl(342, 123, 136, 122, 134),
            cdl(376, 134, 151, 133, 149),
            cdl(410, 149, 151, 146, 150),
            cdl(444, 150, 162, 149, 160, "buy", true),
            cdl(478, 160, 170, 158, 168),
          ],
          marks: [{ x: 444, p: 153, dir: "up", color: LEVEL.buy, label: "BUY (breakout)" }],
          label: {
            text: "ROUNDING BOTTOM (Bullish)",
            color: "#7c6af7",
            bg: "rgba(124,106,247,0.15)",
            x: 55,
            y: 10,
            w: 224,
          },
        }),
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Buy Zone",
            value: "Above the Rim",
            desc: "Buy on a <strong>candle close</strong> above the saucer's left-side high (resistance).",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Below the Saucer",
            desc: "Place the stop below the recent base of the rounding bottom.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Breakout + Saucer Depth",
            desc: "Project the depth of the saucer up from the breakout level.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Take the trade only when the measured target is at least 2× your risk.",
          },
        ],
        rulesTitle: "Trading Rules — Rounding Bottom",
        rules: [
          "<strong>Slow saucer.</strong> A long, smooth, U-shaped base with no sharp lows — a gradual shift from sellers to buyers.",
          "<strong>Patience required.</strong> Rounding bottoms form over long periods; the curl up should be steady.",
          "<strong>Volume bowl.</strong> Volume often mirrors price — high at the edges, low at the base, rising into the breakout.",
          "<strong>Wait for the breakout.</strong> Enter on a close above the left-side rim.",
          "<strong>Bullish reversal.</strong> Signals the end of a downtrend and the start of a new advance.",
        ],
      },
    ],
  },

  {
    slug: "triple-tops-bottoms",
    title: "Triple Tops & Bottoms",
    subtitle: "Three failed tests — a stronger reversal",
    blurb:
      "Like double tops and bottoms, but price tests the level a third time before reversing.",
    icon: "🔱",
    variants: [
      {
        name: "▽ Triple Top",
        chart: buildChart({
          id: "triple-top",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          levels: [
            { p: 155, x1: 55, x2: 440, color: LEVEL.level, label: "Resistance", labelAt: "start" },
            { p: 129, x1: 130, x2: 470, color: LEVEL.trend, label: "Neckline", labelAt: "start" },
            { p: 157, x1: 475, x2: 700, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 103, x1: 475, x2: 700, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 118, 122, 116, 120),
            cdl(113, 120, 140, 119, 138),
            cdl(151, 138, 155, 137, 153),
            cdl(189, 153, 156, 129, 131),
            cdl(227, 131, 150, 130, 148),
            cdl(265, 148, 156, 147, 154),
            cdl(303, 154, 157, 129, 131),
            cdl(341, 131, 151, 130, 149),
            cdl(379, 149, 156, 148, 154),
            cdl(417, 154, 155, 130, 132),
            cdl(455, 130, 131, 114, 116, "short", true),
          ],
          marks: [{ x: 455, p: 128, dir: "down", color: LEVEL.short, label: "SHORT (neckline break)" }],
          label: {
            text: "TRIPLE TOP (Bearish)",
            color: "#ef5350",
            bg: "rgba(239,83,80,0.12)",
            x: 55,
            y: 300,
            w: 178,
          },
        }),
        cards: [
          {
            kind: "short",
            icon: "📍",
            label: "Entry / Short Zone",
            value: "Neckline Break",
            desc: "Short on a <strong>candle close</strong> below the support connecting the three troughs.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Above Resistance",
            desc: "Place the stop just above the triple-top resistance.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Neckline − Pattern Height",
            desc: "Measure from the peaks to the neckline and project that distance below the break.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Only take the trade when the measured target offers at least 2× your risk.",
          },
        ],
        rulesTitle: "Trading Rules — Triple Top",
        rules: [
          "<strong>Three failed peaks.</strong> Price tests the same resistance three times and can't break through.",
          "<strong>Stronger than a double.</strong> A third rejection shows even more seller conviction at the level.",
          "<strong>The neckline.</strong> The shared support below the peaks is the trigger when broken.",
          "<strong>Wait for the close.</strong> Require a candle close below the neckline before shorting.",
          "<strong>Volume clue.</strong> Lighter volume on each successive peak signals fading demand.",
        ],
      },
      {
        name: "▲ Triple Bottom",
        chart: buildChart({
          id: "triple-bottom",
          minP: 95,
          maxP: 175,
          yLabels: [100, 120, 140, 160],
          levels: [
            { p: 120, x1: 55, x2: 440, color: LEVEL.level, label: "Support", labelAt: "start" },
            { p: 146, x1: 130, x2: 470, color: LEVEL.trend, label: "Neckline", labelAt: "start" },
            { p: 118, x1: 475, x2: 700, color: LEVEL.stop, label: "Stop Loss", arrow: true },
            { p: 172, x1: 475, x2: 700, color: LEVEL.target, label: "Target", arrow: true },
          ],
          candles: [
            cdl(75, 156, 158, 152, 154),
            cdl(113, 154, 155, 136, 138),
            cdl(151, 138, 140, 120, 122),
            cdl(189, 122, 146, 121, 144),
            cdl(227, 144, 147, 126, 128),
            cdl(265, 128, 130, 120, 122),
            cdl(303, 122, 147, 121, 145),
            cdl(341, 145, 148, 127, 129),
            cdl(379, 129, 131, 120, 122),
            cdl(417, 122, 146, 121, 144),
            cdl(455, 145, 162, 144, 160, "buy", true),
          ],
          marks: [{ x: 455, p: 148, dir: "up", color: LEVEL.buy, label: "BUY (neckline break)" }],
          label: {
            text: "TRIPLE BOTTOM (Bullish)",
            color: "#7c6af7",
            bg: "rgba(124,106,247,0.15)",
            x: 55,
            y: 10,
            w: 200,
          },
        }),
        cards: [
          {
            kind: "buy",
            icon: "📍",
            label: "Entry / Buy Zone",
            value: "Neckline Break",
            desc: "Buy on a <strong>candle close</strong> above the resistance connecting the three peaks.",
          },
          {
            kind: "stop",
            icon: "🛑",
            label: "Stop Loss",
            value: "Below Support",
            desc: "Place the stop just below the triple-bottom support.",
          },
          {
            kind: "target",
            icon: "🎯",
            label: "Price Target",
            value: "Neckline + Pattern Height",
            desc: "Measure from the lows to the neckline and project that distance above the break.",
          },
          {
            kind: "rr",
            icon: "⚖️",
            label: "Risk / Reward",
            value: "Aim for ≥ 2:1",
            desc: "Take the trade only when the measured target is at least twice your risk to the stop.",
          },
        ],
        rulesTitle: "Trading Rules — Triple Bottom",
        rules: [
          "<strong>Three held lows.</strong> Price tests the same support three times and refuses to break down.",
          "<strong>Stronger than a double.</strong> A third successful defense shows strong buying interest.",
          "<strong>The neckline.</strong> The shared resistance above the lows is the trigger when broken.",
          "<strong>Wait for the close.</strong> Require a candle close above the neckline before buying.",
          "<strong>Volume clue.</strong> A volume surge on the breakout confirms the reversal.",
        ],
      },
    ],
  },

  {
    slug: "single-candles",
    title: "Single Candlestick Signals",
    subtitle: "Reading one candle — body, wicks & meaning",
    blurb:
      "Doji, hammer, shooting star and marubozu — what a single candle's shape is telling you.",
    icon: "🕯️",
    variants: [
      {
        name: "✛ Doji",
        chart: buildChart({
          id: "cs-doji",
          minP: 95,
          maxP: 165,
          yLabels: [],
          candles: [
            cdl(150, 102, 116, 100, 114),
            cdl(195, 114, 128, 112, 126),
            cdl(240, 126, 139, 124, 137),
            bigCdl(340, 140, 156, 124, 141, undefined, 38),
          ],
          notes: [
            { x: 372, p: 141, text: "open ≈ close", color: "#e8eaf0", anchor: "start" },
            { x: 340, p: 161, text: "long upper wick", color: "#7b8499", anchor: "middle" },
            { x: 340, p: 119, text: "long lower wick", color: "#7b8499", anchor: "middle" },
          ],
          label: { text: "DOJI (Indecision)", color: "#facc15", bg: "rgba(250,204,21,0.12)", x: 55, y: 10, w: 162 },
        }),
        cards: [
          { kind: "neutral", icon: "📊", label: "Signal", value: "Indecision", desc: "Buyers and sellers ended in a stalemate — the close returned to the open." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Tiny body, wicks both sides", desc: "A very small (or absent) body with upper and lower shadows of similar length." },
          { kind: "rr", icon: "📍", label: "Context", value: "Watch at extremes", desc: "Most meaningful after a strong trend — it warns momentum may be stalling." },
          { kind: "target", icon: "✅", label: "Confirmation", value: "Needs the next candle", desc: "A doji alone is neutral; trade the direction the following candle confirms." },
        ],
        rulesTitle: "Reading the Doji",
        rules: [
          "<strong>Stalemate.</strong> Open and close are nearly equal — neither side won the session.",
          "<strong>Location is everything.</strong> A doji mid-range means little; after an extended move it can signal a turn.",
          "<strong>Variations.</strong> A long-legged doji shows volatility; gravestone and dragonfly dojis hint at direction.",
          "<strong>Spinning top cousin.</strong> A slightly larger body with long wicks carries the same indecision message.",
          "<strong>Always confirm.</strong> Wait for the next candle to break the doji's range before acting.",
        ],
      },
      {
        name: "🔨 Hammer",
        chart: buildChart({
          id: "cs-hammer",
          minP: 95,
          maxP: 165,
          yLabels: [],
          candles: [
            cdl(150, 150, 152, 138, 140),
            cdl(195, 140, 142, 128, 130),
            cdl(240, 130, 132, 120, 122),
            bigCdl(340, 123, 127, 104, 125, "bull", 38),
          ],
          notes: [
            { x: 340, p: 100, text: "long lower wick (≥ 2× body)", color: "#26a69a", anchor: "middle" },
            { x: 372, p: 125, text: "small body up top", color: "#e8eaf0", anchor: "start" },
          ],
          label: { text: "HAMMER (Bullish reversal)", color: "#7c6af7", bg: "rgba(124,106,247,0.15)", x: 55, y: 10, w: 226 },
        }),
        cards: [
          { kind: "buy", icon: "📊", label: "Signal", value: "Bullish reversal", desc: "Sellers pushed price down but buyers slammed it back up by the close." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Small body, long lower wick", desc: "A lower wick at least ~2× the body, with little or no upper wick." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "A downtrend", desc: "Only a hammer when it appears at the bottom of a decline or at support." },
          { kind: "target", icon: "✅", label: "Confirmation", value: "Green follow-through", desc: "A strong up-candle after the hammer confirms buyers have taken control." },
        ],
        rulesTitle: "Reading the Hammer",
        rules: [
          "<strong>Rejection of lows.</strong> The long lower wick shows sellers were overwhelmed intraday.",
          "<strong>Context required.</strong> A hammer is only bullish after a downtrend or at support.",
          "<strong>Body color.</strong> Either color works, but a green hammer is slightly stronger.",
          "<strong>Inverted hammer.</strong> The mirror image (long upper wick after a downtrend) is also bullish.",
          "<strong>Confirm before buying.</strong> Enter on follow-through, with a stop below the hammer's low.",
        ],
      },
      {
        name: "🌠 Shooting Star",
        chart: buildChart({
          id: "cs-star",
          minP: 100,
          maxP: 172,
          yLabels: [],
          candles: [
            cdl(150, 108, 122, 106, 120),
            cdl(195, 120, 134, 118, 132),
            cdl(240, 132, 144, 130, 142),
            bigCdl(340, 143, 162, 141, 145, "bear", 38),
          ],
          notes: [
            { x: 340, p: 167, text: "long upper wick (≥ 2× body)", color: "#ef5350", anchor: "middle" },
            { x: 372, p: 145, text: "small body down low", color: "#e8eaf0", anchor: "start" },
          ],
          label: { text: "SHOOTING STAR (Bearish reversal)", color: "#ef5350", bg: "rgba(239,83,80,0.12)", x: 55, y: 10, w: 262 },
        }),
        cards: [
          { kind: "short", icon: "📊", label: "Signal", value: "Bearish reversal", desc: "Buyers pushed price up but sellers rejected it, closing near the low." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Small body, long upper wick", desc: "An upper wick at least ~2× the body, with little or no lower wick." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "An uptrend", desc: "Only a shooting star when it appears at the top of a rally or at resistance." },
          { kind: "target", icon: "✅", label: "Confirmation", value: "Red follow-through", desc: "A strong down-candle afterward confirms sellers are in control." },
        ],
        rulesTitle: "Reading the Shooting Star",
        rules: [
          "<strong>Rejection of highs.</strong> The long upper wick shows buyers were overwhelmed intraday.",
          "<strong>Context required.</strong> Only bearish after an uptrend or at resistance.",
          "<strong>Hanging man cousin.</strong> A long <em>lower</em> wick after an uptrend (hanging man) is also a warning.",
          "<strong>Body color.</strong> A red shooting star is slightly stronger than green.",
          "<strong>Confirm before shorting.</strong> Enter on follow-through, stop above the star's high.",
        ],
      },
      {
        name: "▮ Marubozu",
        chart: buildChart({
          id: "cs-marubozu",
          minP: 100,
          maxP: 165,
          yLabels: [],
          candles: [
            cdl(150, 110, 116, 108, 114),
            cdl(195, 114, 120, 112, 118),
            bigCdl(310, 116, 150, 116, 150, "bull", 38),
            bigCdl(430, 150, 150, 116, 116, "bear", 38),
          ],
          notes: [
            { x: 310, p: 155, text: "Bullish", color: "#26a69a", anchor: "middle" },
            { x: 430, p: 155, text: "Bearish", color: "#ef5350", anchor: "middle" },
            { x: 370, p: 108, text: "no wicks — full body", color: "#7b8499", anchor: "middle" },
          ],
          label: { text: "MARUBOZU (Strong conviction)", color: "#7c6af7", bg: "rgba(124,106,247,0.15)", x: 55, y: 10, w: 240 },
        }),
        cards: [
          { kind: "neutral", icon: "📊", label: "Signal", value: "Strong conviction", desc: "One side dominated from open to close with no hesitation." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Full body, no wicks", desc: "Open and close sit at the extremes — no upper or lower shadow." },
          { kind: "buy", icon: "▲", label: "Bullish Marubozu", value: "Buyers in control", desc: "A green marubozu opens at the low and closes at the high — strong demand." },
          { kind: "short", icon: "▼", label: "Bearish Marubozu", value: "Sellers in control", desc: "A red marubozu opens at the high and closes at the low — strong supply." },
        ],
        rulesTitle: "Reading the Marubozu",
        rules: [
          "<strong>No wicks, no doubt.</strong> The absence of shadows means one side controlled the entire session.",
          "<strong>Continuation or start.</strong> A marubozu often launches or extends a strong move.",
          "<strong>Size matters.</strong> The bigger the body, the stronger the signal.",
          "<strong>Within a trend.</strong> A marubozu in the trend's direction is a powerful continuation cue.",
          "<strong>Watch for exhaustion.</strong> After a long run, a huge marubozu can mark a climax — stay alert.",
        ],
      },
    ],
  },

  {
    slug: "two-candle-patterns",
    title: "Two-Candle Patterns",
    subtitle: "Engulfing, harami & tweezers",
    blurb:
      "How a pair of candles signals a reversal — when the second candle overpowers or pauses the first.",
    icon: "🤝",
    variants: [
      {
        name: "▲ Bullish Engulfing",
        chart: buildChart({
          id: "cs-bull-engulf",
          minP: 110,
          maxP: 165,
          yLabels: [],
          candles: [
            cdl(150, 152, 154, 142, 144),
            cdl(195, 144, 146, 132, 134),
            bigCdl(285, 134, 136, 124, 126, "bear", 34),
            bigCdl(345, 124, 140, 122, 138, "bull", 36),
          ],
          notes: [{ x: 345, p: 144, text: "green engulfs prior red body", color: "#26a69a", anchor: "middle" }],
          label: { text: "BULLISH ENGULFING (Bullish)", color: "#7c6af7", bg: "rgba(124,106,247,0.15)", x: 55, y: 10, w: 250 },
        }),
        cards: [
          { kind: "buy", icon: "📊", label: "Signal", value: "Bullish reversal", desc: "A big green candle completely engulfs the prior red body — buyers overwhelm sellers." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Green body > prior red body", desc: "The second candle opens at/below the prior close and closes above the prior open." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "A downtrend", desc: "Most powerful at the bottom of a decline or at support." },
          { kind: "target", icon: "✅", label: "Reliability", value: "Strong & immediate", desc: "One of the more reliable reversals — especially on high volume." },
        ],
        rulesTitle: "Trading Rules — Bullish Engulfing",
        rules: [
          "<strong>Engulfment.</strong> The green body must fully cover the previous candle's body (wicks don't count).",
          "<strong>Context.</strong> Only a reversal signal after a downtrend.",
          "<strong>Volume helps.</strong> Heavy volume on the engulfing candle adds conviction.",
          "<strong>Bigger is better.</strong> The more decisively it engulfs, the stronger the signal.",
          "<strong>Entry.</strong> Buy the close or a minor pullback, stop below the pattern low.",
        ],
      },
      {
        name: "▽ Bearish Engulfing",
        chart: buildChart({
          id: "cs-bear-engulf",
          minP: 100,
          maxP: 155,
          yLabels: [],
          candles: [
            cdl(150, 108, 120, 106, 118),
            cdl(195, 118, 130, 116, 128),
            bigCdl(285, 130, 138, 128, 136, "bull", 34),
            bigCdl(345, 138, 140, 122, 124, "bear", 36),
          ],
          notes: [{ x: 345, p: 118, text: "red engulfs prior green body", color: "#ef5350", anchor: "middle" }],
          label: { text: "BEARISH ENGULFING (Bearish)", color: "#ef5350", bg: "rgba(239,83,80,0.12)", x: 55, y: 10, w: 252 },
        }),
        cards: [
          { kind: "short", icon: "📊", label: "Signal", value: "Bearish reversal", desc: "A big red candle engulfs the prior green body — sellers overwhelm buyers." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Red body > prior green body", desc: "The second candle opens at/above the prior close and closes below the prior open." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "An uptrend", desc: "Most powerful at the top of a rally or at resistance." },
          { kind: "target", icon: "✅", label: "Reliability", value: "Strong & immediate", desc: "A reliable top signal, particularly on rising volume." },
        ],
        rulesTitle: "Trading Rules — Bearish Engulfing",
        rules: [
          "<strong>Engulfment.</strong> The red body must fully cover the previous green body.",
          "<strong>Context.</strong> Only a reversal after an uptrend.",
          "<strong>Volume helps.</strong> Heavy selling volume strengthens the signal.",
          "<strong>Bigger is better.</strong> A decisive engulf is more trustworthy.",
          "<strong>Entry.</strong> Short the close or a small bounce, stop above the pattern high.",
        ],
      },
      {
        name: "◧ Harami",
        chart: buildChart({
          id: "cs-harami",
          minP: 105,
          maxP: 160,
          yLabels: [],
          candles: [
            cdl(155, 150, 152, 140, 142),
            cdl(200, 142, 144, 134, 136),
            bigCdl(300, 135, 137, 116, 118, "bear", 36),
            bigCdl(360, 124, 128, 122, 127, "bull", 24),
          ],
          notes: [{ x: 360, p: 113, text: "small body inside the prior", color: "#7b8499", anchor: "middle" }],
          label: { text: "BULLISH HARAMI (Bullish)", color: "#7c6af7", bg: "rgba(124,106,247,0.15)", x: 55, y: 10, w: 222 },
        }),
        cards: [
          { kind: "neutral", icon: "📊", label: "Signal", value: "Potential reversal", desc: "A small candle sits inside the prior large body — momentum is pausing." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Small body inside the prior", desc: "The second candle's body is fully contained within the first candle's body." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "A strong trend", desc: "A bullish harami follows a downtrend; a bearish harami follows an uptrend." },
          { kind: "target", icon: "✅", label: "Reliability", value: "Weaker — confirm it", desc: "Less reliable than engulfing; wait for the next candle to confirm." },
        ],
        rulesTitle: "Trading Rules — Harami",
        rules: [
          "<strong>Inside candle.</strong> The second body sits fully inside the first — a 'pregnant' pause ('harami').",
          "<strong>Loss of momentum.</strong> The shrinking range hints the prior trend is tiring.",
          "<strong>Color.</strong> A harami where the small candle opposes the trend is the classic setup.",
          "<strong>Confirmation needed.</strong> On its own it's tentative — let the next candle decide.",
          "<strong>Harami cross.</strong> If the inside candle is a doji, the reversal signal is stronger.",
        ],
      },
      {
        name: "⊓ Tweezers",
        chart: buildChart({
          id: "cs-tweezer",
          minP: 105,
          maxP: 160,
          yLabels: [],
          candles: [
            cdl(160, 148, 150, 138, 140),
            cdl(205, 140, 142, 128, 130),
            bigCdl(305, 130, 132, 116, 118, "bear", 34),
            bigCdl(365, 118, 130, 116, 128, "bull", 34),
          ],
          notes: [{ x: 335, p: 111, text: "matching lows", color: "#26a69a", anchor: "middle" }],
          label: { text: "TWEEZER BOTTOM (Bullish)", color: "#7c6af7", bg: "rgba(124,106,247,0.15)", x: 55, y: 10, w: 230 },
        }),
        cards: [
          { kind: "buy", icon: "📊", label: "Signal", value: "Bullish reversal", desc: "Two candles share almost the same low — sellers failed twice at that level." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Matching lows", desc: "A down-candle then an up-candle with near-identical lows (a tweezer bottom)." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "A downtrend", desc: "At resistance, matching highs form a bearish tweezer top instead." },
          { kind: "target", icon: "✅", label: "Reliability", value: "Moderate", desc: "Stronger when the lows are exact and volume rises on the bounce." },
        ],
        rulesTitle: "Trading Rules — Tweezers",
        rules: [
          "<strong>Double rejection.</strong> Two consecutive candles reject the same price — support (bottom) or resistance (top).",
          "<strong>Tweezer top.</strong> The bearish version is two matching highs after an uptrend.",
          "<strong>Precision counts.</strong> The closer the matching wicks, the cleaner the signal.",
          "<strong>Context.</strong> Most useful at an established support or resistance level.",
          "<strong>Confirm.</strong> Trade the break of the second candle in the reversal direction.",
        ],
      },
    ],
  },

  {
    slug: "three-candle-patterns",
    title: "Three-Candle Patterns",
    subtitle: "Stars & soldiers",
    blurb:
      "Three-candle reversals and continuations — among the most reliable candlestick signals.",
    icon: "✨",
    variants: [
      {
        name: "▲ Morning Star",
        chart: buildChart({
          id: "cs-morning",
          minP: 105,
          maxP: 160,
          yLabels: [],
          candles: [
            cdl(150, 150, 152, 142, 144),
            cdl(190, 144, 146, 136, 138),
            bigCdl(280, 137, 139, 118, 120, "bear", 30),
            bigCdl(335, 116, 120, 112, 117, "bull", 22),
            bigCdl(390, 122, 140, 121, 138, "bull", 30),
          ],
          notes: [{ x: 335, p: 108, text: "the 'star'", color: "#7b8499", anchor: "middle" }],
          label: { text: "MORNING STAR (Bullish)", color: "#7c6af7", bg: "rgba(124,106,247,0.15)", x: 55, y: 10, w: 206 },
        }),
        cards: [
          { kind: "buy", icon: "📊", label: "Signal", value: "Bullish reversal", desc: "A downtrend, a small indecision candle, then a strong green recovery." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Big red → star → big green", desc: "The middle 'star' gaps down, then a green candle closes well into the first red body." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "A downtrend", desc: "A classic bottoming pattern at the end of a decline." },
          { kind: "target", icon: "✅", label: "Reliability", value: "Strong", desc: "Three-candle reversals are among the more reliable — especially with volume." },
        ],
        rulesTitle: "Trading Rules — Morning Star",
        rules: [
          "<strong>Three acts.</strong> Capitulation (red), indecision (star), then recovery (green).",
          "<strong>The star.</strong> A small body — ideally gapping away from the first candle — marks the turn.",
          "<strong>Deep recovery.</strong> The third candle should close at least halfway up the first red body.",
          "<strong>Morning doji star.</strong> If the star is a doji, the signal is even stronger.",
          "<strong>Confirm & enter.</strong> Buy on the third candle's close, stop below the star's low.",
        ],
      },
      {
        name: "▽ Evening Star",
        chart: buildChart({
          id: "cs-evening",
          minP: 100,
          maxP: 162,
          yLabels: [],
          candles: [
            cdl(150, 108, 120, 106, 118),
            cdl(190, 118, 130, 116, 128),
            bigCdl(280, 129, 148, 128, 146, "bull", 30),
            bigCdl(335, 150, 154, 146, 151, "bear", 22),
            bigCdl(390, 144, 146, 126, 128, "bear", 30),
          ],
          notes: [{ x: 335, p: 160, text: "the 'star'", color: "#7b8499", anchor: "middle" }],
          label: { text: "EVENING STAR (Bearish)", color: "#ef5350", bg: "rgba(239,83,80,0.12)", x: 55, y: 300, w: 206 },
        }),
        cards: [
          { kind: "short", icon: "📊", label: "Signal", value: "Bearish reversal", desc: "An uptrend, a small indecision candle, then a strong red decline." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Big green → star → big red", desc: "The middle 'star' gaps up, then a red candle closes well into the first green body." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "An uptrend", desc: "A classic topping pattern at the end of a rally." },
          { kind: "target", icon: "✅", label: "Reliability", value: "Strong", desc: "A reliable top signal, more so with heavy volume on the third candle." },
        ],
        rulesTitle: "Trading Rules — Evening Star",
        rules: [
          "<strong>Three acts.</strong> Euphoria (green), indecision (star), then breakdown (red).",
          "<strong>The star.</strong> A small body gapping above the first candle marks the exhaustion.",
          "<strong>Deep decline.</strong> The third candle should close at least halfway down the first green body.",
          "<strong>Evening doji star.</strong> A doji star strengthens the reversal.",
          "<strong>Confirm & enter.</strong> Short on the third candle's close, stop above the star's high.",
        ],
      },
      {
        name: "▲ Three White Soldiers",
        chart: buildChart({
          id: "cs-soldiers",
          minP: 105,
          maxP: 170,
          yLabels: [],
          candles: [
            cdl(150, 124, 126, 118, 120),
            bigCdl(250, 118, 134, 116, 132, "bull", 30),
            bigCdl(320, 128, 146, 126, 144, "bull", 30),
            bigCdl(390, 140, 158, 138, 156, "bull", 30),
          ],
          notes: [{ x: 320, p: 110, text: "three rising green candles", color: "#26a69a", anchor: "middle" }],
          label: { text: "THREE WHITE SOLDIERS (Bullish)", color: "#7c6af7", bg: "rgba(124,106,247,0.15)", x: 55, y: 10, w: 274 },
        }),
        cards: [
          { kind: "buy", icon: "📊", label: "Signal", value: "Bullish reversal / continuation", desc: "Three strong green candles in a row — steady, determined buying." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Three rising green bodies", desc: "Each opens within the prior body and closes near its high, at a new high." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "A downtrend or pause", desc: "Most meaningful emerging from a bottom or a consolidation." },
          { kind: "target", icon: "✅", label: "Reliability", value: "Strong", desc: "Powerful when bodies are similar-sized with small upper wicks." },
        ],
        rulesTitle: "Trading Rules — Three White Soldiers",
        rules: [
          "<strong>Steady advance.</strong> Three consecutive green candles, each closing higher than the last.",
          "<strong>Healthy structure.</strong> Each opens inside the prior body and closes near its high.",
          "<strong>Beware overextension.</strong> Very long candles can mean the move is already overbought.",
          "<strong>Small upper wicks.</strong> Tiny upper shadows show buyers held control into the close.",
          "<strong>Continuation too.</strong> Within an uptrend, it signals strong continuation.",
        ],
      },
      {
        name: "▽ Three Black Crows",
        chart: buildChart({
          id: "cs-crows",
          minP: 95,
          maxP: 160,
          yLabels: [],
          candles: [
            cdl(150, 140, 148, 138, 146),
            bigCdl(250, 146, 148, 130, 132, "bear", 30),
            bigCdl(320, 132, 134, 116, 118, "bear", 30),
            bigCdl(390, 118, 120, 102, 104, "bear", 30),
          ],
          notes: [{ x: 320, p: 158, text: "three falling red candles", color: "#ef5350", anchor: "middle" }],
          label: { text: "THREE BLACK CROWS (Bearish)", color: "#ef5350", bg: "rgba(239,83,80,0.12)", x: 55, y: 10, w: 252 },
        }),
        cards: [
          { kind: "short", icon: "📊", label: "Signal", value: "Bearish reversal / continuation", desc: "Three strong red candles in a row — steady, determined selling." },
          { kind: "info", icon: "🕯️", label: "Anatomy", value: "Three falling red bodies", desc: "Each opens within the prior body and closes near its low, at a new low." },
          { kind: "rr", icon: "📍", label: "Forms after", value: "An uptrend or pause", desc: "Most meaningful emerging from a top or a consolidation." },
          { kind: "target", icon: "✅", label: "Reliability", value: "Strong", desc: "Convincing when bodies are similar-sized with small lower wicks." },
        ],
        rulesTitle: "Trading Rules — Three Black Crows",
        rules: [
          "<strong>Steady decline.</strong> Three consecutive red candles, each closing lower than the last.",
          "<strong>Healthy structure.</strong> Each opens inside the prior body and closes near its low.",
          "<strong>Beware overextension.</strong> Very long candles can mean the move is already oversold.",
          "<strong>Small lower wicks.</strong> Tiny lower shadows show sellers held control into the close.",
          "<strong>Continuation too.</strong> Within a downtrend, it signals strong continuation.",
        ],
      },
    ],
  },
];

export function getDoc(slug: string): Doc | undefined {
  return DOCS.find((d) => d.slug === slug);
}
