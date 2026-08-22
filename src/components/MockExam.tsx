"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StudyManualLink } from "./StudyManualLink";
import { passMark, pickExam } from "@/lib/exam";
import { FEE_TERMS_CONFIRMED } from "@/lib/owner";
import {
  clearMockExamSession,
  loadMockExamSession,
  saveMockExamSession,
} from "@/lib/sessionState";
import type { PaperMeta, Question, StudyDoc } from "@/lib/types";

type Phase = "intro" | "exam" | "review";

export function MockExam({
  meta,
  bank,
  manual,
  resume = false,
}: {
  meta: PaperMeta;
  bank: Question[];
  manual: StudyDoc;
  resume?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [paper, setPaper] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flags, setFlags] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(meta.exam.minutes * 60);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [savedReview, setSavedReview] = useState<ReturnType<typeof loadMockExamSession>>(null);
  const [ready, setReady] = useState(!resume);
  const [examResume, setExamResume] = useState<ReturnType<typeof loadMockExamSession> | null>(null);
  const [confirmingEnd, setConfirmingEnd] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<"all" | "wrong" | "flagged">("all");

  // Soft-capture state: offer "save your progress" with a phone number
  // AFTER the mock — the warmest possible recruitment moment.
  const [capturePhone, setCapturePhone] = useState("");
  const [captureStatus, setCaptureStatus] = useState<
    "idle" | "sending" | "done" | "error"
  >("idle");
  const [captureError, setCaptureError] = useState("");

  const needed = passMark(meta.exam.count, meta.exam.passPercent);

  useEffect(() => {
    const saved = loadMockExamSession(meta.id);
    setSavedReview(saved);
    if (saved?.phase === "exam" && saved.paper.length) {
      // Mid-exam resume — only offered, never forced.
      setExamResume(saved);
      setReady(true);
      return;
    }
    if (resume && saved?.phase === "review" && saved.paper.length) {
      setPaper(saved.paper);
      setAnswers(saved.answers);
      setPhase("review");
      setReady(true);
      window.setTimeout(() => {
        let focusId = saved.focusQuestionId;
        try {
          const raw = sessionStorage.getItem(`iiqe:mock-focus:${meta.id}`);
          if (raw) {
            focusId = Number(raw);
            sessionStorage.removeItem(`iiqe:mock-focus:${meta.id}`);
          }
        } catch {
          // ignore
        }
        if (!focusId) return;
        document.getElementById(`mock-q-${focusId}`)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
      return;
    }
    setReady(true);
  }, [meta.id, resume]);

  useEffect(() => {
    if (phase !== "review" && phase !== "exam") return;
    if (!paper.length) return;
    saveMockExamSession(meta.id, {
      phase,
      paper,
      answers,
      ...(phase === "exam"
        ? { idx, secondsLeft, flags, savedAt: Date.now() }
        : {}),
    });
  }, [phase, paper, answers, idx, secondsLeft, flags, meta.id]);

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
    const broken = picked.questions.find(
      (q) => !q.options || q.options.length !== 4 || !q.stem?.trim(),
    );
    if (broken) {
      window.alert(`抽到異常題 Q${broken.id}，已中止開考。請重新 extract 題庫。`);
      return;
    }
    clearMockExamSession(meta.id);
    setPaper(picked.questions);
    setAnswers({});
    setFlags([]);
    setIdx(0);
    setSecondsLeft(meta.exam.minutes * 60);
    setPhase("exam");
  }

  function resumeExam() {
    const saved = examResume;
    if (!saved) return;
    setPaper(saved.paper);
    setAnswers(saved.answers ?? {});
    setFlags(saved.flags ?? []);
    setIdx(saved.idx ?? 0);
    setSecondsLeft(saved.secondsLeft ?? meta.exam.minutes * 60);
    setExamResume(null);
    setPhase("exam");
  }

  function abandonExam() {
    clearMockExamSession(meta.id);
    setExamResume(null);
    setPhase("intro");
  }

  function toggleFlag(id: number) {
    setFlags((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
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

  if (!ready) {
    return <p className="panel" style={{ padding: "1.2rem" }}>載入模擬試…</p>;
  }

  if (phase === "intro") {
    return (
      <div className="panel" style={{ padding: "1.5rem" }}>
        {examResume ? (
          <div
            style={{
              marginBottom: "1.2rem",
              padding: "0.9rem 1rem",
              borderRadius: 12,
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.5)",
            }}
          >
            <p style={{ margin: "0 0 0.6rem", fontWeight: 700, fontSize: "0.95rem" }}>
              你上次做到第 {Math.min((examResume.idx ?? 0) + 1, examResume.paper.length)} 題，
              仲有 {Math.floor((examResume.secondsLeft ?? 0) / 60)} 分鐘。
            </p>
            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-primary" style={{ fontSize: "0.9rem" }} onClick={resumeExam}>
                接返
              </button>
              <button type="button" className="btn btn-ghost" style={{ fontSize: "0.9rem" }} onClick={abandonExam}>
                放棄，重新抽題
              </button>
            </div>
          </div>
        ) : null}
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
              <span style={{ opacity: 0.75 }}>
                {w.weight}% ≈ {Math.round((meta.exam.count * w.weight) / 100)} 題
              </span>
            </div>
          ))}
        </div>
        {savedReview?.phase === "review" && savedReview.paper.length > 0 ? (
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginRight: "0.6rem" }}
            onClick={() => {
              setPaper(savedReview.paper);
              setAnswers(savedReview.answers);
              setPhase("review");
            }}
          >
            繼續上次結果
          </button>
        ) : null}
        <button type="button" className="btn btn-primary" onClick={start}>
          開始模擬試
        </button>
      </div>
    );
  }

  if (phase === "review") {
    const passed = score >= needed;
    const pct = Math.round((score / paper.length) * 100);

    const filteredPaper = paper.filter((item) => {
      if (reviewFilter === "wrong") return answers[item.id] !== item.answer;
      if (reviewFilter === "flagged") return flags.includes(item.id);
      return true;
    });

    // Weak topics = chapters/refs where the user answered wrong.
    const wrongRefs = paper
      .filter((item) => answers[item.id] !== item.answer)
      .map((item) => item.ref)
      .filter((ref, i, arr) => arr.indexOf(ref) === i);
    const weakTopics = wrongRefs.slice(0, 5);

    const waText = encodeURIComponent(
      `你好，我啱啱喺 Hub Cards 完成咗 Paper ${meta.id} 模擬試，得分 ${score}/${paper.length}（${pct}%）。想傾下之後點行。`
    );
    const waHref = `https://wa.me/85260147819?text=${waText}`;

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
            expectations: `模擬試 Paper ${meta.id}：${score}/${paper.length}（${pct}%）${passed ? "，合格" : "，未達標"}。弱項：${weakTopics.join(", ") || "—"}`,
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

    return (
      <div style={{ display: "grid", gap: "1rem" }}>
        <div className="panel" style={{ padding: "1.5rem" }}>
          <h1 className="display" style={{ marginTop: 0 }}>
            {passed ? "合格 🎉" : "未合格 💪"}
          </h1>
          <p style={{ fontSize: "1.2rem", margin: "0.4rem 0 0.8rem" }}>
            得分 <strong className="stat-num">{score}</strong> / {paper.length}（需 {needed}）
          </p>
          {/* Score bar — instant read of where you stand */}
          <div
            role="img"
            aria-label={`得分率 ${pct}%${passed ? "，合格" : "，未達合格線"}`}
            style={{
              height: "0.7rem",
              borderRadius: 999,
              background: "rgba(13, 27, 42, 0.1)",
              overflow: "hidden",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                borderRadius: 999,
                background: passed ? "var(--ok)" : "var(--amber-bright)",
                transition: "width 0.6s ease",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <button type="button" className="btn btn-primary" onClick={start}>
              再考一輪（重新抽題）
            </button>
            <Link href={`/papers/${meta.id}/questions`} className="btn btn-ghost">
              返題庫操 →
            </Link>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                clearMockExamSession(meta.id);
                setPhase("intro");
              }}
            >
              返回說明
            </button>
          </div>
        </div>

        {/* The funnel moment — three states by score: lost / close / ready */}
        {(() => {
          const lost = pct < 50;
          const close = pct >= 50 && !passed;
          const diff = Math.max(0, needed - score);
          const weakest = weakTopics[0] ? `Ch${weakTopics[0].split(".")[0]}` : "弱項章節";

          if (lost) {
            return (
              <div
                className="panel"
                style={{
                  padding: "1.3rem 1.4rem",
                  background: "var(--sea)",
                  color: "#e8eef5",
                  borderColor: "rgba(255,215,0,0.35)",
                }}
              >
                <h2 className="display" style={{ margin: "0 0 0.4rem", color: "#fff", fontSize: "1.2rem" }}>
                  而家未到考場水平。正常。唔好報名。
                </h2>
                <p style={{ margin: "0 0 1rem", lineHeight: 1.65, opacity: 0.9 }}>
                  最傷嘅章：{weakTopics.join("、") || "幾個章節"}。再操散題唔會救到 — 你需要一條
                  7 日線，每日只打最重嗰兩章。
                </p>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  <a
                    href={`https://wa.me/85260147819?text=${encodeURIComponent(
                      `你好，我啱啱 Paper ${meta.id} mock ${score}/${paper.length}，想要 7 日溫書表。`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-amber"
                    style={{ fontSize: "0.95rem" }}
                  >
                    用 WhatsApp 拎 7 日溫書表 →
                  </a>
                  <Link href={`/papers/${meta.id}/questions`} className="btn btn-ghost" style={{ fontSize: "0.95rem", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
                    先打最弱章 10 題 →
                  </Link>
                </div>
                <p style={{ margin: "0.7rem 0 0", fontSize: "0.82rem", opacity: 0.75 }}>
                  我會問你一星期有幾多鐘，然後俾表。唔會傾入行。
                </p>
              </div>
            );
          }

          if (close) {
            return (
              <div
                className="panel"
                style={{
                  padding: "1.3rem 1.4rem",
                  background: "var(--sea)",
                  color: "#e8eef5",
                  borderColor: "rgba(255,215,0,0.35)",
                }}
              >
                <h2 className="display" style={{ margin: "0 0 0.4rem", color: "#fff", fontSize: "1.2rem" }}>
                  差 {diff} 題。已經近。
                </h2>
                <p style={{ margin: "0 0 1rem", lineHeight: 1.65, opacity: 0.9 }}>
                  你唔係唔識，係 {weakest} 未穩。真試係 120 分鐘、70% 合格線。而家唔好轉去操第二份卷。
                </p>
                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                  <Link href={`/papers/${meta.id}/questions`} className="btn btn-amber" style={{ fontSize: "0.95rem" }}>
                    針對弱項再操 20 題 →
                  </Link>
                  <a
                    href={`https://wa.me/85260147819?text=${encodeURIComponent(
                      `你好，我啱啱 Paper ${meta.id} mock ${score}/${paper.length}，弱項 ${weakest}，想知下一步。`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                    style={{ fontSize: "0.95rem", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
                  >
                    想有人睇下你錯邊？WhatsApp 我 →
                  </a>
                </div>
                <p style={{ margin: "0.7rem 0 0", fontSize: "0.82rem", opacity: 0.75 }}>
                  {FEE_TERMS_CONFIRMED
                    ? `未合格唔好申請報銷。先打穿 ${needed}。`
                    : `先打穿 ${needed}，先諗下一步。`}
                </p>
              </div>
            );
          }

          // ready — the only place career gets mentioned
          return (
            <div
              className="panel"
              style={{
                padding: "1.3rem 1.4rem",
                background: "var(--sea)",
                color: "#e8eef5",
                borderColor: "rgba(255,215,0,0.35)",
              }}
            >
              <h2 className="display" style={{ margin: "0 0 0.4rem", color: "#fff", fontSize: "1.2rem" }}>
                你而家達考試合格線。
              </h2>
              <p style={{ margin: "0 0 1rem", lineHeight: 1.65, opacity: 0.9 }}>
                {score}/{paper.length}。真試係 120 分鐘、70%。到達呢個位嘅人，通常兩星期內可以坐真場。
                下一步唔係「加入團隊」— 係報 PEAK。
              </p>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <a
                  href={`https://wa.me/85260147819?text=${encodeURIComponent(
                    `你好，我啱啱 Paper ${meta.id} mock ${score}/${paper.length}，想問報名。`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-amber"
                  style={{ fontSize: "0.95rem" }}
                >
                  一齊揀場次 · 報 PEAK →
                </a>
                <a
                  href="https://www.vtc.edu.hk/cpdc"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                  style={{ fontSize: "0.95rem", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}
                >
                  我自己去 PEAK 報（官方）
                </a>
              </div>
              <p style={{ margin: "0.7rem 0 0", fontSize: "0.82rem", opacity: 0.75 }}>
                {FEE_TERMS_CONFIRMED ? (
                  <>
                    合格後考試費可申請報銷。條款寫死喺{" "}
                    <Link href="/exam-fee" style={{ color: "var(--amber-bright)", fontWeight: 700 }}>
                      呢頁
                    </Link>
                    。唔申請、唔加入，呢個站照用。
                  </>
                ) : (
                  "唔申請、唔加入，呢個站照用。"
                )}
              </p>
            </div>
          );
        })()}

        {/* Soft-capture: save your progress with a phone number — the warm lead moment */}
        <div className="panel" style={{ padding: "1.3rem 1.4rem" }}>
          {captureStatus === "done" ? (
            <div style={{ textAlign: "center", padding: "0.4rem 0" }}>
              <div style={{ fontSize: "2.2rem", marginBottom: "0.4rem" }}>✅</div>
              <h3 className="display" style={{ margin: "0 0 0.3rem", color: "var(--sea)" }}>
                進度已儲存！
              </h3>
              <p style={{ margin: "0 0 0.9rem", fontSize: "0.92rem", lineHeight: 1.65, opacity: 0.8 }}>
                我哋會 WhatsApp 你，傾下你嘅弱項點操、同埋之後可以點行。溫書工具照樣免費，唔會迫你。
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="btn btn-amber"
                style={{ fontSize: "0.95rem" }}
              >
                即刻 WhatsApp 傾 →
              </a>
            </div>
          ) : (
            <>
              <h3 className="display" style={{ margin: "0 0 0.3rem", color: "var(--sea)", fontSize: "1.1rem" }}>
                🎯 儲存你嘅進度
              </h3>
              <p style={{ margin: "0 0 0.9rem", fontSize: "0.92rem", lineHeight: 1.65, opacity: 0.8 }}>
                留低電話，我哋幫你記低今次得分（{score}/{paper.length} · {pct}%）同弱項
                （{weakTopics.join("、") || "—"}），之後跟進你嘅溫書進度。唔會 spam，隨時可以停。
              </p>
              <form onSubmit={submitCapture} style={{ display: "grid", gap: "0.6rem" }}>
                <input
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="WhatsApp 電話號碼（+852…）"
                  aria-label="WhatsApp 電話號碼"
                  value={capturePhone}
                  onChange={(e) => setCapturePhone(e.target.value)}
                  style={{
                    padding: "0.7rem 0.9rem",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "#fff",
                    color: "#0d1b2a",
                    fontSize: "0.95rem",
                  }}
                />
                {captureStatus === "error" && (
                  <p style={{ margin: 0, color: "var(--bad)", fontSize: "0.85rem" }}>{captureError}</p>
                )}
                <button type="submit" className="btn btn-primary" disabled={captureStatus === "sending"} style={{ fontSize: "0.95rem" }}>
                  {captureStatus === "sending" ? "儲存中…" : "儲存進度，我哋跟進你 →"}
                </button>
              </form>
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", opacity: 0.65 }}>
                淨係用嚟跟進你嘅溫書進度。唔想留？冇問題 — 工具照樣免費。
              </p>
            </>
          )}
        </div>

        {/* Review filter — 全部 / 淨係錯 / 淨係旗標 */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["all", "wrong", "flagged"] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`btn ${reviewFilter === f ? "btn-primary" : "btn-ghost"}`}
              style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
              onClick={() => setReviewFilter(f)}
            >
              {f === "all" ? "全部" : f === "wrong" ? "淨係錯" : "淨係旗標"}
            </button>
          ))}
        </div>

        {filteredPaper.map((item, i) => {
          const user = answers[item.id];
          const ok = user === item.answer;
          return (
            <div
              key={item.id}
              id={`mock-q-${item.id}`}
              className="panel"
              style={{ padding: "1.1rem 1.25rem", scrollMarginTop: "calc(var(--header-h) + 12px)" }}
            >
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
              <div style={{ marginTop: "0.8rem" }}>
                <p style={{ margin: 0, lineHeight: 1.65 }}>
                  <strong>解釋：</strong>
                  {item.explanation}
                </p>
                <StudyManualLink paperId={meta.id} question={item} manual={manual} from="mock" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const unanswered = paper.length - answeredCount;
  const flaggedCount = flags.length;

  function handIn() {
    if (unanswered > 0 || flaggedCount > 0) {
      setConfirmingEnd(true);
      return;
    }
    setPhase("review");
  }

  function confirmHandIn() {
    setConfirmingEnd(false);
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

      <button
        type="button"
        className="btn btn-ghost"
        aria-pressed={flags.includes(q?.id)}
        style={{
          fontSize: "0.82rem",
          padding: "0.35rem 0.7rem",
          borderColor: flags.includes(q?.id) ? "var(--amber)" : undefined,
          background: flags.includes(q?.id) ? "rgba(212,175,55,0.14)" : undefined,
        }}
        onClick={() => toggleFlag(q.id)}
      >
        {flags.includes(q.id) ? "🏳️ 已旗標" : "旗標"}
      </button>

      <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.9rem" }}>
        {q?.options.map((opt) => (
          <button
            key={opt.letter}
            type="button"
            className="option-btn btn btn-ghost"
            aria-pressed={answers[q.id] === opt.letter}
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
          題目紙 · 已答 {answeredCount}/{paper.length}
          {flaggedCount > 0 ? ` · 旗標 ${flaggedCount}` : ""}
        </span>
        <span style={{ opacity: 0.65 }}>{sheetOpen ? "收起 ▲" : "展開 ▼"}</span>
      </button>
      <div className={`q-sheet-grid${sheetOpen ? "" : " is-collapsed"}`}>
        {paper.map((item, i) => {
          const isFlagged = flags.includes(item.id);
          const isAnswered = Boolean(answers[item.id]);
          return (
            <button
              key={item.id}
              type="button"
              title={isFlagged ? "旗標" : isAnswered ? "已答" : "未答"}
              onClick={() => {
                setIdx(i);
                setSheetOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                border: `1px solid ${i === idx ? "var(--sea)" : isFlagged ? "rgba(212,175,55,0.9)" : "var(--line)"}`,
                background: isAnswered
                  ? isFlagged
                    ? "rgba(15,107,92,0.18)"
                    : "rgba(15,107,92,0.28)"
                  : isFlagged
                    ? "rgba(212,175,55,0.25)"
                    : "transparent",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: i === idx ? 700 : 400,
                color: i === idx ? "var(--sea-deep)" : undefined,
              }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", fontSize: "0.78rem", opacity: 0.75, marginTop: "0.4rem" }}>
        <span>■ 已答</span>
        <span>🏳️ 旗標</span>
        <span>□ 未答</span>
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
          結束交卷
          {unanswered > 0 ? `（未答 ${unanswered}）` : ""}
        </button>
      </div>

      {confirmingEnd && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="確認交卷"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            background: "rgba(13,27,42,0.45)",
          }}
        >
          <div className="panel" style={{ maxWidth: 420, padding: "1.4rem 1.5rem" }}>
            <h3 className="display" style={{ margin: "0 0 0.6rem", fontSize: "1.15rem" }}>
              確認交卷？
            </h3>
            <p style={{ margin: "0 0 0.8rem", lineHeight: 1.7, fontSize: "0.95rem" }}>
              未答 <strong>{unanswered}</strong> 題 · 旗標 <strong>{flaggedCount}</strong> 題。
              真試唔會扣錯題分，空白就係放棄。
            </p>
            <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmingEnd(false)}>
                返去檢查
              </button>
              <button type="button" className="btn btn-amber" onClick={confirmHandIn}>
                確認交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
