import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { CONTENT_AS_OF, CONTENT_AS_OF_ZH, DISCLAIMER_POINTS, DISCLAIMER_TITLE } from "@/lib/disclaimer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `${DISCLAIMER_TITLE} | IIQE Prep`,
  description: "Legal disclaimer for IIQE Prep — no endorsement, reference only, no liability.",
};

export default function DisclaimerPage() {
  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 820 }}>
      <p style={{ margin: "0 0 0.8rem" }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 返回首頁
        </Link>
      </p>

      <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", margin: "0 0 0.5rem" }}>
        {DISCLAIMER_TITLE}
      </h1>
      <p
        style={{
          display: "inline-block",
          margin: "0 0 1.5rem",
          padding: "0.45rem 0.8rem",
          borderRadius: 999,
          background: "rgba(196,123,44,0.15)",
          color: "var(--amber)",
          fontWeight: 700,
          fontSize: "0.95rem",
        }}
      >
        Information accurate as of {CONTENT_AS_OF} · 資料截至 {CONTENT_AS_OF_ZH}
      </p>

      <div className="panel" style={{ padding: "1.35rem 1.5rem" }}>
        {DISCLAIMER_POINTS.map((p, i) => (
          <section
            key={p.id}
            style={{
              marginBottom: i === DISCLAIMER_POINTS.length - 1 ? 0 : "1.4rem",
              paddingBottom: i === DISCLAIMER_POINTS.length - 1 ? 0 : "1.4rem",
              borderBottom:
                i === DISCLAIMER_POINTS.length - 1 ? "none" : "1px solid var(--line)",
            }}
          >
            <h2 className="display" style={{ fontSize: "1.25rem", margin: "0 0 0.6rem" }}>
              {i + 1}. {p.titleZh}
            </h2>
            <p style={{ margin: "0 0 0.55rem", lineHeight: 1.75 }}>{p.bodyZh}</p>
            <h3 style={{ fontSize: "1rem", margin: "0.8rem 0 0.4rem", opacity: 0.85 }}>{p.titleEn}</h3>
            <p style={{ margin: 0, lineHeight: 1.7, opacity: 0.8 }}>{p.bodyEn}</p>
          </section>
        ))}
      </div>

      <div className="panel" style={{ marginTop: "1rem", padding: "1.1rem 1.3rem" }}>
        <h2 className="display" style={{ fontSize: "1.15rem", marginTop: 0 }}>
          內容時效 / Timestamp
        </h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          法例、監管指引及考試範圍可能不時修訂（例如相關罰則、門檻或表格可由立法會或監管機構更新）。本站標示「資料截至{" "}
          {CONTENT_AS_OF_ZH} / Information accurate as of {CONTENT_AS_OF}
          」，以便你判斷內容是否可能已過時。請在應考或執業前核對官方最新文本。
        </p>
      </div>

      <DisclaimerBanner variant="compact" />
    </div>
  );
}
