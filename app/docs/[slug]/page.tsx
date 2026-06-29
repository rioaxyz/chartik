import Link from "next/link";
import { notFound } from "next/navigation";
import { DOCS, getDoc } from "@/lib/docs";
import DocView from "@/components/DocView";

export function generateStaticParams() {
  return DOCS.map((d) => ({ slug: d.slug }));
}

export default async function DocPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string }>;
}) {
  const { slug } = await params;
  const { v } = await searchParams;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const initialVariant = Number(v);

  return (
    <div className="docs-wrap">
      <div className="docs-topbar">
        <Link href="/docs" className="docs-back">
          ← All guides
        </Link>
        <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Learn</span>
      </div>
      <DocView
        doc={doc}
        initialVariant={Number.isFinite(initialVariant) ? initialVariant : 0}
      />
    </div>
  );
}
