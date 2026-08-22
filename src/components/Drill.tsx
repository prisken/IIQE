"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { chapterTitle } from "@/lib/labels";
import { defaultDrillChapter, pickDrill } from "@/lib/drill";
import type { PaperMeta, Question, StudyDoc } from "@/lib/types";

type Phase = "pick" | "question" | "result";

/**
 * Guest 10-question drill — the on-ramp.
 * No account. No recruit pitch. First question paints immediately.
 * Banned on this screen: 加入團隊 / 考試費我哋俾 / DM READY / 報 PEAK.
 */
export function Drill({
  meta,
  bank,
  manual,
  initialChapter,
  initialCount,
  initialSeed,
}: {
  meta: PaperMeta;
  bank: Question[];
  manual: StudyDoc;
  initialChapter: string | null;
  initialCount: number;
  initialSeed?: number;
}) {
  const chapters = useMemo(
    () => [...new Set(bank.map((q) => q.chapter))].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)),
    [bank],
  );
  const defaultCh = useMemo(() => defaultDrillChapter(meta.weights), [meta.weights]);

  const [chapter, setChapter] = useState<string>(initialChapter ?? defaultCh);
  const [count, setCount] = useState(initialCount);
  const [seed, setSeed] = useState(initialSeed);
  // Pick immediately on mount when a chapter came via URL — never render 第 1 / 0.
  // Deterministic seed (1) so SSR HTML matches client hydration.
  const [picked, setPicked] = useState<Question[]>(() => {
    if (!initialChapter) return [];
    return pickDrill(bank, {
      chapter: initialChapter,
      count: initialCount,
      seed: initialSeed ?? 1,
    }).questions;
  });
  const [phase, setPhase] = useState<Phase>(() =>
    initialChapter && picked.length ? "question" : "pick",
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongRefs, setWrongRefs] = useState<string[]>([]);

  // Phone soft-save (folded, secondary)
  const [capturePhone, setCapturePhone] = useState("");
  const [captureStatus, setCaptureStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [captureError, setCaptureError] = useState("");

  function start(ch: string, n: number) {
    const spec = { chapter: ch === "random" ? null : ch, count: n, seed: Date.now() ^ Math.floor(Math.random() * 1e9) };
    const { questions } = pickDrill(bank, spec);
    setChapter(ch === "random" ? defaultCh : ch);
    setCount(n);
    setPicked(questions);
    setAnswers({});
    setRevealed({});
    setIdx(0);
    setScore(0);
    setWrongRefs([]);
    setPhase("question");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startAgain(n: number, ch?: string) {
    const spec = { chapter: ch ?? chapter, count: n, seed: Date.now() ^ Math.floor(Math.random() * 1e9) };
    const { questions } = pickDrill(bank, spec);
    setPicked(questions);
    setAnswers({});
    setRevealed({});
    setIdx(0);
    setScore(0);
    setWrongRefs([]);
    setPhase("question");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submitCapture(e: React.FormEvent) {
    e.preventDefault();
    if (!capturePhone.trim()) return;
    setCaptureStatus("sending");
    setCaptureError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: capturePhone.trim(),
          paper: `Paper ${meta.id}`,
          source: "Hub Cards Study",
          role: "Study Lead",
          path: `/papers/${meta.id}/drill`,
          mockScore: `${score}/${picked.length}`,
          whereNow: "溫緊",
          consentExam: true,
          expectations: `快測 Paper ${meta.id}（Ch ${chapter}）：${score}/${picked.length}。`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setCaptureStatus("error");
        setCaptureError("傳送失敗，請再試一次。");
        return;
      }
      setCaptureStatus("done");
    } catch {
      setCaptureStatus("error");
      setCaptureError("網絡錯誤，請再試一次。");
    }
  }

  // ---- Pre-screen (only when landed with no params) ----
  if (phase === "pick") {
    return (
      <div style={{ display: "grid", gap: "1rem", maxWidth: 620 }}>
        <div className="panel" style={{ padding: "1.5rem" }}>
          <p style={{ margin: 0, color: "var(--amber)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            10 題快測 · 唔係模擬試
          </p>
          <h1 className="display" style={{ margin: "0.4rem 0 0.4rem", color: "var(--sea)" }}>
            10 題，知自己企喺邊。
          </h1>
          <p style={{ margin: "0 0 1.2rem", lineHeight: 1.7 }}>
            唔計時。答完即刻講對錯。唔會收你電話。
          </p>

          <div style={{ display: "grid", gap: "0.5rem" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.95rem" }}>抽邊章？</p>
            <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.95rem" }}>
              <input
                type="radio"
                name="drill-pick"
                checked={chapter === defaultCh}
                onChange={() => setChapter(defaultCh)}
              />
              最重章（建議）— {chapterTitle(meta, defaultCh)}
            </label>
            <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.95rem" }}>
              <input
                type="radio"
                name="drill-pick"
                checked={chapter === "random"}
                onChange={() => setChapter("random")}
              />
              隨機 10 題（成份卷）
            </label>
            <select
              aria-label="我自己揀章節"
              value={chapter === "random" ? "" : chapter}
              onChange={(e) => setChapter(e.target.value || "random")}
              style={{ padding: "0.6rem 0.8rem", borderRadius: 10, border: "1px solid var(--line)", fontSize: "0.95rem" }}
            >
              <option value="">（或自己揀章節…）</option>
              {chapters.map((ch) => (
                <option key={ch} value={ch}>
                  {chapterTitle(meta, ch)}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: "1.2rem", fontSize: "1rem", width: "100%" }}
            onClick={() => start(chapter, count)}
          >
            開始
          </button>
        </div>
        <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.65, textAlign: "center" }}>
          呢個分數得你自己知。我唔會當招募名單。
        </p>
      </div>
    );
  }

  // ---- Result ----
  if (phase === "result") {
    const total = picked.length;
    const pct = total ? Math.round((score / total) * 100) : 0;
    const band = score >= 8 ? "ready" : score >= 5 ? "close" : "lost";
    const weak = wrongRefs.slice(0, 3);

    return (
      <div style={{ display: "grid", gap: "1rem", maxWidth: 620 }}>
        <div className="panel" style={{ padding: "1.5rem" }}>
          <p style={{ margin: 0, color: "var(--amber)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            10 題快測 · 唔係模擬試
          </p>
          <h1 className="display" style={{ margin: "0.4rem 0 0.6rem", color: "var(--sea)" }}>
            <span className="stat-num">{score}</span> / {total}
          </h1>

          {band === "ready" && (
            <p style={{ lineHeight: 1.7, margin: 0 }}>
              呢章企得住。可以轉去{" "}
              <Link href={`/papers/${meta.id}/drill?ch=${meta.weights.find((w) => w.id !== chapter)?.id ?? "1"}&n=10`} style={{ color: "var(--amber)", fontWeight: 700 }}>
                另一章
              </Link>
              ，或者坐一次{" "}
              <Link href={`/papers/${meta.id}/mock`} style={{ color: "var(--amber)", fontWeight: 700 }}>
                75 題模擬試
              </Link>
              。
            </p>
          )}
          {band === "close" && (
            <p style={{ lineHeight: 1.7, margin: 0 }}>
              半桶水。而家唔好模擬試 — 再打呢章 10 題（唔同題），或者開{" "}
              <Link href={`/papers/${meta.id}/study?ch=${chapter}`} style={{ color: "var(--amber)", fontWeight: 700 }}>
                呢章研習
              </Link>
              。
            </p>
          )}
          {band === "lost" && (
            <p style={{ lineHeight: 1.7, margin: 0 }}>
              未讀過嘅正常分數。去{" "}
              <Link href={`/papers/${meta.id}/study?ch=${chapter}`} style={{ color: "var(--amber)", fontWeight: 700 }}>
                研習
              </Link>
              ，唔好再盲操。
            </p>
          )}

          {weak.length > 0 && (
            <p style={{ margin: "0.9rem 0 0", fontSize: "0.9rem", opacity: 0.8 }}>
              錯題小節：{weak.join("、")}
            </p>
          )}

          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1.1rem" }}>
            {band === "ready" && (
              <>
                <button type="button" className="btn btn-primary" onClick={() => startAgain(10)}>
                  再測 10 題（唔同題）
                </button>
                <Link href={`/papers/${meta.id}/mock`} className="btn btn-ghost">
                  開始 75 題模擬試
                </Link>
              </>
            )}
            {band === "close" && (
              <>
                <button type="button" className="btn btn-primary" onClick={() => startAgain(10)}>
                  再打呢章 10 題
                </button>
                <Link href={`/papers/${meta.id}/study?ch=${chapter}`} className="btn btn-ghost">
                  開呢章研習
                </Link>
              </>
            )}
            {band === "lost" && (
              <>
                <Link href={`/papers/${meta.id}/study?ch=${chapter}`} className="btn btn-primary">
                  開 Ch {chapter} 研習
                </Link>
                <button type="button" className="btn btn-ghost" onClick={() => startAgain(5)}>
                  再試 5 題
                </button>
              </>
            )}
          </div>
        </div>

        {/* Soft save — folded, not the main CTA */}
        <div className="panel" style={{ padding: "1.3rem 1.4rem" }}>
          {captureStatus === "done" ? (
            <p style={{ margin: 0, textAlign: "center", fontWeight: 700, color: "var(--ok)" }}>
              ✅ 已儲存。下次打開唔使從頭。
            </p>
          ) : (
            <>
              <h3 className="display" style={{ margin: "0 0 0.3rem", color: "var(--sea)", fontSize: "1rem" }}>
                想儲呢 10 題？
              </h3>
              <p style={{ margin: "0 0 0.8rem", fontSize: "0.88rem", lineHeight: 1.6, opacity: 0.8 }}>
                留電話，下次打開唔使從頭。溫書用途。唔會 spam。
              </p>
              <form onSubmit={submitCapture} style={{ display: "grid", gap: "0.55rem" }}>
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="WhatsApp 電話號碼（+852…）"
                  aria-label="WhatsApp 電話號碼"
                  value={capturePhone}
                  onChange={(e) => setCapturePhone(e.target.value)}
                  style={{ padding: "0.65rem 0.85rem", borderRadius: 10, border: "1px solid var(--line)", fontSize: "0.92rem" }}
                />
                {captureStatus === "error" && (
                  <p style={{ margin: 0, color: "var(--bad)", fontSize: "0.85rem" }}>{captureError}</p>
                )}
                <button type="submit" className="btn btn-ghost" disabled={captureStatus === "sending"} style={{ fontSize: "0.92rem" }}>
                  {captureStatus === "sending" ? "儲存中…" : "儲存進度"}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ margin: 0, fontSize: "0.8rem", opacity: 0.65, textAlign: "center" }}>
          呢個分數得你自己知。我唔會當招募名單。
        </p>
      </div>
    );
  }

  // ---- Question phase ----
  // Never leave a human on 第 1 / 0 — if the bootstrap came up empty,
  // show a fallback with two exits instead of a dead counter.
  if (picked.length === 0) {
    return (
      <div style={{ display: "grid", gap: "1rem", maxWidth: 620 }}>
        <div className="panel" style={{ padding: "1.5rem" }}>
          <p style={{ margin: 0, color: "var(--amber)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            10 題快測
          </p>
          <h1 className="display" style={{ margin: "0.4rem 0 0.6rem", color: "var(--sea)" }}>
            呢 10 題而家出唔到。
          </h1>
          <p style={{ margin: "0 0 1.1rem", lineHeight: 1.7, opacity: 0.85 }}>
            題庫暫時載入唔到，唔使等。
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Link href={`/papers/${meta.id}/study?ch=${chapter}`} className="btn btn-primary" style={{ fontSize: "0.95rem" }}>
              改做研習 Ch {chapter} →
            </Link>
            <a
              href={`https://wa.me/85260147819?text=${encodeURIComponent("你好，題庫出唔到，想話你知。")}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-amber"
              style={{ fontSize: "0.95rem" }}
            >
              WhatsApp 兩個字：題庫
            </a>
          </div>
        </div>
      </div>
    );
  }

  const q = picked[idx];
  const selected = answers[q?.id ?? ""];
  const isRevealed = revealed[q?.id ?? ""] ?? false;
  const answeredCount = Object.keys(answers).length;

  function pick(letter: string) {
    if (isRevealed) return;
    setAnswers((a) => ({ ...a, [q.id]: letter }));
    setRevealed((r) => ({ ...r, [q.id]: true }));
  }

  function next() {
    const correct = answers[q.id] === q.answer;
    if (correct) setScore((s) => s + 1);
    else setWrongRefs((w) => (w.includes(q.ref) ? w : [...w, q.ref]));
    if (idx + 1 >= picked.length) {
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function endEarly() {
    const ok = window.confirm("而家結束會睇到而家分數。確定？");
    if (!ok) return;
    // count answered so far as score
    const correct = picked.filter((item, i) => answers[item.id] === item.answer && i < idx).length;
    setScore(correct);
    setWrongRefs(
      picked
        .filter((item, i) => i < idx && answers[item.id] !== item.answer)
        .map((item) => item.ref)
        .filter((ref, i, arr) => arr.indexOf(ref) === i),
    );
    setPhase("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const answered = Boolean(selected);

  return (
    <div style={{ display: "grid", gap: "1rem", maxWidth: 620 }}>
      {/* Top bar */}
      <div className="panel" style={{ padding: "0.8rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: "0.92rem" }}>
            Paper {meta.id} · {chapterTitle(meta, chapter)}
          </p>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--sea)", fontSize: "0.92rem" }}>
            第 {idx + 1} / {picked.length}
          </p>
        </div>
        <div style={{ height: "0.5rem", borderRadius: 999, background: "rgba(13,27,42,0.1)", overflow: "hidden", marginTop: "0.5rem" }}>
          <div
            style={{
              height: "100%",
              width: `${(answeredCount / picked.length) * 100}%`,
              borderRadius: 999,
              background: "var(--amber-bright)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
        <div style={{ textAlign: "right", marginTop: "0.4rem" }}>
          <button type="button" className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "0.3rem 0.7rem" }} onClick={endEarly}>
            結束
          </button>
        </div>
      </div>

      {/* Stem */}
      <div className="panel" style={{ padding: "1.1rem 1.2rem" }}>
        <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.65, fontSize: "1.02rem", overflowWrap: "anywhere" }}>
          {q?.stem}
        </p>
      </div>

      {/* Options */}
      <div className="panel" style={{ padding: "1rem 1rem 0.9rem" }}>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {q?.options.map((opt) => {
            const showKey = isRevealed && opt.letter === q.answer;
            const wrongPick = isRevealed && selected === opt.letter && opt.letter !== q.answer;
            return (
              <button
                key={opt.letter}
                type="button"
                className="option-btn"
                aria-pressed={selected === opt.letter}
                disabled={isRevealed && !showKey && !wrongPick}
                onClick={() => pick(opt.letter)}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${showKey ? "var(--ok)" : wrongPick ? "var(--bad)" : "var(--line)"}`,
                  background: showKey
                    ? "rgba(31,122,76,0.1)"
                    : wrongPick
                      ? "rgba(163,59,43,0.08)"
                      : "rgba(255,255,255,0.5)",
                  padding: "0.7rem 0.8rem",
                  cursor: isRevealed ? "default" : "pointer",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5,
                  overflowWrap: "anywhere",
                  textAlign: "left",
                }}
              >
                <strong>{opt.letter}.</strong> {opt.text}
              </button>
            );
          })}
        </div>

        {/* Instant right/wrong feedback */}
        {isRevealed && q && (
          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.8rem 0.9rem",
              borderRadius: 12,
              background: selected === q.answer ? "rgba(31,122,76,0.08)" : "rgba(163,59,43,0.08)",
              border: `1px solid ${selected === q.answer ? "var(--ok)" : "var(--bad)"}`,
            }}
          >
            {selected === q.answer ? (
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: "var(--ok)" }}>啱。</strong> {q.explanation}
              </p>
            ) : (
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: "var(--bad)" }}>正確係 {q.answer}。</strong> {q.explanation}
              </p>
            )}
            <Link
              href={`/papers/${meta.id}/study?ch=${chapter}`}
              style={{ display: "inline-block", marginTop: "0.5rem", color: "var(--amber)", fontWeight: 700, fontSize: "0.88rem" }}
            >
              返去睇呢段天書 →
            </Link>
          </div>
        )}

        {/* Next */}
        <div style={{ marginTop: "1rem" }}>
          <button
            type="button"
            className={`btn ${answered ? "btn-primary" : "btn-ghost"}`}
            disabled={!answered}
            onClick={next}
            style={{ width: "100%", fontSize: "0.95rem" }}
          >
            {idx + 1 >= picked.length ? "睇結果" : "下一題"}
          </button>
        </div>
      </div>
    </div>
  );
}
