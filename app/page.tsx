import Link from "next/link";
import Logo from "@/components/Logo";
import { QUESTIONS } from "@/lib/questions";
import { TOPIC_LABELS, Topic } from "@/lib/types";

const TOPIC_META: { topic: Topic; blurb: string; emoji: string }[] = [
  {
    topic: "candle-basics",
    blurb: "Name the candle type: bullish, bearish, doji, hammer & more.",
    emoji: "🕯️",
  },
  {
    topic: "next-move",
    blurb: "Read trends, flags, triangles & wedges — predict the next move.",
    emoji: "📈",
  },
  {
    topic: "pattern",
    blurb: "Spot engulfings, stars, and three-soldier formations.",
    emoji: "🔍",
  },
  {
    topic: "chart-patterns",
    blurb: "Cup & handle, double tops, head & shoulders, triangles, wedges, flags.",
    emoji: "📐",
  },
  {
    topic: "buy-sell",
    blurb: "Pick where to buy, sell, or set a stop loss on real setups.",
    emoji: "🎯",
  },
];

function countByTopic(topic: Topic): number {
  return QUESTIONS.filter((q) => q.topic === topic).length;
}

export default function Home() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14">
      <header className="text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-panel px-3 py-1 text-xs text-accent">
          <span className="h-2 w-2 rounded-full bg-bull" /> Get chart-literate.
        </div>
        <h1 className="text-white">
          <Logo className="text-4xl sm:text-5xl" />
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-balance text-base text-slate-400">
          Train your eye for the markets. Read real candlestick visuals and
          answer multiple-choice questions on candle direction, chart patterns,
          and where momentum is heading.
        </p>
      </header>

      <section className="mt-12 grid gap-4 sm:grid-cols-2">
        {TOPIC_META.map((t) => (
          <Link
            key={t.topic}
            href={`/quiz?topic=${t.topic}`}
            className="group rounded-2xl border border-border bg-panel p-5 transition hover:border-accent hover:bg-panelLight"
          >
            <div className="text-3xl">{t.emoji}</div>
            <h2 className="mt-3 text-lg font-semibold">
              {TOPIC_LABELS[t.topic]}
            </h2>
            <p className="mt-1 text-sm text-slate-400">{t.blurb}</p>
            <p className="mt-4 text-xs font-medium text-accent">
              {countByTopic(t.topic)} questions →
            </p>
          </Link>
        ))}
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/quiz?topic=all"
          className="inline-block rounded-xl bg-accent px-6 py-3 font-semibold text-bg transition hover:brightness-110"
        >
          Take the full quiz →
        </Link>
        <p className="mt-3 text-xs text-slate-500">
          {QUESTIONS.length} questions across all topics
        </p>
      </div>
    </main>
  );
}
