"use client";

import { useEffect, useMemo, useState } from "react";
import { chapterTitle } from "@/lib/labels";
import type { PaperMeta, Question } from "@/lib/types";

export function QuestionBank({
  meta,
  questions,
}: {
  meta: PaperMeta;
  questions: Question[];
}) {
  const chapters = useMemo(() => {
    const ids = [...new Set(questions.map((q) => q.chapter))].sort(
      (a, b) => Number(a) - Number(b) || a.localeCompare(b),
    );
    return ids;
  }, [questions]);

  const [chapter, setChapter] = useState(chapters[0] || "1");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [chaptersOpen, setChaptersOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px)");
    const sync = () => setChaptersOpen(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const list = useMemo(
    () => questions.filter((q) => q.chapter === chapter).sort((a, b) => a.id - b.id),
    [questions, chapter],
  );
  const q = list[Math.min(index, Math.max(list.length - 1, 0))];

  function goChapter(ch: string) {
    setChapter(ch);
    setIndex(0);
    setRevealed(false);
    setPicked(null);
    setChaptersOpen(false);
  }

  function go(delta: number) {
    setIndex((i) => Math.min(Math.max(i + delta, 0), list.length - 1));
    setRevealed(false);
    setPicked(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!q) {
    return <p>此章暫無題目。</p>;
  }

  const optionLetters = q.options.map((o) => o.letter).join("");
  const optionsOk = optionLetters === "ABCD" && q.options.length === 4;
  const chapterCount = questions.filter((x) => x.chapter === chapter).length;

  return (
    <div className="qbank">
      <div className="panel chapter-collapse" style={{ padding: "0.55rem 0.65rem" }}>
        <button
          type="button"
          className="btn btn-ghost chapter-collapse-toggle"
          aria-expanded={chaptersOpen}
          onClick={() => setChaptersOpen((v) => !v)}
        >
          <span>
            {chapterTitle(meta, chapter)} · {chapterCount} 題
          </span>
          <span style={{ opacity: 0.65 }}>{chaptersOpen ? "收起 ▲" : "選章節 ▼"}</span>
        </button>
        <div className={`chapter-collapse-body${chaptersOpen ? "" : " is-collapsed"}`}>
          {chapters.map((ch) => {
            const count = questions.filter((x) => x.chapter === ch).length;
            return (
              <button
                key={ch}
                type="button"
                className={`btn ${ch === chapter ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "0.4rem 0.7rem", fontSize: "0.88rem" }}
                onClick={() => goChapter(ch)}
              >
                {chapterTitle(meta, ch)} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="panel" style={{ padding: "1rem 0.95rem 0.75rem" }}>
        <p style={{ margin: 0, color: "var(--sea)", fontWeight: 600, fontSize: "0.9rem" }}>
          {index + 1} / {list.length} · Q{q.id} · {q.ref}
        </p>

        <div style={{ marginTop: "0.85rem", whiteSpace: "pre-wrap", lineHeight: 1.65, fontSize: "1.02rem", overflowWrap: "anywhere" }}>
          {q.stem}
        </div>

        {!optionsOk && (
          <p
            style={{
              marginTop: "0.85rem",
              padding: "0.65rem 0.8rem",
              borderRadius: 10,
              background: "rgba(163,59,43,0.1)",
              color: "var(--bad)",
              fontSize: "0.88rem",
            }}
          >
            此題選項資料異常（預期 A–D，實際：{optionLetters || "無"}）。
          </p>
        )}

        <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.95rem" }}>
          {q.options.map((opt) => {
            const selected = picked === opt.letter;
            const showKey = revealed && opt.letter === q.answer;
            const wrong = revealed && selected && opt.letter !== q.answer;
            return (
              <button
                key={opt.letter}
                type="button"
                className="option-btn"
                onClick={() => setPicked(opt.letter)}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${showKey ? "var(--ok)" : wrong ? "var(--bad)" : selected ? "var(--sea)" : "var(--line)"}`,
                  background: showKey
                    ? "rgba(31,122,76,0.1)"
                    : wrong
                      ? "rgba(163,59,43,0.08)"
                      : selected
                        ? "rgba(15,107,92,0.08)"
                        : "rgba(255,255,255,0.5)",
                  padding: "0.7rem 0.8rem",
                  cursor: "pointer",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                  overflowWrap: "anywhere",
                }}
              >
                <strong>{opt.letter}.</strong> {opt.text}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className={`btn ${revealed ? "btn-ghost" : "btn-amber"}`}
            style={{ width: "100%" }}
            onClick={() => setRevealed((v) => !v)}
          >
            {revealed ? "重新遮罩答案" : "揭曉答案與解釋"}
          </button>
        </div>

        <div
          className={`reveal-cover ${revealed ? "open" : ""}`}
          style={{
            marginTop: "0.85rem",
            padding: "0.85rem",
            borderRadius: 12,
            background: "rgba(15,107,92,0.06)",
            border: "1px solid var(--line)",
          }}
        >
          <p style={{ margin: "0 0 0.35rem", fontWeight: 700 }}>正確答案：{q.answer}</p>
          <p style={{ margin: 0, lineHeight: 1.65, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{q.explanation}</p>
        </div>

        <div className="sticky-nav-bar">
          <button type="button" className="btn btn-ghost" disabled={index === 0} onClick={() => go(-1)}>
            上一題
          </button>
          <button type="button" className="btn btn-ghost" disabled={index >= list.length - 1} onClick={() => go(1)}>
            下一題
          </button>
        </div>
      </div>
    </div>
  );
}
