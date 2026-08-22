import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import {
  CONTENT_AS_OF,
  CONTENT_AS_OF_ZH,
  DISCLAIMER_EN,
  DISCLAIMER_TITLE,
  DISCLAIMER_ZH,
} from "@/lib/disclaimer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `${DISCLAIMER_TITLE} | IIQE Prep`,
  description:
    "Disclaimer: unofficial IIQE study reference only. Not affiliated with VTC, PEAK or the Insurance Authority. Verify with official sources.",
};

export default function DisclaimerPage() {
  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 780 }}>
      <p style={{ margin: "0 0 0.8rem" }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 返回首頁
        </Link>
      </p>

      <h1 className="display" style={{ fontSize: "clamp(1.7rem, 4vw, 2.2rem)", margin: "0 0 0.45rem" }}>
        【{DISCLAIMER_TITLE}】
      </h1>
      <p
        style={{
          display: "inline-block",
          margin: "0 0 1.25rem",
          padding: "0.4rem 0.75rem",
          borderRadius: 999,
          background: "rgba(196,123,44,0.14)",
          color: "var(--amber)",
          fontWeight: 700,
          fontSize: "0.9rem",
        }}
      >
        資料截至 {CONTENT_AS_OF_ZH} · Information accurate as of {CONTENT_AS_OF}
      </p>

      <div className="panel" style={{ padding: "1.25rem 1.35rem" }}>
        <h2 className="display" style={{ fontSize: "1.15rem", marginTop: 0 }}>
          中文
        </h2>
        <p style={{ margin: "0 0 1.25rem", lineHeight: 1.8 }}>{DISCLAIMER_ZH}</p>

        <h2 className="display" style={{ fontSize: "1.15rem", marginTop: 0 }}>
          English
        </h2>
        <p style={{ margin: 0, lineHeight: 1.75, opacity: 0.9 }}>{DISCLAIMER_EN}</p>
      </div>

      <div className="panel" style={{ marginTop: "1rem", padding: "1.05rem 1.2rem" }}>
        <h2 className="display" style={{ fontSize: "1.05rem", marginTop: 0 }}>
          溫馨提示
        </h2>
        <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.88 }}>
          考試範圍、罰則及監管要求可能不時更新。本站標示「資料截至 {CONTENT_AS_OF_ZH}」，方便大家判斷內容是否仍然適用。正式備試請以官方最新公布為準。
        </p>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <DisclaimerBanner variant="compact" />
      </div>
    </div>
  );
}
