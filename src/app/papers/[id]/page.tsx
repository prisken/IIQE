import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { WeakChapters } from "@/components/WeakChapters";
import { getPaperMeta, getQuestions } from "@/lib/data";
import { defaultDrillChapter } from "@/lib/drill";
import { FEE_TERMS_CONFIRMED } from "@/lib/owner";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

/** Per-paper facts: fee note for the non-HK$195 papers. */
const PAPER_FACTS: Record<
  number,
  { feeNote?: string; mppe?: boolean }
> = {
  1: {},
  2: {},
  3: {},
  4: {
    feeNote:
      "MPFE 費用唔同（PPME HK$325 / CSME HK$395），唔係 HK$195。",
    mppe: true,
  },
  5: {
    feeNote: "Paper 5 費用唔同（PPME HK$325 / CSME HK$390），唔係 HK$195。",
  },
};

/** 建議路線：P1 → P3 → P5；P2 同 MPFE 自己時間。 */
const ROUTE_MAIN = [
  { id: 1, label: "Paper 1", note: "必考" },
  { id: 3, label: "Paper 3", note: "人壽" },
  { id: 5, label: "Paper 5", note: "投連" },
];
const ROUTE_OWN_TIME = [
  { id: 2, label: "Paper 2", note: "一般保險" },
  { id: 4, label: "MPFE（Paper 4）", note: "強積金" },
];

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const paperId = Number(id);
  if (![1, 2, 3, 4, 5].includes(paperId)) return {};
  const meta = await getPaperMeta(paperId);
  const needed = Math.ceil((meta.exam.count * meta.exam.passPercent) / 100);
  const isMPFE = paperId === 4;
  return {
    title: `${isMPFE ? "MPFE（Paper 4）" : `IIQE Paper ${paperId}`} ${meta.titleZh}｜${meta.exam.count} 題 · 合格 ${needed}｜免費題庫 + 模擬試 | Hub Cards`,
    description: `免費 ${isMPFE ? "MPFE" : `IIQE Paper ${paperId}`} ${meta.titleZh}（${meta.titleEn}）備試：研習手冊、分章題庫 ${meta.stats.questions} 題、10 題快測、按官方比重模擬試（${meta.exam.count} 題 · ${meta.exam.minutes} 分鐘 · 合格 ${meta.exam.passPercent}% = ${needed} 題）。`,
  };
}

