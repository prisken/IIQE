import { OWNER } from "@/lib/owner";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "私隱政策 / Privacy Policy | Hub Cards",
  description:
    "收集啲咩資料、點用、邊個睇到、幾耐刪除 — 以及點樣要求刪除。",
};

export default function PrivacyPage() {
  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 780 }}>
      <p style={{ margin: "0 0 0.8rem" }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 返回首頁
        </Link>
      </p>

      <h1 className="display" style={{ fontSize: "clamp(1.7rem, 4vw, 2.2rem)", margin: "0 0 0.45rem" }}>
        私隱政策 / 個人資料收集聲明
      </h1>
      <p style={{ marginTop: 0, opacity: 0.7, fontSize: "0.9rem" }}>
        生效日期：2026 年 8 月 23 日
      </p>

      <div className="panel" style={{ padding: "1.4rem 1.5rem", lineHeight: 1.85, fontSize: "0.95rem" }}>
        <h2 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem" }}>1. 我哋收集啲咩</h2>
        <p>
          只有你主動喺表格留低嘅資料：稱呼、WhatsApp 電話號碼，以及（可選）你嘅
          mock 分數、準備邊份試卷、你而家嘅階段。本站冇用追蹤器收集瀏覽行為。
        </p>

        <h2 style={{ fontSize: "1.1rem", margin: "1.2rem 0 0.5rem" }}>2. 點解收集、點用</h2>
        <p>
          唯一用途係 WhatsApp 你，跟進考試備試 / 報名 / 考試費報銷。冇第三方分享、
          冇賣資料、冇用嚟發 spam。如果你剔咗「都想聽入行點行」，先至會傾到事業方向。
        </p>

        <h2 style={{ fontSize: "1.1rem", margin: "1.2rem 0 0.5rem" }}>3. 邊個睇到</h2>
        <p>
          只有本站負責人（{OWNER.name || "本站負責人"}）睇到。資料存喺受保護嘅 CRM 資料庫，
          唔會落入「大隊流水線」。
        </p>

        <h2 style={{ fontSize: "1.1rem", margin: "1.2rem 0 0.5rem" }}>4. 保留幾耐</h2>
        <p>
          只要你冇要求刪除，我哋會保留作跟進用途；你可以隨時要求刪除，刪咗之後唔會再用。
        </p>

        <h2 style={{ fontSize: "1.1rem", margin: "1.2rem 0 0.5rem" }}>5. 點樣刪除 / 查詢</h2>
        <p>
          WhatsApp 講「刪資料」或者「Delete my data」，我會喺 7 日內刪除你嘅記錄並確認。
          任何私隱問題，直接 WhatsApp 就得。
        </p>

        <h2 style={{ fontSize: "1.1rem", margin: "1.2rem 0 0.5rem" }}>6. 同意</h2>
        <p>
          喺報名表格剔「我同意…用呢個號碼 WhatsApp 我」即係你嘅明確同意（PDPO）。
          你可以隨時撤回。
        </p>
      </div>
    </div>
  );
}
