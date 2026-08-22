import { QuestionBank } from "@/components/QuestionBank";
import { ReadingTopBar } from "@/components/ReadingTopBar";
import { getPaperMeta, getQuestions, getManual } from "@/lib/data";
import { filterValidQuestions } from "@/lib/questions";
import { notFound } from "next/navigation";

export default async function QuestionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paperId = Number(id);
  if (![1, 2, 3, 4, 5].includes(paperId)) notFound();

  // Server-side data load — first question paints with the page, no loader.
  const [meta, rawQuestions, manual] = await Promise.all([
    getPaperMeta(paperId),
    getQuestions(paperId),
    getManual(paperId),
  ]);
  const { valid: questions, rejected } = filterValidQuestions(rawQuestions);
  const rejectedCount = rejected.length;

  return (
    <div className="shell reading-shell">
      <ReadingTopBar
        backHref={`/papers/${paperId}`}
        backLabel={`Paper ${paperId}`}
        title="題庫"
      />
      {!questions.length ? (
        <p className="panel" style={{ padding: "1.2rem", color: "var(--bad)" }}>
          沒有可顯示的有效題目（選項須為完整 A–D）。
        </p>
      ) : (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {rejectedCount > 0 && (
            <p
              className="panel"
              style={{
                padding: "0.75rem 1rem",
                margin: 0,
                fontSize: "0.9rem",
                color: "var(--bad)",
                background: "rgba(163,59,43,0.08)",
              }}
            >
              已自動略過 {rejectedCount} 道資料異常題目，其餘 {questions.length} 題可正常練習。
            </p>
          )}
          <QuestionBank meta={meta} questions={questions} manual={manual} />
        </div>
      )}
    </div>
  );
}
