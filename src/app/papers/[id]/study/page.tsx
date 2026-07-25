import { ReadingTopBar } from "@/components/ReadingTopBar";
import { StudyViewer } from "@/components/StudyViewer";
import { getGuide, getManual, getPaperMeta } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function StudyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ mode?: string; chapter?: string; section?: string }>;
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

  return (
    <div className="shell reading-shell">
      <ReadingTopBar
        backHref={`/papers/${paperId}`}
        backLabel={`Paper ${paperId}`}
        title={meta.titleZh}
      />
      <StudyViewer
        paperId={paperId}
        manual={manual}
        guide={guide}
        initialMode={sp.mode === "guide" ? "guide" : "manual"}
        initialChapter={sp.chapter}
        initialSection={sp.section}
      />
    </div>
  );
}
