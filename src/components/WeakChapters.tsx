"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { loadMockExamSession } from "@/lib/sessionState";
import type { PaperMeta, Question } from "@/lib/types";

/**
 * Weak-chapters dashboard — aggregates saved mock sessions (localStorage) into
 * a per-chapter accuracy view so repeat users see where they keep losing marks.
 * No account needed; purely client-side.
 */
export function WeakChapters({
  meta,
  bank,
}: {
  meta: PaperMeta;
  bank: Question[];
}) {
  const [sessions, setSessions] = useState<
    { paper: Question[]; answers: Record<number, string> }[]
  >([]);

  useEffect(() => {
    const saved = loadMockExamSession(meta.id);
    if (saved && saved.phase === "review" && saved.paper.length) {
      setSessions([{ paper: saved.paper, answers: saved.answers }]);
    }
  }, [meta.id]);

  const stats = useMemo(() => {
    const byChapter = new Map<string, { right: number; total: number }>();
    for (const s of sessions) {
      for (const q of s.paper) {
        const st = byChapter.get(q.chapter) ?? { right: 0, total: 0 };
        st.total += 1;
        if (s.answers[q.id] === q.answer) st.right += 1;
        byChapter.set(q.chapter, st);
      }
    }
    return [...byChapter.entries()]
      .map(([ch, st]) => ({
        chapter: ch,
        pct: st.total ? Math.round((st.right / st.total) * 100) : 0,
        right: st.right,
        total: st.total,
        title: meta.weights.find((w) => w.id === ch)?.titleZh ?? `Ch${ch}`,
        weight: meta.weights.find((w) => w.id === ch)?.weight ?? 0,
      }))
      .sort((a, b) => a.pct - b.pct);
  }, [sessions, meta.weights]);

  if (sessions.length === 0 || stats.length === 0) {
    return null;
  }

  const weakest = stats.slice(0, 3);

  return (
    <div className="panel" style={{ padding: "1.2rem 1.4rem", marginTop: "1rem" }}>
      <h3 className="display" style={{ margin: "0 0 0.6rem", fontSize: "1.1rem", color: "var(--sea)" }}>
        🎯 你嘅弱項章節
      </h3>
      <p style={{ margin: "0 0 0.8rem", fontSize: "0.88rem", opacity: 0.8 }}>
        根據你上次 mock（最近一輪）。弱項集中喺度，唔好亂操第二份卷。
      </p>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {stats.map((s) => (
          <div key={s.chapter} style={{ display: "flex", alignItems: "center", gap: "0.8rem", fontSize: "0.9rem" }}>
            <span style={{ minWidth: "5.5rem", fontWeight: 600, flexShrink: 0 }}>
              Ch {s.chapter} {s.title}
            </span>
            <div style={{ flex: 1, height: "0.6rem", borderRadius: 999, background: "rgba(13,27,42,0.1)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${s.pct}%`,
                  borderRadius: 999,
                  background: s.pct >= 70 ? "var(--ok)" : s.pct >= 50 ? "var(--amber-bright)" : "var(--bad)",
                }}
              />
            </div>
            <span style={{ minWidth: "3.6rem", textAlign: "right", fontVariantNumeric: "tabular-nums", opacity: 0.8 }}>
              {s.pct}% · {s.right}/{s.total}
            </span>
            <Link
              href={`/papers/${meta.id}/drill?ch=${s.chapter}&n=10`}
              className="btn btn-ghost"
              style={{ fontSize: "0.78rem", padding: "0.3rem 0.65rem", flexShrink: 0 }}
            >
              操 10 題
            </Link>
          </div>
        ))}
      </div>
      {weakest.length > 0 ? (
        <p style={{ margin: "0.8rem 0 0", fontSize: "0.85rem" }}>
          建議先打：{" "}
          {weakest.map((s, i) => (
            <span key={s.chapter}>
              {i > 0 ? " · " : ""}
              <Link href={`/papers/${meta.id}/drill?ch=${s.chapter}&n=10`} style={{ color: "var(--amber)", fontWeight: 600 }}>
                Ch {s.chapter}
              </Link>{" "}
              ({s.pct}%)
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}
