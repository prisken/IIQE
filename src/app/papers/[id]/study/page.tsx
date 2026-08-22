import { ReadingTopBar } from "@/components/ReadingTopBar";
import { StudyViewer } from "@/components/StudyViewer";
import { getGuide, getManual, getPaperMeta } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function StudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    mode?: string;
    chapter?: string;
    ch?: string;
    section?: string;
    from?: string;
  }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const paperId = Number(id);
  if (![1, 2, 3, 4, 5].includes(paperId)) notFound();

  const [meta, manual, guide] = await Promise.all([
    getPaperMeta(paperId),
    getManual(paperId),
    getGuide(paperId),
  ]);

  // Accept both ?ch=3 (canonical) and ?chapter=3 (legacy).
  const chapterParam = sp.ch ?? sp.chapter;
  const fromQuestions = sp.from === "questions";
  const fromMock = sp.from === "mock";
  const returnHref = fromQuestions
    ? `/papers/${paperId}/questions`
    : fromMock
      ? `/papers/${paperId}/mock?resume=1`
      : `/papers/${paperId}`;
  const returnLabel = fromQuestions
    ? "返回題庫練習"
    : fromMock
      ? "返回模擬試結果"
      : `Paper ${paperId}`;

  return (
    <div className="shell reading-shell">
      <ReadingTopBar
        backHref={returnHref}
        backLabel={returnLabel}
        title={meta.titleZh}
        secondaryHref={fromQuestions || fromMock ? `/papers/${paperId}` : undefined}
        secondaryLabel={fromQuestions || fromMock ? `Paper ${paperId}` : undefined}
      />
      <StudyViewer
        paperId={paperId}
        manual={manual}
        guide={guide}
        initialMode={sp.mode === "guide" ? "guide" : "manual"}
        initialChapter={chapterParam}
        initialSection={sp.section}
      />
    </div>
  );
}
