import { FEE_TERMS, FEE_TERMS_CONFIRMED } from "@/lib/owner";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "考試費報銷條款 | Hub Cards",
  description:
    "IIQE 考試費報銷嘅完整條款 — 邊份、幾多錢、幾時過數、唔合格點計。",
};

export default function ExamFeePage() {
  if (!FEE_TERMS_CONFIRMED) {
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
        <p style={{ marginTop: 0 }}>條款整理緊，確認後會寫喺呢頁。</p>
      </div>
    );
  }

  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 780 }}>
      <p style={{ margin: "0 0 0.8rem" }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 返回首頁
        </Link>
      </p>

      <h1 className="display" style={{ fontSize: "clamp(1.7rem, 4vw, 2.2rem)", margin: "0 0 0.45rem" }}>
        考試費報銷 — 寫死嘅條款
      </h1>
      <p style={{ marginTop: 0, opacity: 0.75, fontSize: "0.95rem" }}>
        唔係「傾完你就明」。以下係全部條件。
      </p>

      <div className="panel" style={{ padding: "1.4rem 1.5rem", lineHeight: 1.85, fontSize: "0.95rem", borderColor: "rgba(255,215,0,0.55)", background: "rgba(255,250,235,0.6)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["報銷邊份", FEE_TERMS.scope],
              ["官方原價", FEE_TERMS.officialFees],
              ["我哋報銷金額", FEE_TERMS.amount],
              ["包唔包電腦試", FEE_TERMS.includesCsme],
              ["幾時先申請到", FEE_TERMS.when],
              ["「粉紅卡」係咩", FEE_TERMS.pinkCard],
              ["證明", FEE_TERMS.proof],
              ["點樣過數", FEE_TERMS.payout],
              ["唔合格", FEE_TERMS.fail],
              ["唔加入", FEE_TERMS.noJoin],
            ].map(([k, v]) => (
              <tr key={k}>
                <td style={{ padding: "0.55rem 0.9rem 0.55rem 0", verticalAlign: "top", fontWeight: 700, whiteSpace: "nowrap", width: "8.5rem" }}>
                  {k}
                </td>
                <td style={{ padding: "0.55rem 0", verticalAlign: "top" }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ margin: "0.9rem 0 0", fontWeight: 700, fontSize: "0.95rem" }}>
          {FEE_TERMS.bottomLine}
        </p>
      </div>

      <p style={{ margin: "1rem 0 0", fontSize: "0.85rem", opacity: 0.72, lineHeight: 1.8 }}>
        報銷係團隊內部資助，唔係 PEAK / 保監局 / VTC 嘅減免。你永遠可以自己俾、自己報。
      </p>

      <div style={{ marginTop: "1.2rem", display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
        <Link href="/recruit" className="btn btn-amber" style={{ fontSize: "0.95rem" }}>
          讀完，仲想人陪你報 PEAK →
        </Link>
        <Link href="/" className="btn btn-ghost" style={{ fontSize: "0.95rem" }}>
          返去溫書
        </Link>
      </div>
    </div>
  );
}
