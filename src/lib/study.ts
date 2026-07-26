import type { ContentBlock, StudyChapter, StudyDoc, StudySection } from "./types";

export function sectionHasBody(section: StudySection | undefined | null): boolean {
  if (!section?.blocks?.length) return false;
  return section.blocks.some((b) => {
    if (b.type === "table") return Boolean(b.markdown?.trim());
    if (b.type === "point") return Boolean(b.title?.trim() || b.text?.trim());
    return Boolean(b.text?.trim());
  });
}

export function sectionDepth(id: string): number {
  // Count numeric/dot segments; letter suffixes (1.1.2a) add one more level
  const base = id.replace(/[a-z]+$/i, "");
  const letterBump = /[a-z]+$/i.test(id) ? 1 : 0;
  return base.split(".").filter(Boolean).length + letterBump;
}

/** Logical parent id: 1.1.2a → 1.1.2 → 1.1 → 1 */
export function parentSectionId(id: string): string | null {
  const letterParent = id.match(/^(.*\.\d+)[a-z]+$/i);
  if (letterParent) return letterParent[1];
  const i = id.lastIndexOf(".");
  return i === -1 ? null : id.slice(0, i);
}

/** Direct children of parentId within the same chapter section list. */
export function directChildren(sections: StudySection[], parentId: string): StudySection[] {
  return sections.filter((s) => parentSectionId(s.id) === parentId);
}

export function isBranchSection(sections: StudySection[], section: StudySection): boolean {
  return directChildren(sections, section.id).length > 0;
}

export type LocatedSection = {
  chapter: StudyChapter;
  section: StudySection;
};

/** Find section by id across the whole document (chapter-scoped preferred). */
export function findSection(
  doc: StudyDoc,
  sectionId: string,
  preferredChapterId?: string,
): LocatedSection | null {
  if (preferredChapterId) {
    const ch = doc.chapters.find((c) => c.id === preferredChapterId);
    const sec = ch?.sections.find((s) => s.id === sectionId);
    if (ch && sec) return { chapter: ch, section: sec };
  }
  for (const chapter of doc.chapters) {
    const section = chapter.sections.find((s) => s.id === sectionId);
    if (section) return { chapter, section };
  }
  return null;
}

/**
 * Normalize question `ref` values to manual section id form.
 * e.g. `1.2(a)` → `1.2a`, `1(c)` → `1c`, trim whitespace.
 */
export function normalizeQuestionRef(ref: string): string {
  return String(ref || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/\(([a-zA-Z]+)\)/g, (_, letter: string) => letter.toLowerCase());
}

/** First section whose id equals prefix or starts with `prefix.` */
export function findSectionByPrefix(
  doc: StudyDoc,
  prefix: string,
  preferredChapterId?: string,
): LocatedSection | null {
  if (!prefix) return null;
  const chapters = preferredChapterId
    ? [
        ...doc.chapters.filter((c) => c.id === preferredChapterId),
        ...doc.chapters.filter((c) => c.id !== preferredChapterId),
      ]
    : doc.chapters;
  for (const chapter of chapters) {
    const section =
      chapter.sections.find((s) => s.id === prefix) ||
      chapter.sections.find((s) => s.id.startsWith(`${prefix}.`));
    if (section) return { chapter, section };
  }
  return null;
}

/**
 * Resolve a navigation / cross-link target to a useful section:
 * - exact id if it has body
 * - else first contentful descendant
 * - else the section itself (caller may show overview)
 * - if id missing but children exist (e.g. `2.3` → `2.3.1`), use prefix match
 */
export function resolveReadableSection(
  doc: StudyDoc,
  targetId: string,
  preferredChapterId?: string,
): LocatedSection | null {
  const hit =
    findSection(doc, targetId, preferredChapterId) ||
    findSectionByPrefix(doc, targetId, preferredChapterId);
  if (!hit) {
    // Try parent chain: 1.1.2a → 1.1.2 → 1.1 → 1
    let cur = targetId;
    while (true) {
      const parentId = parentSectionId(cur);
      if (!parentId) break;
      const parent =
        findSection(doc, parentId, preferredChapterId) ||
        findSectionByPrefix(doc, parentId, preferredChapterId);
      if (parent) return resolveReadableSection(doc, parent.section.id, parent.chapter.id);
      cur = parentId;
    }
    return null;
  }

  if (sectionHasBody(hit.section)) return hit;

  const kids = descendantsWithBody(hit.chapter.sections, hit.section.id);
  if (kids[0]) {
    return { chapter: hit.chapter, section: kids[0] };
  }

  // Branch with no body yet — return itself for overview UI
  if (isBranchSection(hit.chapter.sections, hit.section)) return hit;

  return hit;
}

