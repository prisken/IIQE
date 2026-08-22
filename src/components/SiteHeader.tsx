"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link href="/" className="site-brand" aria-label="Hub Cards 首頁">
          <img
            src="/branding/hub-cards-logo.png"
            alt="HUB CARDS"
            style={{ height: "2.1rem", width: "auto", display: "block" }}
          />
        </Link>

        <nav className="site-nav-desktop" aria-label="主選單">
          {[1, 2, 3, 4, 5].map((n) => (
            <Link
              key={n}
              href={`/papers/${n}`}
              className={`btn btn-ghost site-nav-link${pathname?.startsWith(`/papers/${n}`) ? " is-active" : ""}`}
            >
              Paper {n}
            </Link>
          ))}
          <Link href="/disclaimer" className="btn btn-ghost site-nav-link site-nav-disclaimer">
            聲明
          </Link>
          <Link href="/recruit" className="btn btn-amber site-nav-link">
            入行
          </Link>
        </nav>

        <button
          type="button"
          className="btn btn-ghost site-menu-toggle"
          aria-expanded={open}
          aria-controls="site-mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "關閉" : "選單"}
        </button>
      </div>

      {open && (
        <>
          <button type="button" className="site-menu-backdrop" aria-label="關閉選單" onClick={() => setOpen(false)} />
          <div id="site-mobile-menu" className="site-menu-panel panel" role="dialog" aria-modal="true">
            <p className="site-menu-label">試卷</p>
            <div className="site-menu-grid">
              {[1, 2, 3, 4, 5].map((n) => (
                <Link
                  key={n}
                  href={`/papers/${n}`}
                  className={`btn ${pathname?.startsWith(`/papers/${n}`) ? "btn-primary" : "btn-ghost"}`}
                >
                  Paper {n}
                </Link>
              ))}
            </div>
            <div className="site-menu-extra">
              <Link href="/" className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--ink)" }}>
                首頁
              </Link>
              <Link href="/recruit" className="btn btn-amber" style={{ justifyContent: "flex-start" }}>
                入行 — 考牌一條路
              </Link>
              <Link href="/disclaimer" className="btn btn-ghost" style={{ justifyContent: "flex-start", color: "var(--amber)" }}>
                重要聲明
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
