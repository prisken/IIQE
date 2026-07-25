"use client";

import { useEffect, useMemo, useState } from "react";
import { MarkdownTable } from "./MarkdownTable";
import {
  bestManualTarget,
  directChildren,
  firstReadableInChapter,
  isBranchSection,
  previewText,
  resolveReadableSection,
  sanitizeBlocks,
  sectionDepth,
  sectionHasBody,
} from "@/lib/study";
import type { StudyDoc, StudySection } from "@/lib/types";

type Mode = "manual" | "guide";

export function StudyViewer({
  paperId,
  manual,
  guide,
  initialMode = "manual",
  initialChapter,
  initialSection,
}: {
  paperId: number;
  manual: StudyDoc;
  guide: StudyDoc;
  initialMode?: Mode;
  initialChapter?: string;
  initialSection?: string;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const doc = mode === "manual" ? manual : guide;
  const [navOpen, setNavOpen] = useState(false);

  const initial = useMemo(() => {
    if (initialSection) {
      return (
        resolveReadableSection(doc, initialSection, initialChapter) ||
        firstReadableInDocSafe(doc)
      );
    }
    if (initialChapter) {
      const ch = doc.chapters.find((c) => c.id === initialChapter);
      if (ch) {
        const sec = firstReadableInChapter(ch);
        if (sec) return { chapter: ch, section: sec };
      }
    }
    return firstReadableInDocSafe(doc);
  }, [doc, initialChapter, initialSection]);

  const [chapterId, setChapterId] = useState(initial?.chapter.id || doc.chapters[0]?.id || "1");
  const [sectionId, setSectionId] = useState(initial?.section.id || "");

  useEffect(() => {
    const ch = doc.chapters.find((c) => c.id === chapterId) || doc.chapters[0];
    if (!ch) return;
    if (!ch.sections.some((s) => s.id === sectionId)) {
      const sec = firstReadableInChapter(ch);
      setChapterId(ch.id);
      setSectionId(sec?.id || "");
    }
  }, [doc, chapterId, sectionId]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  const chapter = useMemo(
    () => doc.chapters.find((c) => c.id === chapterId) || doc.chapters[0],
    [doc, chapterId],
  );
  const section = useMemo(
    () => chapter?.sections.find((s) => s.id === sectionId) || chapter?.sections[0],
    [chapter, sectionId],
  );

  const children = useMemo(
    () => (chapter && section ? directChildren(chapter.sections, section.id) : []),
    [chapter, section],
  );
  const isBranch = Boolean(chapter && section && isBranchSection(chapter.sections, section));
  const hasBody = sectionHasBody(section);
  const blocks = useMemo(() => sanitizeBlocks(section?.blocks || []), [section]);
  const showOverview = Boolean(section && !hasBody);

  const manualLink = useMemo(() => {
    if (mode !== "guide" || !section || !chapter) return null;
    return bestManualTarget(manual, section, chapter.id);
  }, [mode, section, chapter, manual]);

  function goTo(nextChapterId: string, nextSectionId: string) {
    setChapterId(nextChapterId);
    setSectionId(nextSectionId);
    setNavOpen(false);
    requestAnimationFrame(() => {
      document.getElementById("study-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function switchMode(next: Mode) {
    const nextDoc = next === "manual" ? manual : guide;
    setMode(next);
    const preferred =
      resolveReadableSection(nextDoc, sectionId, chapterId) ||
      (next === "manual" && section ? bestManualTarget(manual, section, chapterId) : null) ||
      resolveReadableSection(nextDoc, section?.manualTarget || "", chapterId) ||
      firstReadableInDocSafe(nextDoc);
    if (preferred) {
      setChapterId(preferred.chapter.id);
      setSectionId(preferred.section.id);
    }
  }

  function openManualFor(target: string) {
    const resolved =
      resolveReadableSection(manual, target, chapterId) ||
      resolveReadableSection(manual, target) ||
      firstReadableInDocSafe(manual);
    if (!resolved) return;
    setMode("manual");
    goTo(resolved.chapter.id, resolved.section.id);
  }

  if (!chapter || !section) {
    return (
      <div className="panel" style={{ padding: "1.25rem" }}>
        暫無可用研習內容。請執行 <code>npm run extract</code> 重新匯入 content source。
      </div>
    );
  }

  const navPanel = (
    <>
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.85rem" }}>
        <button
          type="button"
          className={`btn ${mode === "manual" ? "btn-primary" : "btn-ghost"}`}
          style={{ flex: 1, padding: "0.45rem" }}
          onClick={() => switchMode("manual")}
        >
          研習手冊
        </button>
        <button
          type="button"
          className={`btn ${mode === "guide" ? "btn-primary" : "btn-ghost"}`}
          style={{ flex: 1, padding: "0.45rem" }}
          onClick={() => switchMode("guide")}
        >
          高密度天書
        </button>
      </div>

      <div style={{ display: "grid", gap: "0.3rem", marginBottom: "0.85rem" }}>
        {doc.chapters.map((ch) => (
          <button
            key={ch.id}
            type="button"
            className="btn btn-ghost"
            style={{
              justifyContent: "flex-start",
              padding: "0.4rem 0.65rem",
              background: ch.id === chapter.id ? "rgba(15,107,92,0.1)" : "transparent",
              borderColor: ch.id === chapter.id ? "var(--sea)" : "var(--line)",
            }}
            onClick={() => {
              const sec = firstReadableInChapter(ch);
              goTo(ch.id, sec?.id || "");
            }}
          >
            Ch{ch.id} {ch.title}
          </button>
        ))}
      </div>

      <div style={{ borderTop: "1px solid var(--line)", paddingTop: "0.7rem" }}>
        <p style={{ margin: "0 0 0.45rem", fontSize: "0.8rem", opacity: 0.65 }}>本章綱目</p>
        <div style={{ display: "grid", gap: "0.12rem" }}>
          {chapter.sections.map((s) => {
            const depth = Math.max(0, sectionDepth(s.id) - 1);
            const branch = isBranchSection(chapter.sections, s);
            const body = sectionHasBody(s);
            const active = s.id === section.id;
            return (
              <button
                key={`${chapter.id}-${s.id}`}
                type="button"
                onClick={() => goTo(chapter.id, s.id)}
                style={{
                  textAlign: "left",
                  border: "none",
                  background: active ? "rgba(196,123,44,0.14)" : "transparent",
                  borderRadius: 8,
                  padding: "0.4rem 0.45rem",
                  paddingLeft: `${0.45 + depth * 0.7}rem`,
                  cursor: "pointer",
                  color: "var(--ink)",
                }}
              >
                <div style={{ fontWeight: branch ? 700 : 600, fontSize: "0.84rem" }}>
                  {s.id}
                  {branch && !body ? (
                    <span style={{ marginLeft: 6, fontSize: "0.72rem", opacity: 0.55, fontWeight: 500 }}>綱目</span>
                  ) : null}
                </div>
                <div style={{ fontSize: "0.78rem", opacity: 0.72, lineHeight: 1.35 }}>{s.title}</div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="study-layout">
      <div className="study-mobile-toolbar">
        <button type="button" className="btn btn-primary" onClick={() => setNavOpen(true)}>
          目錄 · Ch{chapter.id}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => switchMode(mode === "manual" ? "guide" : "manual")}
        >
          {mode === "manual" ? "開天書" : "開手冊"}
        </button>
      </div>

      <aside className="panel study-aside study-aside-desktop">{navPanel}</aside>

      {navOpen && (
        <>
          <button type="button" className="study-drawer-backdrop" aria-label="關閉目錄" onClick={() => setNavOpen(false)} />
          <aside className="panel study-aside-drawer" role="dialog" aria-modal="true" aria-label="章節目錄">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <strong>目錄</strong>
              <button type="button" className="btn btn-ghost" style={{ padding: "0.35rem 0.7rem" }} onClick={() => setNavOpen(false)}>
                關閉
              </button>
            </div>
            {navPanel}
          </aside>
        </>
      )}

      <article id="study-content" className="panel study-content-panel">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, color: "var(--sea)", fontWeight: 600, fontSize: "0.85rem" }}>
              Paper {paperId} · {mode === "manual" ? "研習手冊" : "高密度天書"} · Ch{chapter.id}
            </p>
            <h1 className="display" style={{ margin: "0.3rem 0 0.15rem" }}>
              {section.id} {section.title}
            </h1>
            {showOverview && (
              <p style={{ margin: "0.3rem 0 0", opacity: 0.7, fontSize: "0.9rem" }}>
                章節綱目 — 點選下方小節閱讀正文。
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {mode === "guide" && manualLink && (
              <button type="button" className="btn btn-amber" style={{ padding: "0.45rem 0.8rem", fontSize: "0.88rem" }} onClick={() => openManualFor(manualLink.section.id)}>
                手冊 {manualLink.section.id}
              </button>
            )}
            {mode === "manual" && (
              <button type="button" className="btn btn-ghost study-desktop-only" style={{ padding: "0.45rem 0.8rem", fontSize: "0.88rem" }} onClick={() => switchMode("guide")}>
                天書
              </button>
            )}
          </div>
        </div>

        {showOverview ? (
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.55rem" }}>
            {children.length === 0 ? (
              <p style={{ opacity: 0.7 }}>此綱目下暫無小節內容。</p>
            ) : (
              children.map((child) => {
                const childKids = directChildren(chapter.sections, child.id);
                const body = sectionHasBody(child);
                const preview = previewText(child) || (childKids.length ? `含 ${childKids.length} 個小節` : "");
                return (
                  <button
                    key={child.id}
                    type="button"
                    onClick={() => goTo(chapter.id, child.id)}
                    className="panel"
                    style={{
                      textAlign: "left",
                      padding: "0.85rem 0.95rem",
                      border: "1px solid var(--line)",
                      cursor: "pointer",
                      background: "rgba(255,255,255,0.55)",
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>
                      {child.id} {child.title}
                    </div>
                    {preview ? <div style={{ fontSize: "0.88rem", opacity: 0.75, lineHeight: 1.5 }}>{preview}</div> : null}
                    {!body && childKids.length > 0 ? (
                      <div style={{ marginTop: 4, fontSize: "0.78rem", opacity: 0.55 }}>綱目 · {childKids.length} 小節</div>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        ) : (
          <div className="prose-study" style={{ marginTop: "1rem" }}>
            {blocks.length === 0 ? (
              <p style={{ opacity: 0.7 }}>此節沒有正文。請開啟目錄選擇其他小節。</p>
            ) : (
              blocks.map((b, i) => {
                if (b.type === "table") return <MarkdownTable key={i} markdown={b.markdown} />;
                if (b.type === "point") {
                  const pointTarget =
                    mode === "guide"
                      ? bestManualTarget(
                          manual,
                          { ...section, title: b.title, blocks: [{ type: "p", text: b.text }] },
                          chapter.id,
                        )
                      : null;
                  return (
                    <div
                      key={i}
                      style={{
                        margin: "0.85rem 0",
                        padding: "0.8rem 0.9rem",
                        borderLeft: "3px solid var(--amber)",
                        background: "rgba(196,123,44,0.06)",
                        borderRadius: "0 12px 12px 0",
                      }}
                    >
                      <h3 style={{ margin: "0 0 0.35rem", fontSize: "1.02rem" }}>{b.title}</h3>
                      {b.text ? <p style={{ margin: 0 }}>{b.text}</p> : null}
                      {pointTarget && (
                        <button
                          type="button"
                          className="btn btn-ghost"
                          style={{ marginTop: "0.55rem", padding: "0.35rem 0.7rem", fontSize: "0.84rem" }}
                          onClick={() => openManualFor(pointTarget.section.id)}
                        >
                          手冊細讀 {pointTarget.section.id} →
                        </button>
                      )}
                    </div>
                  );
                }
                if (b.type === "meta") {
                  return (
                    <p key={i} style={{ color: "var(--amber)", fontWeight: 600 }}>
                      {b.text}
                    </p>
                  );
                }
                return <p key={i}>{b.text}</p>;
              })
            )}

            {isBranch && children.length > 0 && hasBody && (
              <div style={{ marginTop: "1.25rem", paddingTop: "0.85rem", borderTop: "1px solid var(--line)" }}>
                <h3 className="display" style={{ fontSize: "1.05rem", marginTop: 0 }}>
                  相關小節
                </h3>
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  {children.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      className="btn btn-ghost"
                      style={{ justifyContent: "flex-start" }}
                      onClick={() => goTo(chapter.id, child.id)}
                    >
                      {child.id} {child.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="sticky-nav-bar">
          <NavAdjacent
            label="上一節"
            chapterId={chapter.id}
            sectionId={section.id}
            chapters={doc.chapters}
            dir={-1}
            onGo={goTo}
          />
          <NavAdjacent
            label="下一節"
            chapterId={chapter.id}
            sectionId={section.id}
            chapters={doc.chapters}
            dir={1}
            onGo={goTo}
          />
        </div>
      </article>
    </div>
  );
}

function firstReadableInDocSafe(doc: StudyDoc) {
  for (const chapter of doc.chapters) {
    const section = firstReadableInChapter(chapter);
    if (section) return { chapter, section };
  }
  if (doc.chapters[0]?.sections[0]) {
    return { chapter: doc.chapters[0], section: doc.chapters[0].sections[0] };
  }
  return null;
}

function NavAdjacent({
  label,
  chapterId,
  sectionId,
  chapters,
  dir,
  onGo,
}: {
  label: string;
  chapterId: string;
  sectionId: string;
  chapters: { id: string; sections: StudySection[] }[];
  dir: -1 | 1;
  onGo: (chapterId: string, sectionId: string) => void;
}) {
  const flat = chapters.flatMap((c) => c.sections.map((s) => ({ c: c.id, s: s.id })));
  const idx = flat.findIndex((x) => x.c === chapterId && x.s === sectionId);
  const next = flat[idx + dir];
  if (!next) {
    return <span style={{ flex: 1, maxWidth: "48%" }} />;
  }
  return (
    <button type="button" className="btn btn-ghost" onClick={() => onGo(next.c, next.s)}>
      {label}
    </button>
  );
}
