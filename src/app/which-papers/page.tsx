"use client";

import { useState } from "react";
import Link from "next/link";

const OPTIONS = [
  { id: "general", label: "一般保險（車、家居、意外、責任…）" },
  { id: "life-no-ila", label: "人壽，唔賣投連" },
  { id: "life-ila", label: "人壽，包括投連" },
  { id: "both", label: "一般 + 人壽" },
  { id: "mpf", label: "要做強積金中介" },
  { id: "undecided", label: "我仲未決定 — 只想先考必考卷" },
] as const;

type OptionId = (typeof OPTIONS)[number]["id"];

const RESULTS: Record<OptionId, { papers: string[]; note: string }> = {
  general: {
    papers: ["Paper 1", "Paper 2"],
    note: "一般保險線 = P1 + P2。",
  },
  "life-no-ila": {
    papers: ["Paper 1", "Paper 3"],
    note: "人壽線（唔包投連）= P1 + P3。",
  },
  "life-ila": {
    papers: ["Paper 1", "Paper 3", "Paper 5"],
    note: "投連線 = P1 + P3 + P5。Paper 5 唔可以代替 Paper 3。",
  },
  both: {
    papers: ["Paper 1", "Paper 2", "Paper 3"],
    note: "一般 + 人壽 = P1 + 2 + 3（要賣投連再加 5）。",
  },
  mpf: {
    papers: ["MPFE（呢個站叫 Paper 4）"],
    note: "強積金中介要考 MPFE，通常另加你條保險線嗰幾份。",
  },
  undecided: {
    papers: ["Paper 1"],
    note: "先考必考卷。合格先再揀線。",
  },
};

export default function WhichPapersPage() {
  const [selected, setSelected] = useState<OptionId | null>(null);
  const result = selected ? RESULTS[selected] : null;

  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 720 }}>
      <p style={{ margin: 0 }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 返去試卷
        </Link>
      </p>

      <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", margin: "0.8rem 0 0.4rem" }}>
        你要考邊份？
      </h1>
      <p style={{ lineHeight: 1.7, opacity: 0.85, fontSize: "0.95rem", maxWidth: 620 }}>
        唔好一次報五份。牌照組合係法定嘅，唔係「愈多愈好」。
        我唔係保監局。以下按公開發牌路線寫。報名前自己上 IA / PEAK 核對。
      </p>

      <div style={{ display: "grid", gap: "0.55rem", margin: "1.2rem 0" }}>
        {OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className="panel"
            style={{
              display: "flex",
              gap: "0.7rem",
              alignItems: "center",
              padding: "0.9rem 1rem",
              cursor: "pointer",
              borderColor: selected === opt.id ? "var(--amber)" : undefined,
              background: selected === opt.id ? "rgba(255,250,235,0.55)" : undefined,
            }}
          >
            <input
              type="radio"
              name="which-papers"
              checked={selected === opt.id}
              onChange={() => setSelected(opt.id)}
            />
            <span style={{ fontSize: "0.95rem" }}>{opt.label}</span>
          </label>
        ))}
      </div>

      {result ? (
        <div className="panel panel-gold-top" style={{ padding: "1.3rem 1.4rem" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "1.05rem" }}>
            你要考：{result.papers.join(" + ")}
          </p>
          <p style={{ margin: "0.3rem 0 0.9rem", fontSize: "0.9rem", opacity: 0.8 }}>{result.note}</p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Link href="/papers/1/drill?ch=3&n=10" className="btn btn-primary" style={{ fontSize: "0.95rem" }}>
              由 Paper 1 10 題開始 →
            </Link>
            <Link
              href={`/papers/${selected === "mpf" ? 4 : selected === "undecided" ? 1 : 1}`}
              className="btn btn-ghost"
              style={{ fontSize: "0.95rem" }}
            >
              帶我去嗰份卷 →
            </Link>
          </div>
        </div>
      ) : null}

      <div className="panel" style={{ marginTop: "1.2rem", padding: "1.1rem 1.3rem", fontSize: "0.88rem", lineHeight: 1.75, opacity: 0.8 }}>
        <p style={{ margin: 0 }}>
          旅遊保險代理人係另一份 Paper VI，呢個站而家未覆蓋。
        </p>
        <p style={{ margin: "0.4rem 0 0" }}>
          豁免（認可專業資格 / 特定經驗）唔可以靠職位名稱自己當豁免。
        </p>
      </div>
    </div>
  );
}
