/**
 * Annotated pattern-chart SVG builder for the docs guides. Produces the same
 * visual style as the hand-authored triangle charts (grid, candles, dashed
 * trendlines, target/stop levels, entry marker, pattern label) from a compact
 * spec — so a new guide chart is a few lines of data, not raw SVG.
 */

const W = 780;
const H = 340;
const TOP = 18;
const BOT = 322;

const COLOR = {
  bull: "#26a69a",
  bear: "#ef5350",
  buy: "#00e676",
  short: "#ef5350",
  level: "#facc15",
  trend: "#7c6af7",
  target: "#40c4ff",
  stop: "#ff6d00",
  axis: "#7b8499",
  grid: "#1e2535",
} as const;

export interface SvgCandle {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
  kind?: "bull" | "bear" | "buy" | "short";
  glow?: boolean;
  /** Body width override (default 14). Use larger for zoomed candle art. */
  w?: number;
}

/** Compact candle constructor. */
export function cdl(
  x: number,
  o: number,
  h: number,
  l: number,
  c: number,
  kind?: SvgCandle["kind"],
  glow?: boolean,
): SvgCandle {
  return { x, o, h, l, c, kind, glow };
}

/** Wide candle constructor (for zoomed-in candlestick guides). */
export function bigCdl(
  x: number,
  o: number,
  h: number,
  l: number,
  c: number,
  kind?: SvgCandle["kind"],
  w = 34,
): SvgCandle {
  return { x, o, h, l, c, kind, w };
}

/** A plain text annotation placed at a price/x location. */
export interface SvgNote {
  x: number;
  p: number;
  text: string;
  color: string;
  anchor?: "start" | "middle" | "end";
}

export interface SvgTrend {
  x1: number;
  p1: number;
  x2: number;
  p2: number;
  color?: string;
  label?: string;
  labelAt?: "start" | "end";
}

export interface SvgLevel {
  p: number;
  x1: number;
  x2: number;
  color: string;
  label: string;
  labelAt?: "start" | "end";
  arrow?: boolean;
}

export interface SvgMark {
  x: number;
  p: number;
  dir: "up" | "down";
  color: string;
  label: string;
}

export interface ChartSpec {
  id: string;
  minP: number;
  maxP: number;
  yLabels: number[];
  trendlines?: SvgTrend[];
  levels?: SvgLevel[];
  candles: SvgCandle[];
  marks?: SvgMark[];
  notes?: SvgNote[];
  label: { text: string; color: string; bg: string; x: number; y: number; w: number };
}

