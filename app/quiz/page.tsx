import QuizClient from "@/components/QuizClient";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  return <QuizClient topic={topic ?? "all"} />;
}
