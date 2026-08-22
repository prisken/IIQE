import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SiteHeader } from "@/components/SiteHeader";
import { ExitIntentOverlay } from "@/components/ExitIntentOverlay";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUB CARDS — IIQE 研習 · 題庫 · 模擬試",
  description: "保險中介人資格考試 (IIQE) 五份試卷的研習手冊、高密度天書、分章題庫與按官方比重抽題的模擬試 — Learn. Test. Earn.",
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
        <SiteHeader />
        <main>{children}</main>
        <ExitIntentOverlay />
        <footer className="site-footer">
          <div className="shell">
            <div className="footer-brand">
              <img src="/branding/hub-cards-logo.png" alt="HUB CARDS" />
              <span className="footer-lte">LEARN • TEST • EARN</span>
            </div>
            <p style={{ margin: "0 0 0.5rem" }}>
              IIQE 研習 · 題庫 · 模擬試 — 五份試卷，一條路入行。
            </p>
            <p style={{ margin: 0, fontSize: "0.82rem", opacity: 0.85 }}>
              想知考牌之後點入行？{" "}
              <Link href="/recruit" style={{ color: "var(--amber-bright)" }}>
                睇下點加入我哋團隊 →
              </Link>
            </p>
            <DisclaimerBanner variant="footer" />
          </div>
        </footer>
      </body>
    </html>
  );
}
