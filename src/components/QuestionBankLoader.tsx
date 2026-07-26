"use client";

import { useEffect, useState } from "react";
import { QuestionBank } from "./QuestionBank";
import { filterValidQuestions } from "@/lib/questions";
import type { PaperMeta, Question, StudyDoc } from "@/lib/types";

export function QuestionBankLoader({ meta }: { meta: PaperMeta }) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [manual, setManual] = useState<StudyDoc | null>(null);
  const [rejected, setRejected] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch(`/data/paper${meta.id}/questions.json`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
      fetch(`/data/paper${meta.id}/manual.json`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      }),
    ])
      .then(([qData, manualData]: [{ questions?: Question[] }, StudyDoc]) => {
        if (!alive) return;
        const list = Array.isArray(qData.questions) ? qData.questions : [];
        const { valid, rejected: bad } = filterValidQuestions(list);
        setQuestions(valid);
        setRejected(bad.length);
        setManual(manualData);
      })
      .catch(() => {
        if (alive) setError("無法載入題庫或研習手冊。請確認 public/data 已由 npm run extract 產生。");
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
  if (!questions || !manual) {
    return <p className="panel" style={{ padding: "1.2rem" }}>載入題庫中…</p>;
  }
  if (!questions.length) {
    return (
      <p className="panel" style={{ padding: "1.2rem", color: "var(--bad)" }}>
        沒有可顯示的有效題目（選項須為完整 A–D）。
      </p>
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
            color: "var(--bad)",
            background: "rgba(163,59,43,0.08)",
          }}
        >
          已自動略過 {rejected} 道資料異常題目，其餘 {questions.length} 題可正常練習。
        </p>
      )}
      <QuestionBank meta={meta} questions={questions} manual={manual} />
    </div>
  );
}
