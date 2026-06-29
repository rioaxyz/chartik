"use client";

import { useState } from "react";
import { Doc } from "@/lib/docs";

/** Renders a single pattern guide: header, tabs, annotated chart, cards, rules. */
export default function DocView({
  doc,
  initialVariant = 0,
}: {
  doc: Doc;
  initialVariant?: number;
}) {
  const [active, setActive] = useState(() =>
    Math.min(Math.max(0, initialVariant), doc.variants.length - 1),
  );
  const v = doc.variants[active];

  return (
    <>
      <header className="docs-head">
        <h1>{doc.title}</h1>
        <p>{doc.subtitle}</p>
      </header>

      {doc.variants.length > 1 && (
        <div className="docs-tabs">
          {doc.variants.map((variant, i) => (
            <button
              key={variant.name}
              className={`docs-tab${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
            >
              {variant.name}
            </button>
          ))}
        </div>
      )}

      <div
        className="chart-wrap"
        dangerouslySetInnerHTML={{ __html: v.chart }}
      />

      <div className="cards">
        {v.cards.map((c) => (
          <div key={c.label} className={`card ${c.kind}`}>
            <div className="card-label">
              {c.icon} {c.label}
            </div>
            <div className="card-value">{c.value}</div>
            <div
              className="card-desc"
              dangerouslySetInnerHTML={{ __html: c.desc }}
            />
          </div>
        ))}
      </div>

      <div className="rules">
        <h3>{v.rulesTitle}</h3>
        {v.rules.map((r, i) => (
          <div className="rule" key={i}>
            <span className="rule-num">{String(i + 1).padStart(2, "0")}</span>
            <span dangerouslySetInnerHTML={{ __html: r }} />
          </div>
        ))}
      </div>

      <p className="docs-disclaimer">
        For educational purposes only. Not financial advice. Always manage risk
        with position sizing and never risk more than you can afford to lose.
      </p>
    </>
  );
}
