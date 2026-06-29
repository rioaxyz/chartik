import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chartik — Learn",
  description:
    "Visual guides to candlestick and chart patterns: entries, stop losses, and targets.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="docs-scope">
      {/* The docs section uses Space Grotesk / Space Mono, loaded here so it
          stays scoped to /docs without affecting the mint quiz theme. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
