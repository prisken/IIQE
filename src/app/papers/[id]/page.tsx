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

  const needed = Math.ceil((meta.exam.count * meta.exam.passPercent) / 100);

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
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={`panel${i === 0 ? " panel-gold-top" : ""}`}
            style={{ padding: "1.35rem", display: "block" }}
          >
            <h2 className="display" style={{ margin: "0 0 0.5rem", fontSize: "1.5rem" }}>
              {i === 0 ? "① " : i === 1 ? "② " : "③ "}
              {l.title}
            </h2>
            <p style={{ margin: 0, lineHeight: 1.65, opacity: 0.8 }}>{l.desc}</p>
          </Link>
        ))}
      </div>
      <p style={{ margin: "0.65rem 0 0", fontSize: "0.85rem", opacity: 0.65 }}>
        建議路線：先研習 → 再操題庫 → 最後模擬試，跟官方比重驗收。
      </p>

      <div className="panel" style={{ marginTop: "1rem", padding: "1.1rem 1.3rem" }}>
        <h3 className="display" style={{ marginTop: 0, fontSize: "1.15rem" }}>
          未讀過？先測 10 題，知自己企喺邊。
        </h3>
        <p style={{ margin: "0 0 0.8rem", lineHeight: 1.65, opacity: 0.8 }}>
          Paper {meta.id}：{meta.exam.count} 題 · {meta.exam.minutes} 分鐘 · 合格{" "}
          {meta.exam.passPercent}%（需 {needed} 題）。唔使溫完先開始 — 直接去題庫試 10 題，
          即時知道自己邊章最弱。
        </p>
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          <Link href={`/papers/${paperId}/drill?n=10`} className="btn btn-primary" style={{ fontSize: "0.95rem" }}>
            而家測 10 題 →
          </Link>
        </div>
      </div>

      <div className="panel" style={{ marginTop: "1rem", padding: "1.1rem 1.3rem" }}>
        <h3 className="display" style={{ marginTop: 0, fontSize: "1.15rem" }}>
          考試章節比重
        </h3>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", lineHeight: 1.8 }}>
          {meta.weights.map((w) => (
            <li
              key={w.id}
              style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline", padding: "0.28rem 0", borderBottom: "1px solid var(--line)" }}
            >
              <span>
                Ch{w.id} {w.titleZh}
              </span>
              <span
                className="stat-num"
                style={{
                  flexShrink: 0,
                  padding: "0.1rem 0.6rem",
                  borderRadius: 999,
                  background: "rgba(212, 175, 55, 0.14)",
                  color: "var(--amber)",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                {w.weight}%
              </span>
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
