/**
 * The Chartik wordmark: "Chart" + a candlestick standing in for the "i" + "k".
 * The candle scales with the surrounding font-size (sized in `em`) and sits on
 * the text baseline, so the component works at any size. The letters inherit
 * `currentColor`; the candle keeps its fixed brand colors.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Chartik"
      className={`inline-flex items-end font-bold leading-none tracking-tight ${className}`}
    >
      <span aria-hidden="true">Chart</span>
      <svg
        viewBox="0 0 10 28"
        aria-hidden="true"
        style={{ height: "1em", width: "0.36em", margin: "0 0.03em" }}
      >
        {/* tittle (the dot of the i) */}
        <rect x="3.4" y="0" width="3.2" height="3.6" rx="0.9" fill="#7c6af7" />
        {/* wick */}
        <line x1="5" y1="6" x2="5" y2="27" stroke="#26a69a" strokeWidth="2" />
        {/* body */}
        <rect x="1.8" y="10" width="6.4" height="13" rx="1" fill="#26a69a" />
      </svg>
      <span aria-hidden="true">k</span>
    </span>
  );
}
