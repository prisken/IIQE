import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { getPaperMeta } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PaperHubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paperId = Number(id);
  if (![1, 2, 3, 4, 5].includes(paperId)) notFound();
  const meta = await getPaperMeta(paperId);

  const links = [
    {
      href: `/papers/${paperId}/study`,
      title: "研習",
      desc: "研習手冊與高密度天書分章閱讀，天書重點可跳回手冊細讀。",
    },
    {
      href: `/papers/${paperId}/questions`,
      title: "題庫",
      desc: `按章節練習 ${meta.stats.questions} 題，答案預設遮罩，按需揭曉。`,
    },
    {
      href: `/papers/${paperId}/mock`,
      title: "模擬試",
      desc: `${meta.exam.count} 題 · ${meta.exam.minutes} 分鐘 · 合格 ${meta.exam.passPercent}% · 依比重隨機抽題。`,
    },
  ];

  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem" }}>
      <p style={{ margin: 0 }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 全部試卷
        </Link>
      </p>
      <h1 className="display" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", margin: "0.6rem 0 0.3rem" }}>
        Paper {meta.id} · {meta.titleZh}
      </h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>{meta.titleEn}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
          marginTop: "1.25rem",
        }}
      >
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="panel" style={{ padding: "1.35rem", display: "block" }}>
            <h2 className="display" style={{ margin: "0 0 0.5rem", fontSize: "1.5rem" }}>
              {l.title}
            </h2>
            <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.8 }}>{l.desc}</p>
          </Link>
        ))}
      </div>

      <div className="panel" style={{ marginTop: "1rem", padding: "1.1rem 1.3rem" }}>
        <h3 className="display" style={{ marginTop: 0, fontSize: "1.15rem" }}>
          考試章節比重
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.8 }}>
          {meta.weights.map((w) => (
            <li key={w.id}>
              Ch{w.id} {w.titleZh} — {w.weight}%
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <DisclaimerBanner variant="compact" />
      </div>
    </div>
  );
}
