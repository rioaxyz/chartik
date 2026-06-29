import Link from "next/link";
import { DOCS } from "@/lib/docs";

export default function DocsIndex() {
  return (
    <div className="docs-wrap">
      <div className="docs-topbar">
        <Link href="/" className="docs-back">
          ← Chartik
        </Link>
        <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Learn</span>
      </div>

      <header className="docs-head">
        <h1>Learn the Patterns</h1>
        <p>
          Visual guides to candlestick &amp; chart patterns — where to enter,
          where to set stops, and how to project targets.
        </p>
      </header>

      {DOCS.length === 0 ? (
        <p className="docs-empty">More guides coming soon.</p>
      ) : (
        <div className="docs-grid">
          {DOCS.map((d) => (
            <Link key={d.slug} href={`/docs/${d.slug}`} className="doc-card">
              <div className="doc-icon">{d.icon}</div>
              <h2>{d.title}</h2>
              <p>{d.blurb}</p>
              <div className="doc-go">Read guide →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
