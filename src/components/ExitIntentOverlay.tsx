"use client";

import { useEffect, useState } from "react";

/**
 * ExitIntentOverlay — Hub Cards site-wide lead-capture net.
 * Prisken directive 08-22 09:51 ("make sure to log exit intent on the site").
 * Fires once per session when the cursor leaves the viewport (desktop)
 * or on scroll-up / back-intent (mobile). Dual CTA: free mock + DM READY.
 */
export function ExitIntentOverlay() {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // One-shot per session: never re-show after fired or after capture
    const fired = sessionStorage.getItem("hubcards_exit_fired");
    const captured = sessionStorage.getItem("hubcards_exit_captured");
    if (fired || captured) return;

    let armed = false;
    let lastY = window.scrollY;

    const fire = () => {
      if (sessionStorage.getItem("hubcards_exit_fired")) return;
      sessionStorage.setItem("hubcards_exit_fired", "1");
      setShow(true);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShow((v) => {
          if (v) sessionStorage.setItem("hubcards_exit_fired", "1");
          return false;
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      // Cursor left toward browser chrome (top edge)
      if (e.clientY <= 0 && !e.relatedTarget) {
        if (armed) fire();
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y < lastY - 40 && y < 200) {
        // Scrolled up near the top fast = trying to leave (mobile/back intent)
        if (armed) fire();
      }
      lastY = y;
    };

    const onTouchStart = () => {
      // First touch interaction arms it for the exit moment
      armed = true;
    };

    // Arm only after the visitor has engaged with the page (not on landing)
    const armTimer = setTimeout(() => {
      armed = true;
    }, 12000);

    document.addEventListener("mouseout", onMouseOut);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("keydown", onKey);
      if (armTimer) clearTimeout(armTimer);
    };
  }, []);

  // Move focus into the dialog on open (desktop only — avoids popping the
  // keyboard on touch devices before the user opts in)
  useEffect(() => {
    if (!show) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const t = window.setTimeout(() => {
      document.getElementById("exit-intent-phone")?.focus();
    }, 80);
    return () => window.clearTimeout(t);
  }, [show]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), source: "exit_intent" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError("傳送失敗，請再試一次。");
        setSending(false);
        return;
      }
      sessionStorage.setItem("hubcards_exit_captured", "1");
      setSubmitted(true);
      setSending(false);
    } catch {
      setError("網絡錯誤，請再試一次。");
      setSending(false);
    }
  }

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(7, 15, 26, 0.6)",
        backdropFilter: "blur(3px)",
      }}
      onClick={() => setShow(false)}
    >
      <div
        className="panel"
        role="dialog"
        aria-modal="true"
        aria-label="離開前送你免費模擬試"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 420,
          width: "100%",
          padding: "1.6rem 1.6rem 1.4rem",
          borderTop: "4px solid var(--amber-bright)",
          position: "relative",
          maxHeight: "calc(100dvh - 2rem)",
          overflow: "auto",
        }}
      >
        <button
          type="button"
          aria-label="關閉"
          onClick={() => setShow(false)}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            border: "none",
            background: "transparent",
            fontSize: "1.1rem",
            cursor: "pointer",
            color: "var(--ink-soft)",
            width: "2.5rem",
            height: "2.5rem",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
          }}
        >
          ✕
        </button>

        {submitted ? (
          <>
            <div style={{ fontSize: "2.2rem" }}>🎉</div>
            <h3 className="display" style={{ color: "var(--sea)", margin: "0.4rem 0 0.5rem", fontSize: "1.25rem" }}>
              收到！我哋會搵你。
            </h3>
            <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.92rem" }}>
              免費 mock 同入行資料，我哋 WhatsApp 傳俾你。趕時間嘅話直接 DM「READY」。👋
            </p>
          </>
        ) : (
          <>
            <h3 className="display" style={{ color: "var(--sea)", margin: "0 0 0.4rem", fontSize: "1.3rem" }}>
              等等！臨走前… 👀
            </h3>
            <p style={{ margin: "0 0 1rem", lineHeight: 1.65, fontSize: "0.95rem" }}>
              免費攞一份 <strong>IIQE 模擬試</strong>，順便睇下我哋點幫你俾考試費
              （LEARN • TEST • EARN — 考牌一條路入行）。
            </p>
            <form onSubmit={submit} style={{ display: "grid", gap: "0.6rem" }}>
              <input
                id="exit-intent-phone"
                type="tel"
                required
                inputMode="tel"
                autoComplete="tel"
                aria-label="WhatsApp 電話號碼"
                placeholder="WhatsApp 電話號碼"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ padding: "0.7rem 0.85rem", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "0.95rem" }}
              />
              {error && <p style={{ margin: 0, color: "var(--bad)", fontSize: "0.85rem" }}>{error}</p>}
              <button type="submit" className="btn btn-amber" disabled={sending} style={{ fontSize: "0.95rem" }}>
                {sending ? "傳送中…" : "免費攞 mock + 入行資料 →"}
              </button>
            </form>
            <a
              href="https://wa.me/85260147819?text=READY"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "0.7rem",
                color: "var(--amber)",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              想直接傾？WhatsApp DM「READY」
            </a>
            <p style={{ margin: "0.7rem 0 0", fontSize: "0.75rem", opacity: 0.65, textAlign: "center" }}>
              一次過，唔會再彈出嚟。我哋唔 spam。
            </p>
          </>
        )}
      </div>
    </div>
  );
}
