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
 * Resolve a navigation / cross-link target to a useful section:
 * - exact id if it has body
 * - else first contentful descendant
 * - else the section itself (caller may show overview)
 */
export function resolveReadableSection(
  doc: StudyDoc,
  targetId: string,
  preferredChapterId?: string,
): LocatedSection | null {
  const hit = findSection(doc, targetId, preferredChapterId);
  if (!hit) {
    // Try parent chain: 1.1.2a → 1.1.2 → 1.1 → 1
    const parts = targetId.split(".");
    while (parts.length > 1) {
      parts.pop();
      const parent = findSection(doc, parts.join("."), preferredChapterId);
      if (parent) return resolveReadableSection(doc, parent.section.id, parent.chapter.id);
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
