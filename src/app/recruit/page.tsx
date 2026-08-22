"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecruitPage() {
  const [form, setForm] = useState({ name: "", phone: "", paper: "Paper 1" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "Hub Cards Recruit Page" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data?.error === "phone or email required" ? "留低電話或電郵，我哋先搵到你。" : "傳送失敗，請再試一次。");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("網絡錯誤，請再試一次。");
    }
  }

  if (status === "done") {
    return (
      <div className="shell" style={{ padding: "3rem 0 4rem", maxWidth: 640 }}>
        <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.6rem" }}>🎫</div>
          <h1 className="display" style={{ color: "var(--sea)", margin: "0 0 0.6rem" }}>
            收到！我哋好快搵你。
          </h1>
          <p style={{ lineHeight: 1.7, margin: "0 0 1.2rem" }}>
            我哋會喺 1–2 個工作天內 WhatsApp 你，傾下考牌、考試費資助同入行點行。
            想即刻傾？直接 DM「READY」我哋。
          </p>
          <div style={{ display: "flex", gap: "0.7rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/papers/1/study" className="btn btn-primary">
              而家開始溫書 →
            </Link>
            <Link href="/" className="btn btn-ghost">
              返首頁
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell" style={{ padding: "2rem 0 4rem", maxWidth: 760 }}>
      <p style={{ margin: 0 }}>
        <Link href="/" style={{ color: "var(--amber)", fontWeight: 600 }}>
          ← 首頁
        </Link>
      </p>
      <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "var(--sea)", margin: "0.6rem 0 0.4rem" }}>
        考牌唔係終點 — 係入行嘅第一張飛。
      </h1>
      <p style={{ fontSize: "1.05rem", lineHeight: 1.7, maxWidth: 620 }}>
        IIQE 合格，只係證明你識。真正嘅問題係：<strong>之後點行？</strong>
        我哋幫你俾考試費、有 mentor 陪你溫、操題、考牌，然後正式入行做保險中介。
      </p>

      {/* The 4-step pipeline */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "0.8rem",
          margin: "1.5rem 0",
        }}
      >
        {[
          { n: "01", t: "溫書", d: "研習手冊 + 天書 + 題庫，喺度免費溫" },
          { n: "02", t: "模擬試", d: "按官方比重抽題，知道自已幾多成" },
          { n: "03", t: "考牌", d: "我哋幫你俾 IIQE 考試費（HK$195 起）" },
          { n: "04", t: "入行", d: "有 mentor 帶你起步，正式做中介" },
        ].map((s) => (
          <div key={s.n} className="panel" style={{ padding: "1.1rem 1.15rem", borderTop: "3px solid var(--amber-bright)" }}>
            <div className="stat-num" style={{ color: "var(--amber)", fontWeight: 700, fontSize: "1.1rem" }}>
              {s.n}
            </div>
            <h2 className="display" style={{ margin: "0.3rem 0", fontSize: "1.15rem", color: "var(--sea)" }}>
              {s.t}
            </h2>
            <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.6, opacity: 0.78 }}>{s.d}</p>
          </div>
        ))}
      </section>

      {/* The offer + form */}
      <section className="panel" style={{ padding: "1.6rem 1.6rem", background: "var(--sea)", color: "#e8eef5", borderColor: "rgba(255,215,0,0.35)" }}>
        <h2 className="display" style={{ margin: "0 0 0.5rem", color: "#fff", fontSize: "1.35rem" }}>
          WE PAY FOR YOU TO PASS 💰
        </h2>
        <p style={{ margin: "0 0 1.1rem", lineHeight: 1.65, opacity: 0.9 }}>
          加入我哋團隊，IIQE 考試費我哋俾（Paper 1 PPME HK$195 起）。唔係噱頭 — 下面留低電話，
          我哋同你講清楚條款、團隊點運作、入行頭一年實際係點。傾完你先決定。
        </p>
        <form onSubmit={submit} style={{ display: "grid", gap: "0.7rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.7rem" }}>
            <input
              type="text"
              placeholder="你叫咩名？（optional）"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", border: "1px solid rgba(255,215,0,0.4)", background: "#ffffff", color: "#0d1b2a", fontSize: "0.95rem" }}
            />
            <select
              value={form.paper}
              onChange={(e) => setForm({ ...form, paper: e.target.value })}
              style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", border: "1px solid rgba(255,215,0,0.4)", background: "#ffffff", color: "#0d1b2a", fontSize: "0.95rem" }}
            >
              <option>Paper 1</option>
              <option>Paper 2</option>
              <option>Paper 3</option>
              <option>Paper 4</option>
              <option>Paper 5</option>
              <option>未決定</option>
            </select>
          </div>
          <input
            type="tel"
            required
            placeholder="WhatsApp 電話號碼（+852…）"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", border: "1px solid rgba(255,215,0,0.4)", background: "#ffffff", color: "#0d1b2a", fontSize: "0.95rem" }}
          />
          {status === "error" && (
            <p style={{ margin: 0, color: "#ffb4b4", fontSize: "0.88rem" }}>{error}</p>
          )}
          <button type="submit" className="btn btn-amber" disabled={status === "sending"} style={{ fontSize: "1rem", padding: "0.85rem 1.4rem" }}>
            {status === "sending" ? "傳送中…" : "想知點入行？DM「READY」→"}
          </button>
          <p style={{ margin: 0, fontSize: "0.78rem", opacity: 0.7 }}>
            留低資料 = 我哋 WhatsApp 你傾一次，唔會 spam。條款同條件傾嘅時候講清楚。
          </p>
        </form>
      </section>

      <div style={{ marginTop: "1.5rem", fontSize: "0.9rem", lineHeight: 1.7, opacity: 0.75 }}>
        <p style={{ margin: "0 0 0.3rem" }}>
          <strong>問：</strong>一定要有保險牌照先入到行？<strong>答：</strong>唔使 — 我哋會帶你由考牌開始。
        </p>
        <p style={{ margin: 0 }}>
          <strong>問：</strong>考試費係咪真係全包？<strong>答：</strong>加入團隊後資助，條件好簡單 — 傾一次你就明。
        </p>
      </div>
    </div>
  );
}
