import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { getPapers } from "@/lib/data";
import { FEE_TERMS_CONFIRMED, OWNER_IDENTITY_READY, OWNER } from "@/lib/owner";
import Link from "next/link";

export default async function HomePage() {
  const papers = await getPapers();

  return (
    <div className="shell" style={{ padding: "2.5rem 0 3rem" }}>
      {/* Hero — what this is / who you are / what you will not do, in one glance */}
      <section className="rise" style={{ maxWidth: 760, marginBottom: "1.8rem" }}>
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
          保險中介人資格考試（IIQE）· 免費備試 · 同 VTC / PEAK / 保監局無關
        </p>
        <h1
          className="display"
          style={{ fontSize: "clamp(2.1rem, 5vw, 3.2rem)", lineHeight: 1.12, margin: 0, color: "var(--sea)" }}
        >
          免費研習、題庫、模擬試。
          <br />
          入行係可選，唔係入場費。
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7, marginTop: "1rem", maxWidth: 580 }}>
          五份 IIQE 試卷：研習手冊、分章題庫、按官方比重抽題嘅模擬試。
          全部免費。唔加入都可以用。我唔會因為你話唔入行而收走工具。
        </p>
        <div className="cta-stack-mobile" style={{ display: "flex", gap: "0.7rem", marginTop: "1.3rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/papers/1/drill?ch=3&n=10" className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.8rem 1.4rem" }}>
            而家做 Paper 1 · 10 題
          </Link>
          {FEE_TERMS_CONFIRMED ? (
            <Link href="/exam-fee" style={{ color: "var(--amber)", fontWeight: 600, fontSize: "0.95rem" }}>
              想申請考試費報銷？先睇條款 →
            </Link>
          ) : null}
        </div>
        {/* Proof strip — real numbers only. No invented figures. */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.45rem 1.1rem",
            marginTop: "1.1rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "var(--ink-soft)",
          }}
        >
          <span>📚 題庫 Paper 1：822 題</span>
          <span style={{ opacity: 0.35 }}>|</span>
          <span>✅ 合格線 70%（75 題要 53 題）</span>
        </div>
      </section>

      {/* Who — a real person, once Prisken confirms the checkable facts */}
      {OWNER_IDENTITY_READY ? (
        <section
          className="panel rise rise-delay-1"
          style={{ marginBottom: "1.8rem", padding: "1.3rem 1.5rem", display: "flex", gap: "1.1rem", alignItems: "center", flexWrap: "wrap" }}
        >
          {OWNER.photo ? (
            <img
              src={OWNER.photo}
              alt={OWNER.name}
              style={{ width: "4.4rem", height: "4.4rem", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: "4.4rem",
                height: "4.4rem",
                borderRadius: "50%",
                background: "var(--amber-bright)",
                color: "var(--sea-deep)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.5rem",
                flexShrink: 0,
              }}
            >
              {OWNER.name.slice(0, 1)}
            </div>
          )}
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "1.05rem" }}>
              我係 {OWNER.name}，持牌保險中介（{OWNER.licenseNo}）。
            </p>
            <p style={{ margin: "0.3rem 0 0", lineHeight: 1.65, opacity: 0.85, fontSize: "0.95rem" }}>
              呢個站我整嚟幫人考 IIQE。合格之後想入行，我可以陪你報 PEAK、{" "}
              {FEE_TERMS_CONFIRMED ? "講清楚考試費點報銷。" : "講清楚之後點行。"}
              唔想入行？工具照用。
            </p>
          </div>
        </section>
      ) : null}

      {/* The 3-step strip — what can I do here */}
      <section
        className="rise rise-delay-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "0.9rem",
          marginBottom: "2.2rem",
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

      {/* Paper grid — the five doors, each with three equal actions */}
      <h2 className="display" style={{ fontSize: "1.3rem", margin: "0 0 0.8rem", color: "var(--sea)" }}>
        五份試卷 — 揀你嗰份
      </h2>
      <section
        className="rise rise-delay-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "1rem",
        }}
      >
        {papers.map((p) => (
          <div key={p.id} className="panel" style={{ padding: "1.35rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="stat-num" style={{ fontWeight: 700, color: "var(--amber)", fontSize: "1.05rem" }}>
                {p.code}
              </span>
              <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                <span className="stat-num">{p.exam.count}</span> 題 · <span className="stat-num">{p.exam.minutes}</span> 分 · 合格{" "}
                <span className="stat-num">{p.exam.passPercent}%</span>
              </span>
            </div>
            <h3 className="display" style={{ fontSize: "1.35rem", margin: 0, color: "var(--sea)" }}>
              {p.titleZh}
            </h3>
            <p style={{ margin: 0, opacity: 0.72, fontSize: "0.92rem" }}>{p.titleEn}</p>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ink-soft)" }}>
              題庫 <span className="stat-num">{p.stats.questions}</span> 題
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", paddingTop: "0.4rem", flexWrap: "wrap" }}>
              <Link href={`/papers/${p.id}/study`} className="btn btn-ghost" style={{ flex: 1, fontSize: "0.88rem", textAlign: "center" }}>
                研習
              </Link>
              <Link href={`/papers/${p.id}/drill?n=10`} className="btn btn-ghost" style={{ flex: 1, fontSize: "0.88rem", textAlign: "center" }}>
                10 題
              </Link>
              <Link href={`/papers/${p.id}/mock`} className="btn btn-primary" style={{ flex: 1, fontSize: "0.88rem", textAlign: "center" }}>
                模擬試
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Recruit block — folded below the five papers, not the hero */}
      <section
        className="panel rise rise-delay-2"
        style={{ marginTop: "2rem", padding: "1.5rem 1.6rem" }}
      >
        <h3 className="display" style={{ margin: "0 0 0.4rem", fontSize: "1.15rem", color: "var(--sea)" }}>
          準備報名嗰陣
        </h3>
        <p style={{ margin: "0 0 0.9rem", lineHeight: 1.65, opacity: 0.85, maxWidth: 620 }}>
          你可以自己上 PEAK 報。如果你想有人一齊揀場次、填表，
          留個電話或者 WhatsApp 我。15 分鐘。唔啱就唔啱。溫書工具唔會收走。
        </p>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/recruit" className="btn btn-amber" style={{ fontSize: "0.95rem" }}>
            想人陪你報 PEAK →
          </Link>
          {FEE_TERMS_CONFIRMED ? (
            <Link href="/exam-fee" style={{ color: "var(--amber)", fontWeight: 600, fontSize: "0.9rem" }}>
              報銷條款寫死喺呢頁 →
            </Link>
          ) : null}
        </div>
      </section>

      {/* Values — no invented facts, no outcome claims */}
      <section
        className="panel panel-gold-top rise"
        style={{
          marginTop: "1.25rem",
          padding: "1.6rem 1.6rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "1.9rem", lineHeight: 1 }}>❤️</div>
        <h2 className="display" style={{ margin: "0.55rem 0 0.45rem", fontSize: "1.25rem", color: "var(--sea)" }}>
          考到牌先有得揀
        </h2>
        <p style={{ margin: "0 auto", maxWidth: 640, lineHeight: 1.75, color: "var(--ink-soft)" }}>
          呢度嘅研習手冊、題庫同模擬試，全部都係免費開放，唔加入都可以用。
          未考到牌之前，唔好同人講夢想 — 先專心考到佢。
        </p>
        <p
          style={{
            margin: "0.9rem 0 0",
            fontSize: "0.82rem",
            fontWeight: 600,
            color: "var(--amber)",
            letterSpacing: "0.08em",
          }}
        >
          用心整理 · 免費開放 · 入行自願
        </p>
      </section>

      <div style={{ marginTop: "1.75rem" }}>
        <DisclaimerBanner variant="full" />
      </div>
    </div>
  );
}
