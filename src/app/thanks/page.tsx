import { OWNER, waLink } from "@/lib/owner";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "收到！開 WhatsApp | Hub Cards",
};

/**
 * Pass 4 — thank-you screen. One button. Prefill from hidden fields.
 * Role map:
 *  - Recruit Lead → 報名
 *  - Study Lead   → 弱項 Paper {n} {score}% 弱：Ch {weak}
 *  - Study Only   → do not open WhatsApp; send back to /papers/1
 */
export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ via?: string; role?: string; paper?: string; score?: string; ch?: string }>;
}) {
  const sp = await searchParams;
  const role = sp.role ?? "";
  const paper = sp.paper ? `Paper ${sp.paper}` : "";
  const score = sp.score ?? "";
  const ch = sp.ch ?? "";
  const studyOnly = role === "Study Only";

  let waText = "報名";
  if (role === "Study Lead") {
    const bits = [`弱項 ${paper || ""}`.trim(), score ? `${score}%` : "", ch ? `弱：Ch ${ch}` : ""].filter(Boolean);
    waText = `你好，我啱啱喺 Hub Cards ${paper || "做咗快測"}${bits.length ? `，${bits.join("，")}` : ""}，想知下一步。`;
  } else if (studyOnly) {
    waText = "你好，我淨係想溫書，唔好拉我入行。";
  }

  return (
    <div className="shell" style={{ padding: "3rem 0 4rem", maxWidth: 640 }}>
      <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.6rem" }}>📥</div>
        <h1 className="display" style={{ color: "var(--sea)", margin: "0 0 0.6rem" }}>
          收到。而家撳下去開 WhatsApp。
        </h1>
        <p style={{ lineHeight: 1.7, margin: "0 0 1.2rem" }}>
          {studyOnly ? (
            "你淨係想溫書 — 明白，唔會拉你入行。工具照用，隨時返嚟。"
          ) : (
            <>
              我會用「{OWNER.name || "我"}」呢個名出嚟。頭三句只會問你考邊份、mock 幾多分、
              想邊個禮拜。唔會一開波拉你入行。
            </>
          )}
        </p>
        <div style={{ display: "flex", gap: "0.7rem", justifyContent: "center", flexWrap: "wrap" }}>
          {studyOnly ? (
            <Link href="/papers/1" className="btn btn-primary">
              返去繼續溫 →
            </Link>
          ) : (
            <a
              href={waLink(waText)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-amber"
              style={{ fontSize: "1rem", padding: "0.85rem 1.4rem" }}
            >
              開 WhatsApp，貼埋我嘅分數 →
            </a>
          )}
        </div>
        {!studyOnly ? (
          <p style={{ margin: "1.1rem 0 0", fontSize: "0.88rem" }}>
            唔方便而家傾？我哋 2 日內都會覆。想改號碼就回覆「改」。
          </p>
        ) : null}
      </div>
    </div>
  );
}
