"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CandlestickChart from "./CandlestickChart";
import Logo from "./Logo";
import { docLinkFor } from "@/lib/docLinks";
import { Question, TOPIC_LABELS, Topic } from "@/lib/types";

interface Props {
  topic: string;
}

type Status = "loading" | "playing" | "done" | "error";

export default function QuizClient({ topic }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetch(`/api/quiz?topic=${encodeURIComponent(topic)}&shuffle=1`)
      .then((r) => r.json())
      .then((data) => {
        if (!active) return;
        if (!data.questions?.length) {
          setStatus("error");
          return;
        }
        setQuestions(data.questions);
        setStatus("playing");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, [topic]);

  const current = questions[index];

  function handleSelect(choiceId: string) {
    if (selected) return; // lock after first answer
    setSelected(choiceId);
    const correct = choiceId === current.answerId;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, correct]);
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      setStatus("done");
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAnswers([]);
    setStatus("loading");
    // refetch to reshuffle
    fetch(`/api/quiz?topic=${encodeURIComponent(topic)}&shuffle=1`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions);
        setStatus("playing");
      })
      .catch(() => setStatus("error"));
  }

  if (status === "loading") {
    return (
      <Shell topic={topic}>
        <div className="flex h-64 items-center justify-center text-slate-400">
          Loading questions…
        </div>
      </Shell>
    );
  }

  if (status === "error") {
    return (
      <Shell topic={topic}>
        <div className="rounded-xl border border-border bg-panel p-8 text-center">
          <p className="text-slate-300">No questions available for this topic.</p>
          <Link href="/" className="mt-4 inline-block text-accent">
            ← Back home
          </Link>
        </div>
      </Shell>
    );
  }

  if (status === "done") {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <Shell topic={topic}>
        <div className="rounded-2xl border border-border bg-panel p-8 text-center">
          <p className="text-sm uppercase tracking-wide text-slate-400">
            Your score
          </p>
          <p className="mt-2 text-5xl font-bold">
            {score}
            <span className="text-slate-500">/{questions.length}</span>
          </p>
          <p
            className={`mt-2 text-lg font-semibold ${
              pct >= 70 ? "text-bull" : pct >= 40 ? "text-neutral" : "text-bear"
            }`}
          >
            {pct}% —{" "}
            {pct >= 70
              ? "Sharp eye! 📈"
              : pct >= 40
                ? "Getting there 👀"
                : "Keep training 💪"}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-1.5">
            {answers.map((ok, i) => (
              <span
                key={i}
                title={`Q${i + 1}: ${ok ? "correct" : "wrong"}`}
                className={`h-3 w-6 rounded-sm ${ok ? "bg-bull" : "bg-bear"}`}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={restart}
              className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-bg transition hover:brightness-110"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-xl border border-border px-5 py-2.5 font-semibold text-slate-300 transition hover:bg-panelLight"
            >
              Home
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  // status === "playing"
  const answered = selected !== null;
  const progress = ((index + (answered ? 1 : 0)) / questions.length) * 100;
  const isMarkerQ = !!current.markers?.length;
  const docLink = docLinkFor(current.id);

  return (
    <Shell topic={topic}>
      {/* progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400">
          <span>
            Question {index + 1} of {questions.length}
          </span>
          <span>Score: {score}</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-panelLight">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel p-5 sm:p-6">
        <div className="rounded-xl bg-bg/60 p-3">
          <CandlestickChart
            candles={current.candles}
            markers={current.markers}
            revealCorrect={answered ? current.answerId : null}
            revealPicked={answered ? selected : null}
          />
        </div>

        <h2 className="mt-5 text-lg font-semibold">{current.prompt}</h2>

        {isMarkerQ ? (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {current.choices.map((choice) => {
              const isAnswer = choice.id === current.answerId;
              const isPicked = choice.id === selected;

              let cls =
                "border-border bg-panelLight text-slate-200 hover:border-accent hover:bg-[#1f2a40]";
              if (answered) {
                if (isAnswer) cls = "border-bull bg-bull/15 text-white";
                else if (isPicked) cls = "border-bear bg-bear/15 text-white";
                else cls = "border-border bg-panelLight text-slate-400 opacity-60";
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelect(choice.id)}
                  disabled={answered}
                  aria-label={`Choice ${choice.label}`}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border text-lg font-bold transition ${cls}`}
                >
                  {choice.label}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 grid gap-2.5">
            {current.choices.map((choice) => {
              const isAnswer = choice.id === current.answerId;
              const isPicked = choice.id === selected;

              let cls =
                "border-border bg-panelLight hover:border-accent hover:bg-[#1f2a40]";
              if (answered) {
                if (isAnswer) cls = "border-bull bg-bull/15 text-white";
                else if (isPicked) cls = "border-bear bg-bear/15 text-white";
                else cls = "border-border bg-panelLight opacity-60";
              }

              return (
                <button
                  key={choice.id}
                  onClick={() => handleSelect(choice.id)}
                  disabled={answered}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
                >
                  <span>{choice.label}</span>
                  {answered && isAnswer && <span className="text-bull">✓</span>}
                  {answered && isPicked && !isAnswer && (
                    <span className="text-bear">✗</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {answered && (
          <div className="mt-4 rounded-xl border border-border bg-bg/60 p-4">
            <p
              className={`text-sm font-semibold ${
                selected === current.answerId ? "text-bull" : "text-bear"
              }`}
            >
              {selected === current.answerId ? "Correct!" : "Not quite."}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
              {current.explanation}
            </p>
            {docLink && (
              <Link
                href={`/docs/${docLink.slug}${
                  docLink.v != null ? `?v=${docLink.v}` : ""
                }`}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
              >
                📖 Learn more about {docLink.label} →
              </Link>
            )}
            <div className="mt-4">
              <button
                onClick={handleNext}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:brightness-110"
              >
                {index + 1 >= questions.length ? "See results →" : "Next question →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}

function Shell({
  topic,
  children,
}: {
  topic: string;
  children: React.ReactNode;
}) {
  const label =
    topic === "all" ? "Full Quiz" : TOPIC_LABELS[topic as Topic] ?? "Quiz";
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-accent"
        >
          <span className="text-sm">←</span>
          <Logo className="text-sm" />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="text-xs text-slate-400 hover:text-accent"
          >
            📚 Learn
          </Link>
          <span className="rounded-full border border-border bg-panel px-3 py-1 text-xs text-slate-300">
            {label}
          </span>
        </div>
      </div>
      {children}
    </main>
  );
}
