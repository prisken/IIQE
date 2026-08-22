import { getBlogPost } from "@/lib/blog";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Hub Cards`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 680 }}>
      <p style={{ margin: 0 }}>
        <Link href="/blog" style={{ color: "var(--sea)" }}>
          ← 網誌
        </Link>
        {" · "}
        <Link href="/" style={{ color: "var(--sea)" }}>
          首頁
        </Link>
      </p>

      <p style={{ margin: "1rem 0 0.3rem", fontSize: "0.8rem", opacity: 0.6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {post.date} · {post.readingMin} 分鐘
      </p>
      <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.3rem)", margin: "0 0 1.2rem" }}>
        {post.title}
      </h1>

      <div style={{ display: "grid", gap: "0.9rem", lineHeight: 1.8, fontSize: "1rem" }}>
        {post.blocks.map((b, i) => {
          if (b.type === "h2") {
            return (
              <h2 key={i} className="display" style={{ fontSize: "1.2rem", margin: "0.6rem 0 0", color: "var(--sea)" }}>
                {b.text}
              </h2>
            );
          }
          if (b.type === "ul") {
            return (
              <ul key={i} style={{ margin: 0, paddingLeft: "1.3rem" }}>
                {b.items?.map((item, j) => (
                  <li key={j} style={{ marginBottom: "0.3rem" }}>
                    {item}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={i} style={{ margin: 0 }}>
              {b.text}
            </p>
          );
        })}
      </div>

      <div className="panel" style={{ marginTop: "1.8rem", padding: "1.1rem 1.3rem", background: "rgba(255,250,235,0.6)", borderColor: "rgba(212,175,55,0.45)" }}>
        <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.7 }}>
          想即場試下自己幾多成？{" "}
          <Link href="/papers/1/drill?ch=3&n=10" style={{ color: "var(--amber)", fontWeight: 700 }}>
            做 10 題快測 →
          </Link>{" "}
          或者{" "}
          <Link href="/papers/1/mock" style={{ color: "var(--amber)", fontWeight: 700 }}>
            坐一次模擬試
          </Link>
          。全部免費。
        </p>
      </div>
    </div>
  );
}
