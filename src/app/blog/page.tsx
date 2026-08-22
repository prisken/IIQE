import { BLOG_POSTS } from "@/lib/blog";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IIQE 備試網誌 | Hub Cards",
  description: "IIQE / MPFE 備試攻略：合格線拆解、PPME vs CSME、7 日溫書表、出牌流程、入行老實講。",
};

export default function BlogPage() {
  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 720 }}>
      <p style={{ margin: 0 }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 返回首頁
        </Link>
      </p>
      <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", margin: "0.8rem 0 0.3rem" }}>
        IIQE 備試網誌
      </h1>
      <p style={{ margin: "0 0 1.4rem", opacity: 0.8, fontSize: "0.95rem" }}>
        合格線、溫書方法、報名、出牌、入行 — 全部免費，唔會收走。
      </p>

      <div style={{ display: "grid", gap: "0.8rem" }}>
        {BLOG_POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="panel" style={{ padding: "1.1rem 1.3rem", display: "block" }}>
            <p style={{ margin: 0, fontSize: "0.78rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {p.date} · {p.readingMin} 分鐘
            </p>
            <h2 className="display" style={{ margin: "0.25rem 0 0.3rem", fontSize: "1.15rem", color: "var(--sea)" }}>
              {p.title}
            </h2>
            <p style={{ margin: 0, fontSize: "0.92rem", lineHeight: 1.6, opacity: 0.8 }}>{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
