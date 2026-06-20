import { NextRequest, NextResponse } from "next/server";
import { getQuestions } from "@/lib/questions";

/**
 * GET /api/quiz?topic=candle-basics|next-move|pattern|all&limit=10&shuffle=1
 *
 * Returns quiz questions (including the answer + explanation). This is the
 * backend that the quiz UI fetches from; on Vercel it runs as a serverless
 * function. Kept simple and stateless so it scales trivially.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get("topic") ?? "all";
  const limit = Number(searchParams.get("limit") ?? "0");
  const shuffle = searchParams.get("shuffle") === "1";

  let questions = getQuestions(topic);

  if (shuffle) {
    questions = [...questions].sort(() => Math.random() - 0.5);
  }
  if (limit > 0) {
    questions = questions.slice(0, limit);
  }

  return NextResponse.json({ count: questions.length, questions });
}
