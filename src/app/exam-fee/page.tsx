import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "考試費報銷條款 | Hub Cards",
  description:
    "IIQE 考試費報銷嘅完整條款 — 邊份、幾多錢、幾時過數、唔合格點計。",
};

// Prisken must confirm these before they go live. Until then, no claim is made.
const TERMS_CONFIRMED = false;

export default function ExamFeePage() {
  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 780 }}>
      <p style={{ margin: "0 0 0.8rem" }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 返回首頁
        </Link>
      </p>

      <h1 className="display" style={{ fontSize: "clamp(1.7rem, 4vw, 2.2rem)", margin: "0 0 0.45rem" }}>
        考試費報銷 — 條款
      </h1>

      {TERMS_CONFIRMED ? (
        <div className="panel" style={{ padding: "1.4rem 1.5rem", lineHeight: 1.85, fontSize: "0.95rem" }}>
          <p>[條款待 Prisken 確認後填入]</p>
          <p style={{ fontWeight: 700 }}>以上係全部條件。冇隱藏 KPI、冇逼你買自己單先至過數。</p>
        </div>
      ) : (
        <div className="panel" style={{ padding: "1.4rem 1.5rem", lineHeight: 1.85, fontSize: "0.95rem" }}>
          <p>
            呢頁嘅報銷條款整理緊。未寫死之前，我哋<b>唔會</b>喺任何地方講「考試費我哋俾」。
          </p>
          <p>
            確認咗之後，呢頁會寫死：報銷邊份、金額、幾時申請、唔合格點計、邊個過數、使唔使加入先得。
          </p>
          <p style={{ marginTop: "1rem" }}>
            想知最新狀態？{" "}
            <Link href="/recruit" style={{ color: "var(--amber)", fontWeight: 600 }}>
              報名幫手頁 →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
