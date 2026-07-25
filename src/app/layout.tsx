import type { Metadata, Viewport } from "next";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "IIQE Prep — 研習 · 題庫 · 模擬試",
  description: "Insurance Intermediaries Qualifying Examination study helper for Papers 1–5",
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
        <footer className="shell site-footer">
          <DisclaimerBanner variant="footer" />
        </footer>
      </body>
    </html>
  );
}
