import { Drill } from "@/components/Drill";
import { ReadingTopBar } from "@/components/ReadingTopBar";
import { getPaperMeta, getQuestions, getManual } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function DrillPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ch?: string; n?: string; seed?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const paperId = Number(id);
  if (![1, 2, 3, 4, 5].includes(paperId)) notFound();

  const [meta, bank, manual] = await Promise.all([
    getPaperMeta(paperId),
    getQuestions(paperId),
    getManual(paperId),
  ]);

  const count = Math.min(Math.max(Number(sp.n) || 10, 1), 20);
  const seed = Number(sp.seed) || undefined;
  const chapter = sp.ch && /^\d+$/.test(sp.ch) ? sp.ch : null;

  return (
    <div className="shell reading-shell">
      <ReadingTopBar
        backHref={`/papers/${paperId}`}
        backLabel={`Paper ${paperId}`}
        title="10 題快測"
      />
      <Drill
        meta={meta}
        bank={bank}
        manual={manual}
        initialChapter={chapter}
        initialCount={count}
        initialSeed={seed}
      />
    </div>
  );
}
