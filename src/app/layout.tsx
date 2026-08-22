import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { ExitIntentOverlay } from "@/components/ExitIntentOverlay";
import { FEE_TERMS_CONFIRMED } from "@/lib/owner";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUB CARDS — IIQE 研習 · 題庫 · 模擬試",
  description: "保險中介人資格考試 (IIQE) 五份試卷的研習手冊、高密度天書、分章題庫與按官方比重抽題的模擬試 — 溫書免費。入行自願。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>
        <a href="#main-content" className="skip-link">
          跳到主要內容
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <ExitIntentOverlay />
        <footer className="site-footer">
          <div className="shell">
            <div className="footer-brand">
              <img src="/branding/hub-cards-logo.png" alt="HUB CARDS" />
              <span className="footer-lte">溫書免費。入行自願。</span>
            </div>
            <p style={{ margin: "0 0 0.5rem" }}>
              IIQE 研習 · 題庫 · 模擬試 — 五份試卷，全部免費。唔加入都可以用。
            </p>
            <p style={{ margin: "0 0 0.5rem" }}>
              <Link href="/disclaimer" style={{ color: "var(--amber-bright)" }}>
                免責聲明
              </Link>
              {" · "}
              <Link href="/privacy" style={{ color: "var(--amber-bright)" }}>
                私隱政策 / 個人資料收集聲明
              </Link>
              {FEE_TERMS_CONFIRMED ? (
                <>
                  {" · "}
                  <Link href="/exam-fee" style={{ color: "var(--amber-bright)" }}>
                    考試費報銷條款
                  </Link>
                </>
              ) : null}
              {" · "}
              <Link href="/recruit" style={{ color: "var(--amber-bright)" }}>
                報名幫手
              </Link>
            </p>
            <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.72 }}>
              本站獨立，與 VTC / PEAK / 保險業監管局無關。
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
