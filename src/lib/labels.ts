import type { PaperMeta } from "./types";

export function chapterTitle(meta: PaperMeta, chapterId: string): string {
  const w = meta.weights.find((x) => x.id === chapterId);
  return w ? `Ch${chapterId} ${w.titleZh}` : `Ch${chapterId}`;
}
