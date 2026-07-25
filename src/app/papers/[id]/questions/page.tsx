import { QuestionBankLoader } from "@/components/QuestionBankLoader";
import { ReadingTopBar } from "@/components/ReadingTopBar";
import { getPaperMeta } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function QuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paperId = Number(id);
  if (![1, 2, 3, 4, 5].includes(paperId)) notFound();
  const meta = await getPaperMeta(paperId);

  return (
    <div className="shell reading-shell">
      <ReadingTopBar
        backHref={`/papers/${paperId}`}
        backLabel={`Paper ${paperId}`}
        title="題庫"
      />
      <QuestionBankLoader meta={meta} />
    </div>
  );
}