/**
 * Map a question bank `ref` (+ chapter) to the best study-manual section.
 * Tries normalized forms, letter-stripped parents, then chapter fallback.
 */
export function resolveQuestionStudyTarget(
  manual: StudyDoc,
  ref: string,
  chapterId: string,
): LocatedSection | null {
  const normalized = normalizeQuestionRef(ref);
  const candidates = [normalized];
  if (ref.trim() && ref.trim() !== normalized) candidates.push(ref.trim());
  if (/[a-z]$/i.test(normalized)) {
    candidates.push(normalized.replace(/[a-z]+$/i, ""));
  }
  // Bare chapter letter forms like `1c` → try chapter `1`
  const bareChapter = normalized.match(/^(\d+)[a-z]+$/i);
  if (bareChapter) candidates.push(bareChapter[1]);

  for (const id of candidates) {
    if (!id) continue;
    // Skip non-numeric refs (e.g. 附錄III) — fall through to chapter
    if (!/^\d/.test(id)) continue;
    const resolved = resolveReadableSection(manual, id, chapterId);
    if (resolved) return resolved;
  }

  const ch = manual.chapters.find((c) => c.id === chapterId);
  if (ch) {
    const sec = firstReadableInChapter(ch);
    if (sec) return { chapter: ch, section: sec };
  }
  return firstReadableInDoc(manual);
}

/** Deep-link into the study manual for a question. */
export function studyHrefForQuestion(
  paperId: number,
  target: LocatedSection,
  from: "questions" | "mock",
): string {
  const q = new URLSearchParams({
    mode: "manual",
    chapter: target.chapter.id,
    section: target.section.id,
    from,
  });
  return `/papers/${paperId}/study?${q.toString()}`;
}

export function descendantsWithBody(sections: StudySection[], parentId: string): StudySection[] {
  const prefix = `${parentId}.`;
  return sections.filter((s) => s.id.startsWith(prefix) && sectionHasBody(s));
}

export function firstReadableInChapter(chapter: StudyChapter): StudySection | null {
  const withBody = chapter.sections.find(sectionHasBody);
  if (withBody) return withBody;
  return chapter.sections[0] || null;
}

export function firstReadableInDoc(doc: StudyDoc): LocatedSection | null {
  for (const chapter of doc.chapters) {
    const section = firstReadableInChapter(chapter);
    if (section) return { chapter, section };
  }
  return null;
}

/** Best manual target for a guide section (avoid blank parents). */
export function bestManualTarget(
  manual: StudyDoc,
  guideSection: StudySection,
  guideChapterId: string,
): LocatedSection | null {
  const candidates = [
    guideSection.manualTarget,
    guideSection.id,
    guideSection.id.split(".").slice(0, -1).join("."),
  ].filter(Boolean) as string[];

  for (const id of candidates) {
    const resolved = resolveReadableSection(manual, id, guideChapterId);
    if (!resolved) continue;
    if (sectionHasBody(resolved.section) || isBranchSection(resolved.chapter.sections, resolved.section)) {
      return resolved;
    }
  }
  // Fall back: same chapter first readable
  const ch = manual.chapters.find((c) => c.id === guideChapterId);
  if (ch) {
    const sec = firstReadableInChapter(ch);
    if (sec) return { chapter: ch, section: sec };
  }
  return firstReadableInDoc(manual);
}

export function previewText(section: StudySection, max = 120): string {
  for (const b of section.blocks) {
    if (b.type === "p" && b.text?.trim()) {
      const t = b.text.trim().replace(/\s+/g, " ");
      return t.length > max ? `${t.slice(0, max)}…` : t;
    }
    if (b.type === "point" && (b.text || b.title)) {
      const t = `${b.title} ${b.text || ""}`.trim().replace(/\s+/g, " ");
      return t.length > max ? `${t.slice(0, max)}…` : t;
    }
  }
  if (section.preview?.trim()) {
    const t = section.preview.trim();
    return t.length > max ? `${t.slice(0, max)}…` : t;
  }
  return "";
}

export function countBlocks(section: StudySection): number {
  return section.blocks?.length || 0;
}

export function sanitizeBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return (blocks || []).filter((b) => {
    if (!b || !b.type) return false;
    if (b.type === "table") return Boolean(b.markdown?.trim());
    if (b.type === "point") return Boolean(b.title?.trim() || b.text?.trim());
    return Boolean(b.text?.trim());
  });
}
