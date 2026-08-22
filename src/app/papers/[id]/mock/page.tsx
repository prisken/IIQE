import { MockExam } from "@/components/MockExam";
import { ReadingTopBar } from "@/components/ReadingTopBar";
import { getPaperMeta, getQuestions, getManual } from "@/lib/data";
import { filterValidQuestions } from "@/lib/questions";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const paperId = Number(id);
  if (![1, 2, 3, 4, 5].includes(paperId)) return {};
  const meta = await getPaperMeta(paperId);
  return {
    title: `${meta.titleZh} 模擬試｜${meta.exam.count} 題 · ${meta.exam.minutes} 分鐘 · 合格 ${meta.exam.passPercent}% | Hub Cards`,
    description: `免費 ${meta.titleZh}（${meta.titleEn}）模擬試：按官方章節比重隨機抽題、計時、即時批改與弱項分析。`,  
  };
}

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
