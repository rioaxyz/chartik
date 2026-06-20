# Chartik — Trading Quiz

> Get chart-literate.

An interactive quiz for learning to read the markets. Look at candlestick
visuals and answer multiple-choice questions across four topics:

1. **Candle Basics** — one candle shown; name its type (bullish, bearish, doji, spinning top, hammer, shooting star, marubozu).
2. **What Happens Next?** — 15–30 candles shown; predict bullish / sideways / bearish momentum.
3. **Candlestick Patterns** — identify few-candle formations (engulfing, morning/evening star, three white soldiers).
4. **Chart Patterns** — identify large multi-candle formations (cup & handle, double/triple tops & bottoms, head & shoulders, triangles, wedges, flags, pennants, rectangles, rounding bottoms).

Every charting visual is **rendered as SVG from raw OHLC data** (see
`components/CandlestickChart.tsx`), so there are no image assets to manage and
every question's correct answer is provable from the data.

## Stack

- **Next.js 15** (App Router) — front end + backend API in one deployable unit
- **TypeScript**
- **Tailwind CSS**
- Serves cleanly as a static front end + serverless API on **Vercel**

## Project layout

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Landing page with topic cards |
| `app/quiz/page.tsx` | Quiz route (reads `?topic=`) |
| `app/api/quiz/route.ts` | Backend endpoint serving questions |
| `components/QuizClient.tsx` | Interactive quiz UI + scoring |
| `components/CandlestickChart.tsx` | SVG candlestick renderer |
| `lib/questions.ts` | Question bank + seeded candle generator |
| `lib/types.ts` | Shared types |

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

Requires Node.js >= 20. (Pinned to Next 15.5.x; Next 16 requires Node >= 20.9.)

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

Push to a Git repo and import it at [vercel.com/new](https://vercel.com/new).
Vercel auto-detects Next.js — no configuration needed. The `/api/quiz` route
becomes a serverless function automatically.

## Adding questions

Add entries to `QUESTIONS` in `lib/questions.ts`:

- **Single-candle questions** — provide a hand-tuned OHLC object and pick choices with `types(...)`.
- **Trend questions** — use `genSeries({ ... })` with a `drift` (positive = uptrend, negative = downtrend) and optional `meanReversion` (for sideways ranges).
- **Chart-pattern questions** — sculpt a price skeleton with `skeleton(start, seg(...), curve(...), ...)` then pass it to `candlesFromPath(seed, path)`. Pick choices with `cp(...)`. `seg` draws straight trendlines (triangles, wedges, flags); `curve` draws rounded shapes (cup & handle, rounding bottom).

The seeded PRNG keeps server/client output identical to avoid hydration mismatches.
