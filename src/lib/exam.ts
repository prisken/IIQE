import type { ChapterWeight, Question } from "./types";

const STOP = new Set([
  "的", "是", "在", "與", "和", "或", "及", "了", "嗎", "哪", "以下", "下列", "有關", "關於",
  "the", "a", "an", "of", "to", "in", "on", "for", "and", "or", "is", "are", "which",
  "following", "most", "best", "what", "when", "how",
]);

/** Strip names/numbers/noise for similarity comparison. */
export function normalizeStem(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(
      /\b(chan|lee|wong|ho|lam|cheung|chow|tang|leung|fung|law|hui|tse|choi|yip|kwan|ma|wu|tsang|so|poon|chung|fong|wan|shek|yam|fan|kung|lai|tam)\b/gi,
      " ",
    )
    .replace(/[陳李黃何林張周鄧梁馮羅許謝蔡葉關馬胡曾蘇潘鍾方溫石任范龔黎譚][一-龥]{1,3}/g, " ")
    .replace(/\d+(\.\d+)?%?/g, " ")
    .replace(/\$[\d,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text: string): Set<string> {
  const parts = normalizeStem(text)
    .split(/\s+/)
    .flatMap((w) => {
      // also split CJK into bigrams
      if (/[\u4e00-\u9fff]/.test(w) && w.length >= 2) {
        const grams: string[] = [];
        for (let i = 0; i < w.length - 1; i += 1) grams.push(w.slice(i, i + 2));
        return grams.length ? grams : [w];
      }
      return [w];
    })
    .filter((t) => t.length > 1 && !STOP.has(t));
  return new Set(parts);
}

export function jaccard(a: string, b: string): number {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  return inter / (A.size + B.size - inter);
}

/** Largest-remainder allocation of question counts by chapter weight. */
export function allocateByWeight(
  total: number,
  weights: ChapterWeight[],
): Record<string, number> {
  const sum = weights.reduce((s, w) => s + w.weight, 0) || 1;
  const ideals = weights.map((w) => ({
    id: w.id,
    ideal: (total * w.weight) / sum,
  }));
  const base: Record<string, number> = {};
  let assigned = 0;
  for (const row of ideals) {
    base[row.id] = Math.floor(row.ideal);
    assigned += base[row.id];
  }
  const order = [...ideals].sort(
    (a, b) => b.ideal - Math.floor(b.ideal) - (a.ideal - Math.floor(a.ideal)),
  );
  let i = 0;
  while (assigned < total && i < order.length * 3) {
    const id = order[i % order.length].id;
    base[id] += 1;
    assigned += 1;
    i += 1;
  }
  return base;
}

function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Mulberry32 PRNG — new seed each mock attempt. */
export function makeRng(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export type ExamPickResult = {
  questions: Question[];
  seed: number;
  allocation: Record<string, number>;
  skippedSimilar: number;
};

/**
 * Pick a mock exam paper:
 * - chapter counts follow official weights
 * - random within each chapter
 * - reject near-duplicates (Jaccard >= threshold) against already picked items
 */
export function pickExam(
  bank: Question[],
  weights: ChapterWeight[],
  total: number,
  opts?: { seed?: number; similarityThreshold?: number },
): ExamPickResult {
  const seed = opts?.seed ?? (Date.now() ^ Math.floor(Math.random() * 1e9));
  const rnd = makeRng(seed);
  const threshold = opts?.similarityThreshold ?? 0.55;
  const allocation = allocateByWeight(total, weights);

  const byChapter = new Map<string, Question[]>();
  for (const q of bank) {
    const list = byChapter.get(q.chapter) ?? [];
    list.push(q);
    byChapter.set(q.chapter, list);
  }

  const picked: Question[] = [];
  let skippedSimilar = 0;

  const tryPick = (pool: Question[], need: number) => {
    const shuffled = shuffle(pool, rnd);
    for (const q of shuffled) {
      if (picked.length >= total) break;
      if (picked.some((p) => p.id === q.id)) continue;
      const tooSimilar = picked.some(
        (p) => p.chapter === q.chapter && jaccard(p.stem, q.stem) >= threshold,
      );
      if (tooSimilar) {
        skippedSimilar += 1;
        continue;
      }
      picked.push(q);
      if (picked.filter((p) => p.chapter === q.chapter).length >= need && need > 0) {
        // continue until chapter quota filled via outer loop check
      }
      const chapterCount = picked.filter((p) => p.chapter === q.chapter).length;
      if (chapterCount >= need) break;
    }
  };

  for (const [chapterId, need] of Object.entries(allocation)) {
    if (need <= 0) continue;
    const pool = byChapter.get(chapterId) ?? [];
    tryPick(pool, need);
    // top-up if similarity filter left a shortfall
    const have = picked.filter((p) => p.chapter === chapterId).length;
    if (have < need) {
      const remain = shuffle(
        pool.filter((q) => !picked.some((p) => p.id === q.id)),
        rnd,
      );
      for (const q of remain) {
        if (picked.filter((p) => p.chapter === chapterId).length >= need) break;
        picked.push(q);
      }
    }
  }

  // Global top-up if still short (tiny chapters)
  if (picked.length < total) {
    const remain = shuffle(
      bank.filter((q) => !picked.some((p) => p.id === q.id)),
      rnd,
    );
    for (const q of remain) {
      if (picked.length >= total) break;
      const tooSimilar = picked.some((p) => jaccard(p.stem, q.stem) >= threshold);
      if (tooSimilar) {
        skippedSimilar += 1;
        continue;
      }
      picked.push(q);
    }
  }

  // Final fill ignoring similarity if still short
  if (picked.length < total) {
    const remain = shuffle(
      bank.filter((q) => !picked.some((p) => p.id === q.id)),
      rnd,
    );
    for (const q of remain) {
      if (picked.length >= total) break;
      picked.push(q);
    }
  }

  return {
    questions: shuffle(picked.slice(0, total), rnd),
    seed,
    allocation,
    skippedSimilar,
  };
}

export function passMark(count: number, passPercent: number): number {
  return Math.ceil((count * passPercent) / 100);
}
