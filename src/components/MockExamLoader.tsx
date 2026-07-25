"use client";

import { useEffect, useState } from "react";
import { MockExam } from "./MockExam";
import { filterValidQuestions } from "@/lib/questions";
import type { PaperMeta, Question } from "@/lib/types";

export function MockExamLoader({ meta }: { meta: PaperMeta }) {
  const [bank, setBank] = useState<Question[] | null>(null);
  const [rejected, setRejected] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetch(`/data/paper${meta.id}/questions.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: { questions?: Question[] }) => {
        if (!alive) return;
        const list = Array.isArray(d.questions) ? d.questions : [];
        const { valid, rejected: bad } = filterValidQuestions(list);
        setBank(valid);
        setRejected(bad.length);
      })
      .catch(() => {
        if (alive) setError("無法載入題庫。請確認 public/data 已由 npm run extract 產生。");
      });
    return () => {
      alive = false;
    };
  }, [meta.id]);

  if (error) {
    return (
      <p className="panel" style={{ padding: "1.2rem", color: "var(--bad)" }}>
        {error}
      </p>
    );
  }
  if (!bank) {
    return <p className="panel" style={{ padding: "1.2rem" }}>準備模擬試題庫…</p>;
  }
  if (bank.length < meta.exam.count) {
    return (
      <div className="panel" style={{ padding: "1.2rem" }}>
        <p style={{ color: "var(--bad)", marginTop: 0 }}>
          有效題目不足：需要 {meta.exam.count} 題，目前只有 {bank.length} 題
          {rejected ? `（另有 ${rejected} 題因格式異常被排除）` : ""}。
        </p>
        <p style={{ marginBottom: 0 }}>請重新執行 <code>npm run extract</code> 後再試。</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {rejected > 0 && (
        <p
          className="panel"
          style={{
            padding: "0.75rem 1rem",
            margin: 0,
            fontSize: "0.9rem",
            color: "var(--amber)",
            background: "rgba(196,123,44,0.1)",
          }}
        >
          抽題池已排除 {rejected} 道異常題，可用題目 {bank.length} 道。
        </p>
      )}
      <MockExam meta={meta} bank={bank} />
    </div>
  );
}