export default async function PaperHubPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paperId = Number(id);
  if (![1, 2, 3, 4, 5].includes(paperId)) notFound();
  const [meta, bank] = await Promise.all([getPaperMeta(paperId), getQuestions(paperId)]);

  const needed = Math.ceil((meta.exam.count * meta.exam.passPercent) / 100);
  const defaultCh = defaultDrillChapter(meta.weights);
  const facts = PAPER_FACTS[paperId];

  // Order weights by weight desc for the clickable cards.
  const weights = [...meta.weights].sort((a, b) => b.weight - a.weight);

  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem" }}>
      <p style={{ margin: 0 }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 全部試卷
        </Link>
      </p>

      {/* Eyebrow */}
      <p
        style={{
          margin: "1rem 0 0.4rem",
          color: "var(--amber)",
          fontWeight: 700,
          fontSize: "0.85rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {paperId === 4
          ? "MPFE · 強制性公積金計劃考試（官方唔叫 IIQE Paper 4）"
          : paperId === 5
            ? "IIQE Paper 5 · 賣投連先要（唔可以代替 Paper 3）"
            : paperId === 1
              ? "IIQE Paper 1 · 必考"
              : paperId === 2
                ? "IIQE Paper 2 · 一般保險代理要考"
                : "IIQE Paper 3 · 人壽線要考"}
      </p>

      <h1 className="display" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", margin: "0 0 0.3rem" }}>
        {meta.titleZh}
      </h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>{meta.titleEn}</p>

      {/* Fact strip — one line, not an infographic */}
      <p style={{ margin: "0 0 1.2rem", fontSize: "0.95rem", lineHeight: 1.8 }}>
        <strong className="stat-num">{meta.exam.count}</strong> 題 ·{" "}
        <strong className="stat-num">{meta.exam.minutes}</strong> 分鐘 · 4 選 1 · 合格{" "}
        <strong className="stat-num">{meta.exam.passPercent}%</strong> ={" "}
        <strong className="stat-num">{needed}</strong> 題
        {FEE_TERMS_CONFIRMED ? (
          <>
            {" · "}
            筆試 PPME{" "}
            <strong className="stat-num">
              {paperId >= 4 ? "HK$325" : "HK$195"}
            </strong>{" "}
            · 電腦試 CSME{" "}
            <strong className="stat-num">
              {paperId === 4 ? "HK$395" : paperId === 5 ? "HK$390" : "HK$265"}
            </strong>
          </>
        ) : null}
        {" · "}
        題庫 <strong className="stat-num">{meta.stats.questions}</strong> 題
      </p>
      {facts.feeNote && FEE_TERMS_CONFIRMED ? (
        <p style={{ margin: "-0.8rem 0 1.2rem", fontSize: "0.85rem", color: "var(--amber)", fontWeight: 600 }}>
          ⚠️ {facts.feeNote}
        </p>
      ) : null}

      {/* Lead — don't open the full mock cold */}
      <div className="panel panel-gold-top" style={{ padding: "1.2rem 1.4rem", marginBottom: "1.2rem" }}>
        <p style={{ margin: "0 0 0.8rem", lineHeight: 1.7, fontWeight: 600 }}>
          未讀過？唔好打開 {meta.exam.count} 題模擬試。
        </p>
        <p style={{ margin: "0 0 1rem", fontSize: "0.92rem", lineHeight: 1.7, opacity: 0.8 }}>
          而家用 10 題知自己企喺邊。之後先決定讀定操。
        </p>
        <Link
          href={`/papers/${paperId}/drill?ch=${defaultCh}&n=10`}
          className="btn btn-primary"
          style={{ fontSize: "1rem", padding: "0.8rem 1.4rem" }}
        >
          而家做 10 題 · 大約 8 分鐘
        </Link>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", opacity: 0.65 }}>
          抽最重嘅 Ch {defaultCh}（{meta.weights.find((w) => w.id === defaultCh)?.titleZh}，約{" "}
          {meta.weights.find((w) => w.id === defaultCh)?.weight}% 卷）
        </p>
      </div>

      {/* Secondary row — three equal buttons, not one vague 開始 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.7rem", marginBottom: "1.6rem" }}>
        <Link href={`/papers/${paperId}/study`} className="btn btn-ghost" style={{ textAlign: "center", padding: "0.75rem 0.6rem", fontSize: "0.95rem" }}>
          開研習手冊
        </Link>
        <Link href={`/papers/${paperId}/questions`} className="btn btn-ghost" style={{ textAlign: "center", padding: "0.75rem 0.6rem", fontSize: "0.95rem" }}>
          入完整題庫
        </Link>
        <Link href={`/papers/${paperId}/mock`} className="btn btn-ghost" style={{ textAlign: "center", padding: "0.75rem 0.6rem", fontSize: "0.95rem" }}>
          做 {meta.exam.count} 題模擬試
        </Link>
      </div>
      <p style={{ margin: "-1.1rem 0 1.4rem", fontSize: "0.8rem", opacity: 0.65 }}>
        未穩陣先唔好坐滿 {meta.exam.minutes} 分鐘。
      </p>

      {/* Weight cards — clickable, decide which chapter to hit now */}
      <h2 className="display" style={{ fontSize: "1.2rem", margin: "0 0 0.6rem", color: "var(--sea)" }}>
        官方比重 — 用嚟決定而家打邊章，唔係背誦表
      </h2>
      <section style={{ display: "grid", gap: "0.6rem", marginBottom: "0.9rem" }}>
        {weights.map((w, i) => {
          const approx = Math.round((meta.exam.count * w.weight) / 100);
          const isDefault = w.id === defaultCh;
          return (
            <div
              key={w.id}
              className="panel"
              style={{
                padding: "0.85rem 1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.8rem",
                flexWrap: "wrap",
                borderColor: isDefault ? "rgba(212,175,55,0.7)" : undefined,
                background: isDefault ? "rgba(255,250,235,0.55)" : undefined,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>
                  Ch {w.id} {w.titleZh}
                  {isDefault ? " ← 預設" : ""}
                </p>
                <p style={{ margin: "0.15rem 0 0", fontSize: "0.82rem", opacity: 0.7 }}>
                  {w.weight}% ≈ {approx} 題
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.45rem", flexShrink: 0 }}>
                <Link href={`/papers/${paperId}/study?ch=${w.id}`} className="btn btn-ghost" style={{ fontSize: "0.82rem", padding: "0.4rem 0.8rem" }}>
                  先讀
                </Link>
                <Link href={`/papers/${paperId}/drill?ch=${w.id}&n=10`} className="btn btn-ghost" style={{ fontSize: "0.82rem", padding: "0.4rem 0.8rem" }}>
                  操 10 題
                </Link>
              </div>
            </div>
          );
        })}
      </section>
      <p style={{ margin: "0 0 1.4rem", fontSize: "0.85rem", opacity: 0.75 }}>
        {weights.slice(0, 3).map((w) => `Ch ${w.id}`).join(" + ")} ≈{" "}
        {weights.slice(0, 3).reduce((n, w) => n + w.weight, 0)}% 卷。你只可以錯{" "}
        {meta.exam.count - needed} 題。呢幾章未穩，唔好改去操第二份卷。
      </p>

      {/* Route box — which paper next. Main line: P1 → P3 → P5. P2/MPFE own time. */}
      <div className="panel" style={{ padding: "1.1rem 1.3rem", marginBottom: "1rem" }}>
        <p style={{ margin: "0 0 0.4rem", fontWeight: 700 }}>跟住考邊份？</p>
        <p style={{ margin: "0 0 0.3rem", fontSize: "0.92rem", lineHeight: 1.8 }}>
          建議順序：{" "}
          {ROUTE_MAIN.map((r, i) => (
            <span key={r.id}>
              {i > 0 ? " → " : ""}
              {r.id === paperId ? (
                <strong style={{ color: "var(--amber)" }}>
                  {r.label}（{r.note}）← 你而家喺度
                </strong>
              ) : (
                <Link href={`/papers/${r.id}`} style={{ fontWeight: 600 }}>
                  {r.label}（{r.note}）
                </Link>
              )}
            </span>
          ))}
        </p>
        <p style={{ margin: "0 0 0.6rem", fontSize: "0.92rem", lineHeight: 1.8, opacity: 0.85 }}>
          以下自己時間考，唔使跟上面條線：{" "}
          {ROUTE_OWN_TIME.map((r, i) => (
            <span key={r.id}>
              {i > 0 ? " · " : ""}
              {r.id === paperId ? (
                <strong style={{ color: "var(--amber)" }}>
                  {r.label}（{r.note}）← 你而家喺度
                </strong>
              ) : (
                <Link href={`/papers/${r.id}`} style={{ fontWeight: 600 }}>
                  {r.label}（{r.note}）
                </Link>
              )}
            </span>
          ))}
        </p>
        <p style={{ margin: "0.6rem 0 0", fontSize: "0.85rem" }}>
          <Link href="/which-papers" style={{ color: "var(--amber)", fontWeight: 600 }}>
            我唔肯定考邊份 →
          </Link>
        </p>
      </div>

      {/* Soft exit */}
      <div className="panel" style={{ padding: "1.1rem 1.3rem", marginBottom: "1rem" }}>
        <p style={{ margin: "0 0 0.4rem", fontWeight: 700 }}>只係想溫書？呢頁全部免費。</p>
        <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.7, opacity: 0.85 }}>
          準備報 PEAK、想人陪你填，或者想申請考試費報銷：
          {FEE_TERMS_CONFIRMED ? (
            <>
              {" "}
              <Link href="/exam-fee" style={{ color: "var(--amber)", fontWeight: 600 }}>
                先睇條款 →
              </Link>{" "}
              之後先決定要唔要人陪{" "}
            </>
          ) : null}
          <Link href="/recruit" style={{ color: "var(--amber)", fontWeight: 600 }}>
            → /recruit
          </Link>
        </p>
      </div>

      {/* Weak-chapters dashboard — from saved mock sessions (client-side) */}
      <WeakChapters meta={meta} bank={bank} />

      <div style={{ marginTop: "0.5rem" }}>
        <DisclaimerBanner variant="compact" />
      </div>
    </div>
  );
}
