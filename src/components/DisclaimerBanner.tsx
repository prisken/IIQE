import Link from "next/link";
import {
  CONTENT_AS_OF,
  CONTENT_AS_OF_ZH,
  DISCLAIMER_COMPACT_ZH,
  DISCLAIMER_EN,
  DISCLAIMER_TITLE,
  DISCLAIMER_ZH,
} from "@/lib/disclaimer";

export function DisclaimerBanner({ variant = "full" }: { variant?: "full" | "compact" | "footer" }) {
  if (variant === "footer") {
    return (
      <div style={{ lineHeight: 1.65 }}>
        <p style={{ margin: "0 0 0.35rem", fontWeight: 600, color: "#fff" }}>【{DISCLAIMER_TITLE}】</p>
        <p style={{ margin: "0 0 0.35rem", opacity: 0.85 }}>{DISCLAIMER_COMPACT_ZH}</p>
        <p style={{ margin: 0 }}>
          <Link href="/disclaimer" style={{ color: "var(--amber-bright)", fontWeight: 600 }}>
            查看全文 / Full text
          </Link>
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <aside
        className="panel"
        role="note"
        style={{
          padding: "0.85rem 1rem",
          borderColor: "rgba(212,175,55,0.4)",
          background: "rgba(212,175,55,0.08)",
          fontSize: "0.9rem",
          lineHeight: 1.6,
        }}
      >
        <strong>【免責聲明】</strong>
        {DISCLAIMER_COMPACT_ZH}{" "}
        <Link href="/disclaimer" style={{ color: "var(--amber)", fontWeight: 600 }}>
          全文
        </Link>
      </aside>
    );
  }

  return (
    <aside
      className="panel rise"
      role="note"
      aria-label={DISCLAIMER_TITLE}
      style={{
        padding: "1.15rem 1.25rem",
        borderColor: "rgba(212,175,55,0.4)",
        background: "linear-gradient(135deg, rgba(212,175,55,0.09), rgba(13,27,42,0.04))",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        <h2 className="display" style={{ margin: 0, fontSize: "1.2rem" }}>
          【{DISCLAIMER_TITLE}】
        </h2>
        <p style={{ margin: 0, fontWeight: 600, color: "var(--amber)", fontSize: "0.88rem" }}>
          資料截至 {CONTENT_AS_OF_ZH} · {CONTENT_AS_OF}
        </p>
      </div>
      <p style={{ margin: "0 0 0.85rem", lineHeight: 1.75 }}>{DISCLAIMER_ZH}</p>
      <p style={{ margin: "0 0 0.85rem", lineHeight: 1.7, opacity: 0.82, fontSize: "0.95rem" }}>{DISCLAIMER_EN}</p>
    </aside>
  );
}
