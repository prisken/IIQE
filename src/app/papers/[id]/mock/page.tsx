import { MockExamLoader } from "@/components/MockExamLoader";
import { ReadingTopBar } from "@/components/ReadingTopBar";
import { getPaperMeta } from "@/lib/data";
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
  const meta = await getPaperMeta(paperId);

  return (
    <div className="shell reading-shell">
      <ReadingTopBar
        backHref={`/papers/${paperId}`}
        backLabel={`Paper ${paperId}`}
        title="模擬試"
      />
      <MockExamLoader meta={meta} resume={sp.resume === "1"} />
    </div>
  );
}
