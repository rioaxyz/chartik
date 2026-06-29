/**
 * Maps a quiz question id to the most relevant docs guide (and the exact
 * variant/tab within it), so the answer feedback can deep-link to
 * "Learn more about this pattern".
 *
 * Kept dependency-free (no DOCS import) so it doesn't pull the docs' SVG
 * content into the quiz client bundle. The mapping is keyword-based on the
 * question id, so new questions following the same naming auto-link.
 *
 * `v` is the 0-based index of the variant tab in the guide (see lib/docs.ts);
 * omit it (undefined) when there is no exact-matching variant.
 */
export interface DocLink {
  slug: string;
  label: string;
  v?: number;
}

const CB_VARIANT: Record<string, number> = {
  "cb-3": 0, // doji
  "cb-4": 0, // spinning top → covered in the doji guide
  "cb-5": 1, // hammer
  "cb-6": 2, // shooting star
  "cb-7": 3, // bullish marubozu
  "cb-8": 3, // bearish marubozu
};

export function docLinkFor(id: string): DocLink | undefined {
  const has = (s: string) => id.includes(s);

  if (id.startsWith("cb-"))
    return { slug: "single-candles", label: "single candlesticks", v: CB_VARIANT[id] };
  if (id === "pt-1") return { slug: "two-candle-patterns", label: "two-candle patterns", v: 0 };
  if (id === "pt-2") return { slug: "two-candle-patterns", label: "two-candle patterns", v: 1 };
  if (id === "pt-3") return { slug: "three-candle-patterns", label: "three-candle patterns", v: 2 };
  if (id === "pt-4") return { slug: "three-candle-patterns", label: "three-candle patterns", v: 0 };

  if (has("pennant"))
    return { slug: "pennant-patterns", label: "pennants", v: has("bear") ? 1 : has("bull") ? 0 : undefined };
  if (has("wedge"))
    return { slug: "wedge-patterns", label: "wedges", v: has("fall") ? 1 : has("ris") ? 0 : undefined };
  if (has("flag"))
    return { slug: "flag-patterns", label: "flags", v: has("bear") ? 1 : has("bull") ? 0 : undefined };
  if (has("hns"))
    return { slug: "head-and-shoulders", label: "head & shoulders", v: has("inv") ? 1 : 0 };
  if (has("triple"))
    return { slug: "triple-tops-bottoms", label: "triple tops & bottoms", v: has("bottom") ? 1 : 0 };
  if (has("double") || has("dbl"))
    return { slug: "double-tops-bottoms", label: "double tops & bottoms", v: has("bottom") ? 1 : has("top") ? 0 : undefined };
  if (has("cup") || has("rounding"))
    return { slug: "cup-and-handle", label: "cup & handle", v: has("rounding") ? 1 : has("cup") ? 0 : undefined };
  if (has("tri") || has("asc") || has("desc") || has("sym"))
    return { slug: "triangle-patterns", label: "triangles", v: has("desc") ? 1 : has("asc") ? 0 : undefined };

  return undefined;
}
