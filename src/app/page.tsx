import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { getPapers } from "@/lib/data";
import Link from "next/link";

export default async function HomePage() {
  const papers = await getPapers();
  const totalQuestions = papers.reduce((n, p) => n + p.stats.questions, 0);

  return (
    <div className="shell" style={{ padding: "2rem 0 3rem" }}>
      {/* Hero — the promise in one line */}
      <section className="rise" style={{ maxWidth: 760, marginBottom: "1.6rem" }}>
        <p
          style={{
            color: "var(--amber)",
            fontWeight: 700,
            marginBottom: "0.6rem",
            letterSpacing: "0.14em",
            fontSize: "0.85rem",
            textTransform: "uppercase",
          }}
        >
          保險中介人資格考試 · 考牌一條路入行
        </p>
        <h1
          className="display"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", lineHeight: 1.12, margin: 0, color: "var(--sea)" }}
        >
          溫書 → 操題 → 模擬試。
          <br />
          考過 IIQE，就係入行第一步。
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7, marginTop: "1rem", maxWidth: 580 }}>
          五份試卷的研習手冊、高密度天書、分章題庫與按官方比重抽題的模擬試——自由進出，一次備齊。
          每份試卷一條龍：<strong>研習</strong> → <strong>題庫</strong> → <strong>模擬試</strong>。
        </p>
        <div style={{ display: "flex", gap: "0.7rem", marginTop: "1.3rem", flexWrap: "wrap" }}>
          <Link href="/papers/1" className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.8rem 1.4rem" }}>
            開始研習 — Paper 1
          </Link>
          <Link href="/recruit" className="btn btn-amber" style={{ fontSize: "1rem", padding: "0.8rem 1.4rem" }}>
            考完點算？入行 →
          </Link>
        </div>
      </section>

      {/* The 3-step strip — clarity: what can I do here */}
      <section
        className="rise rise-delay-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "0.9rem",
          marginBottom: "1.6rem",
        }}
      >
        {[
          { n: "1", t: "研習", d: "完整手冊 + 高密度天書，分章閱讀", to: "/papers/1/study" },
          { n: "2", t: "題庫", d: "按章節操題，答案遮罩、按需揭曉", to: "/papers/1/questions" },
          { n: "3", t: "模擬試", d: "官方比重隨機抽題、計時、成績檢討", to: "/papers/1/mock" },
        ].map((s) => (
          <Link key={s.n} href={s.to} className="panel" style={{ padding: "1.05rem 1.15rem", display: "block" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span
                className="stat-num"
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  background: "var(--amber-bright)",
                  color: "var(--sea-deep)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {s.n}
              </span>
              <h2 className="display" style={{ margin: 0, fontSize: "1.2rem", color: "var(--sea)" }}>
                {s.t}
              </h2>
            </div>
            <p style={{ margin: "0.6rem 0 0", fontSize: "0.9rem", lineHeight: 1.6, opacity: 0.78 }}>{s.d}</p>
          </Link>
        ))}
      </section>

      {/* Paper grid — the five doors */}
      <h2 className="display" style={{ fontSize: "1.3rem", margin: "0 0 0.8rem", color: "var(--sea)" }}>
        五份試卷 — 揀你嗰份
      </h2>
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
              <span className="stat-num" style={{ fontWeight: 700, color: "var(--amber)", fontSize: "1.05rem" }}>
                {p.code}
              </span>
              <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                <span className="stat-num">{p.exam.count}</span> 題 · <span className="stat-num">{p.exam.minutes}</span> 分
              </span>
            </div>
            <h3 className="display" style={{ fontSize: "1.4rem", margin: "0 0 0.35rem", color: "var(--sea)" }}>
              {p.titleZh}
            </h3>
            <p style={{ margin: 0, opacity: 0.72, fontSize: "0.92rem" }}>{p.titleEn}</p>
            <p style={{ margin: "1rem 0 0", fontSize: "0.88rem", color: "var(--ink-soft)" }}>
              題庫 <span className="stat-num">{p.stats.questions}</span> · 合格{" "}
              <span className="stat-num">{p.exam.passPercent}%</span> ·{" "}
              <span style={{ color: "var(--amber)", fontWeight: 600 }}>開始 →</span>
            </p>
          </Link>
        ))}
      </section>

      {/* The funnel band — what happens after you pass */}
      <section
        className="panel rise rise-delay-2"
        style={{
          marginTop: "1.5rem",
          padding: "1.75rem 1.75rem",
          background: "var(--sea)",
          color: "#e8eef5",
          borderColor: "rgba(255, 215, 0, 0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h3 className="display" style={{ margin: "0 0 0.4rem", fontSize: "1.3rem", color: "#ffffff" }}>
              考牌唔係終點 — 係入行嘅第一張飛。🎫
            </h3>
            <p style={{ margin: 0, opacity: 0.85, maxWidth: 640, lineHeight: 1.6 }}>
              我哋幫你俾 IIQE 考試費（HK$195 起）——加入團隊、有 mentor 陪你溫、操題、考牌，
              然後正式入行。LEARN • TEST • EARN。
            </p>
          </div>
          <Link
            href="/recruit"
            className="btn btn-amber"
            style={{ fontSize: "1rem", padding: "0.8rem 1.4rem", whiteSpace: "nowrap" }}
          >
            想知點入行？DM「READY」
          </Link>
        </div>
      </section>

      <div style={{ marginTop: "1.75rem" }}>
        <DisclaimerBanner variant="full" />
      </div>
    </div>
  );
}