export function buildChart(s: ChartSpec): string {
  const y = (p: number) =>
    +(TOP + ((s.maxP - p) * (BOT - TOP)) / (s.maxP - s.minP)).toFixed(1);
  const out: string[] = [];

  out.push(`<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:520px;display:block">`);
  out.push(
    `<defs><pattern id="${s.id}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="${COLOR.grid}" stroke-width="0.5"/></pattern></defs>`,
  );
  out.push(`<rect width="${W}" height="${H}" fill="#131720"/>`);
  out.push(`<rect width="${W}" height="${H}" fill="url(#${s.id})"/>`);

  for (const p of s.yLabels) {
    out.push(`<text x="16" y="${y(p) + 3}" fill="${COLOR.axis}" font-size="10">${p}</text>`);
  }

  for (const t of s.trendlines ?? []) {
    const col = t.color ?? COLOR.trend;
    out.push(
      `<line x1="${t.x1}" y1="${y(t.p1)}" x2="${t.x2}" y2="${y(t.p2)}" stroke="${col}" stroke-width="1.8" stroke-dasharray="6,4"/>`,
    );
    if (t.label) {
      if (t.labelAt === "start") {
        out.push(
          `<text x="${t.x1 - 6}" y="${y(t.p1) - 6}" fill="${col}" font-size="11" text-anchor="end">${t.label}</text>`,
        );
      } else {
        out.push(
          `<text x="${t.x2 + 6}" y="${y(t.p2) + 4}" fill="${col}" font-size="11" font-weight="700">${t.label}</text>`,
        );
      }
    }
  }

  for (const lv of s.levels ?? []) {
    const yy = y(lv.p);
    out.push(
      `<line x1="${lv.x1}" y1="${yy}" x2="${lv.x2}" y2="${yy}" stroke="${lv.color}" stroke-width="1.6" stroke-dasharray="5,4"/>`,
    );
    if (lv.labelAt === "start") {
      out.push(
        `<text x="${lv.x1 + 4}" y="${yy - 5}" fill="${lv.color}" font-size="11" font-weight="700">${lv.label}</text>`,
      );
    } else {
      out.push(
        `<text x="${lv.x2 - 4}" y="${yy - 5}" fill="${lv.color}" font-size="11" font-weight="700" text-anchor="end">${lv.label}</text>`,
      );
    }
    if (lv.arrow) {
      out.push(
        `<polygon points="${lv.x2 + 14},${yy} ${lv.x2 + 4},${yy - 5} ${lv.x2 + 4},${yy + 5}" fill="${lv.color}"/>`,
      );
    }
  }

  for (const c of s.candles) {
    const col = COLOR[c.kind ?? (c.c >= c.o ? "bull" : "bear")];
    const top = y(Math.max(c.o, c.c));
    const bot = y(Math.min(c.o, c.c));
    const bh = Math.max(2, +(bot - top).toFixed(1));
    if (c.glow) {
      const glow = c.kind === "short" ? "rgba(239,83,80,0.35)" : "rgba(0,230,118,0.3)";
      out.push(
        `<rect x="${c.x - 9}" y="${top - 2}" width="18" height="${bh + 4}" fill="none" stroke="${glow}" stroke-width="3" rx="2"/>`,
      );
    }
    const bw = c.w ?? 14;
    out.push(
      `<line x1="${c.x}" y1="${y(c.h)}" x2="${c.x}" y2="${y(c.l)}" stroke="${col}" stroke-width="${bw > 20 ? 2.5 : 1.5}"/>`,
    );
    out.push(`<rect x="${c.x - bw / 2}" y="${top}" width="${bw}" height="${bh}" fill="${col}" rx="1.5"/>`);
  }

  for (const note of s.notes ?? []) {
    out.push(
      `<text x="${note.x}" y="${y(note.p) + 3}" fill="${note.color}" font-size="11" font-weight="600" text-anchor="${note.anchor ?? "middle"}">${note.text}</text>`,
    );
  }

  for (const m of s.marks ?? []) {
    const yy = y(m.p);
    if (m.dir === "up") {
      out.push(`<polygon points="${m.x},${yy - 15} ${m.x - 6},${yy - 1} ${m.x + 6},${yy - 1}" fill="${m.color}"/>`);
      out.push(`<text x="${m.x + 11}" y="${yy - 2}" fill="${m.color}" font-size="11" font-weight="700">${m.label}</text>`);
    } else {
      out.push(`<polygon points="${m.x},${yy + 15} ${m.x - 6},${yy + 1} ${m.x + 6},${yy + 1}" fill="${m.color}"/>`);
      out.push(`<text x="${m.x + 11}" y="${yy + 13}" fill="${m.color}" font-size="11" font-weight="700">${m.label}</text>`);
    }
  }

  const lb = s.label;
  out.push(`<rect x="${lb.x}" y="${lb.y}" width="${lb.w}" height="22" rx="4" fill="${lb.bg}"/>`);
  out.push(
    `<text x="${lb.x + lb.w / 2}" y="${lb.y + 15}" fill="${lb.color}" font-size="11" font-weight="700" text-anchor="middle">${lb.text}</text>`,
  );

  out.push(`</svg>`);
  return out.join("\n");
}

export const LEVEL = COLOR;
