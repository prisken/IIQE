import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { getPapers } from "@/lib/data";
import Link from "next/link";

export default async function HomePage() {
  const papers = await getPapers();

  return (
    <div className="shell" style={{ padding: "2rem 0 3rem" }}>
      <section className="rise" style={{ maxWidth: 720, marginBottom: "1.5rem" }}>
        <p style={{ color: "var(--sea)", fontWeight: 600, marginBottom: "0.6rem" }}>保險中介人資格考試</p>
        <h1 className="display" style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", lineHeight: 1.1, margin: 0 }}>
          IIQE Prep
        </h1>
        <p style={{ fontSize: "1.1rem", lineHeight: 1.7, marginTop: "1rem", maxWidth: 560 }}>
          五份試卷的研習手冊、高密度天書、分章題庫與按官方比重抽題的模擬試——自由進出，一次備齊。
        </p>
      </section>

      <section
        className="rise rise-delay-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1rem",
        }}
      >
        {papers.map((p) => (
          <Link
            key={p.id}
            href={`/papers/${p.id}`}
            className="panel"
            style={{ padding: "1.35rem 1.4rem", display: "block" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.7rem" }}>
              <span style={{ fontWeight: 700, color: "var(--sea)" }}>{p.code}</span>
              <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                {p.exam.count} 題 · {p.exam.minutes} 分
              </span>
            </div>
            <h2 className="display" style={{ fontSize: "1.45rem", margin: "0 0 0.35rem" }}>
              {p.titleZh}
            </h2>
            <p style={{ margin: 0, opacity: 0.72, fontSize: "0.92rem" }}>{p.titleEn}</p>
            <p style={{ margin: "1rem 0 0", fontSize: "0.88rem", color: "var(--ink-soft)" }}>
              題庫 {p.stats.questions} · 合格 {p.exam.passPercent}%
            </p>
          </Link>
        ))}
      </section>

      <section className="panel rise rise-delay-2" style={{ marginTop: "1.5rem", padding: "1.25rem 1.4rem" }}>
        <h3 className="display" style={{ margin: "0 0 0.6rem", fontSize: "1.2rem" }}>
          每份試卷三個主區
        </h3>
        <ol style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.8 }}>
          <li>
            <strong>研習</strong> — 完整手冊與高密度天書分章閱讀；天書重點可跳回手冊細讀
          </li>
          <li>
            <strong>題庫</strong> — 按章節練習，答案預設遮罩，按需揭曉
          </li>
          <li>
            <strong>模擬試</strong> — 依官方章節比重隨機抽題、避重複相似題、計時與成績檢討
          </li>
        </ol>
      </section>

      <div style={{ marginTop: "1.75rem" }}>
        <DisclaimerBanner variant="full" />
      </div>
    </div>
  );
}
