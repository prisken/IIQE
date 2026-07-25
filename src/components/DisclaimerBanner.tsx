import Link from "next/link";
import {
  CONTENT_AS_OF,
  CONTENT_AS_OF_ZH,
  DISCLAIMER_POINTS,
  DISCLAIMER_TITLE,
} from "@/lib/disclaimer";

export function DisclaimerBanner({ variant = "full" }: { variant?: "full" | "compact" | "footer" }) {
  if (variant === "footer") {
    return (
      <div style={{ lineHeight: 1.65 }}>
        <p style={{ margin: "0 0 0.45rem", fontWeight: 600 }}>
          {DISCLAIMER_TITLE} · 資料截至 {CONTENT_AS_OF_ZH}（Information accurate as of {CONTENT_AS_OF}）
        </p>
        <p style={{ margin: 0, opacity: 0.85 }}>
          本站與 IA、VTC/PEAK、MPFA、HKSI、SFC 等機構並無從屬或認可關係；內容僅供教育參考，並不保證反映最新考試或法規；因依賴本內容所致之後果本站概不負責。詳見{" "}
          <Link href="/disclaimer" style={{ color: "var(--sea)", fontWeight: 600 }}>
            完整法律聲明
          </Link>
          。
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
          borderColor: "rgba(196,123,44,0.35)",
          background: "rgba(196,123,44,0.08)",
          fontSize: "0.9rem",
          lineHeight: 1.6,
        }}
      >
        <strong>聲明：</strong>
        非 IA / PEAK / MPFA / HKSI / SFC 官方內容 · 僅供教育參考 · 資料截至 {CONTENT_AS_OF_ZH}（{CONTENT_AS_OF}）·{" "}
        <Link href="/disclaimer" style={{ color: "var(--sea)", fontWeight: 600 }}>
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
        padding: "1.25rem 1.35rem",
        borderColor: "rgba(196,123,44,0.4)",
        background: "linear-gradient(135deg, rgba(196,123,44,0.1), rgba(15,107,92,0.06))",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <h2 className="display" style={{ margin: 0, fontSize: "1.25rem" }}>
          {DISCLAIMER_TITLE}
        </h2>
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            color: "var(--amber)",
            fontSize: "0.92rem",
            alignSelf: "center",
          }}
        >
          Information accurate as of {CONTENT_AS_OF}
          <br />
          <span style={{ fontWeight: 600 }}>資料截至 {CONTENT_AS_OF_ZH}</span>
        </p>
      </div>

      <ol style={{ margin: "1rem 0 0.75rem", paddingLeft: "1.2rem", lineHeight: 1.7 }}>
        {DISCLAIMER_POINTS.map((p) => (
          <li key={p.id} style={{ marginBottom: "0.75rem" }}>
            <strong>
              {p.titleZh} / {p.titleEn}
            </strong>
            <div style={{ opacity: 0.9, marginTop: 4 }}>{p.bodyZh}</div>
            <div style={{ opacity: 0.72, marginTop: 4, fontSize: "0.92rem" }}>{p.bodyEn}</div>
          </li>
        ))}
      </ol>

      <p style={{ margin: 0, fontSize: "0.9rem" }}>
        <Link href="/disclaimer" style={{ color: "var(--sea)", fontWeight: 600 }}>
          查看獨立聲明頁 →
        </Link>
      </p>
    </aside>
  );
}
