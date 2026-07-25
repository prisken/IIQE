"use client";

import { useEffect, useMemo, useState } from "react";
import { passMark, pickExam } from "@/lib/exam";
import type { PaperMeta, Question } from "@/lib/types";

type Phase = "intro" | "exam" | "review";

export function MockExam({ meta, bank }: { meta: PaperMeta; bank: Question[] }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [paper, setPaper] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [idx, setIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(meta.exam.minutes * 60);

  const [sheetOpen, setSheetOpen] = useState(false);

  const needed = passMark(meta.exam.count, meta.exam.passPercent);

  function start() {
    if (bank.length < meta.exam.count) {
      window.alert(`有效題目不足（${bank.length}/${meta.exam.count}），無法開始模擬試。`);
      return;
    }
    const picked = pickExam(bank, meta.weights, meta.exam.count);
    if (picked.questions.length < meta.exam.count) {
      window.alert(
        `抽題後只有 ${picked.questions.length}/${meta.exam.count} 題，請檢查各章題量是否足夠。`,
      );
      return;
    }
    // Guard: every drawn item must still have 4 options
    const broken = picked.questions.find(
      (q) => !q.options || q.options.length !== 4 || !q.stem?.trim(),
    );
    if (broken) {
      window.alert(`抽到異常題 Q${broken.id}，已中止開考。請重新 extract 題庫。`);
      return;
    }
    setPaper(picked.questions);
    setAnswers({});
    setIdx(0);
    setSecondsLeft(meta.exam.minutes * 60);
    setPhase("exam");
  }

  useEffect(() => {
    if (phase !== "exam") return;
    if (secondsLeft <= 0) {
      setPhase("review");
      return;
    }
    const t = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, secondsLeft]);

  const score = useMemo(() => {
    return paper.reduce((n, q) => n + (answers[q.id] === q.answer ? 1 : 0), 0);
  }, [paper, answers]);

  const q = paper[idx];
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  if (phase === "intro") {
    return (
      <div className="panel" style={{ padding: "1.5rem" }}>
        <h1 className="display" style={{ marginTop: 0, fontSize: "1.9rem" }}>
          模擬試 · Paper {meta.id}
        </h1>
        <p style={{ lineHeight: 1.7 }}>
          共 <strong>{meta.exam.count}</strong> 題，時限 <strong>{meta.exam.minutes}</strong>{" "}
          分鐘，合格 <strong>{meta.exam.passPercent}%</strong>（需對 {needed} 題）。每次開始都會依官方章節比重重新隨機抽題，並自動避開同章過近似的題目。
        </p>
        <div style={{ display: "grid", gap: "0.4rem", margin: "1rem 0 1.4rem" }}>
          {meta.weights.map((w) => (
            <div key={w.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <span>
                Ch{w.id} {w.titleZh}
              </span>
              <span style={{ opacity: 0.75 }}>{w.weight}% ≈ {Math.round((meta.exam.count * w.weight) / 100)} 題</span>
            </div>
          ))}
        </div>
        <button type="button" className="btn btn-primary" onClick={start}>
          開始模擬試
        </button>
      </div>
    );
  }

  if (phase === "review") {
    const passed = score >= needed;
    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <div className="panel" style={{ padding: "1.5rem" }}>
          <h1 className="display" style={{ marginTop: 0 }}>
            {passed ? "合格" : "未合格"}
          </h1>
          <p style={{ fontSize: "1.2rem", margin: "0.4rem 0 0.8rem" }}>
            得分 <strong>{score}</strong> / {paper.length}（需 {needed}）
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-primary" onClick={start}>
              再考一輪（重新抽題）
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setPhase("intro")}>
              返回說明
            </button>
          </div>
        </div>

        {paper.map((item, i) => {
          const user = answers[item.id];
          const ok = user === item.answer;
          return (
            <div key={item.id} className="panel" style={{ padding: "1.1rem 1.25rem" }}>
              <p style={{ margin: 0, fontWeight: 700, color: ok ? "var(--ok)" : "var(--bad)" }}>
                #{i + 1} · Q{item.id} · {item.ref} · {ok ? "正確" : user ? "錯誤" : "未作答"}
              </p>
              <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.65 }}>{item.stem}</p>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                {item.options.map((opt) => (
                  <div
                    key={opt.letter}
                    style={{
                      padding: "0.55rem 0.7rem",
                      borderRadius: 10,
                      border: "1px solid var(--line)",
                      background:
                        opt.letter === item.answer
                          ? "rgba(31,122,76,0.12)"
                          : user === opt.letter
                            ? "rgba(163,59,43,0.1)"
                            : "transparent",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    <strong>{opt.letter}.</strong> {opt.text}
                  </div>
                ))}
              </div>
              <p style={{ marginBottom: 0, marginTop: "0.8rem", lineHeight: 1.65 }}>
                <strong>解釋：</strong>
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  // exam phase
  const answeredCount = Object.keys(answers).length;
  const unanswered = paper.length - answeredCount;

  function handIn() {
    if (unanswered > 0) {
      const ok = window.confirm(
        `尚有 ${unanswered} 題未作答。確定交卷並查看結果？`,
      );
      if (!ok) return;
    }
    setPhase("review");
  }

  return (
    <div className="panel" style={{ padding: "1rem 0.95rem 0.75rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
          position: "sticky",
          top: "var(--header-h)",
          zIndex: 20,
          margin: "-0.15rem -0.15rem 0",
          padding: "0.55rem 0.15rem",
          background: "rgba(255,252,246,0.94)",
          backdropFilter: "blur(8px)",
        }}
      >
        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.92rem" }}>
          {idx + 1}/{paper.length} · {q?.ref}
        </p>
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            color: secondsLeft < 120 ? "var(--bad)" : "var(--sea)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {mm}:{ss}
        </p>
      </div>

      <div style={{ marginTop: "0.65rem", whiteSpace: "pre-wrap", lineHeight: 1.65, fontSize: "1.02rem", overflowWrap: "anywhere" }}>
        {q?.stem}
      </div>

      <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.9rem" }}>
        {q?.options.map((opt) => (
          <button
            key={opt.letter}
            type="button"
            className="option-btn btn btn-ghost"
            style={{
              justifyContent: "flex-start",
              whiteSpace: "pre-wrap",
              borderRadius: 12,
              overflowWrap: "anywhere",
              background: answers[q.id] === opt.letter ? "rgba(15,107,92,0.12)" : undefined,
              borderColor: answers[q.id] === opt.letter ? "var(--sea)" : undefined,
            }}
            onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.letter }))}
          >
            <strong>{opt.letter}.</strong>&nbsp;{opt.text}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-ghost q-sheet-toggle"
        aria-expanded={sheetOpen}
        onClick={() => setSheetOpen((v) => !v)}
      >
        <span>
          題號表 · 已答 {answeredCount}/{paper.length}
        </span>
        <span style={{ opacity: 0.65 }}>{sheetOpen ? "收起 ▲" : "展開 ▼"}</span>
      </button>
      <div className={`q-sheet-grid${sheetOpen ? "" : " is-collapsed"}`}>
        {paper.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setIdx(i);
              setSheetOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `1px solid ${i === idx ? "var(--sea)" : "var(--line)"}`,
              background: answers[item.id] ? "rgba(15,107,92,0.18)" : "transparent",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="sticky-nav-bar exam-nav">
        <div className="exam-nav-row">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={idx === 0}
            onClick={() => {
              setIdx((i) => i - 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            上一題
          </button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={idx >= paper.length - 1}
            onClick={() => {
              setIdx((i) => i + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            下一題
          </button>
        </div>
        <button type="button" className="btn btn-amber exam-submit" onClick={handIn}>
          交卷查看結果
          {unanswered > 0 ? `（未答 ${unanswered}）` : ""}
        </button>
      </div>
    </div>
  );
}
