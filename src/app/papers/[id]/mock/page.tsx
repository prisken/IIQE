import { MockExam } from "@/components/MockExam";
import { ReadingTopBar } from "@/components/ReadingTopBar";
import { getPaperMeta, getQuestions, getManual } from "@/lib/data";
import { filterValidQuestions } from "@/lib/questions";
import { notFound } from "next/navigation";

export default async function MockPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ resume?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const paperId = Number(id);
  if (![1, 2, 3, 4, 5].includes(paperId)) notFound();

  // Server-side data load — no "準備模擬試題庫…" loader.
  const [meta, rawQuestions, manual] = await Promise.all([
    getPaperMeta(paperId),
    getQuestions(paperId),
    getManual(paperId),
  ]);
  const { valid: bank } = filterValidQuestions(rawQuestions);

  return (
    <div className="shell reading-shell">
      <ReadingTopBar
        backHref={`/papers/${paperId}`}
        backLabel={`Paper ${paperId}`}
        title="模擬試"
      />
      <MockExam meta={meta} bank={bank} manual={manual} resume={sp.resume === "1"} />
    </div>
  );
}
