/**
 * Verify mock exam allocation + similarity filter across papers.
 * Run: node scripts/test_exam_picker.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "data");

function normalizeStem(stem) {
  return stem
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\d+(\.\d+)?%?/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text) {
  const STOP = new Set(["的", "是", "在", "the", "a", "an", "of", "to", "and", "or", "which", "following"]);
  const parts = normalizeStem(text)
    .split(/\s+/)
    .flatMap((w) => {
      if (/[\u4e00-\u9fff]/.test(w) && w.length >= 2) {
        const grams = [];
        for (let i = 0; i < w.length - 1; i += 1) grams.push(w.slice(i, i + 2));
        return grams.length ? grams : [w];
      }
      return [w];
    })
    .filter((t) => t.length > 1 && !STOP.has(t));
  return new Set(parts);
}

function jaccard(a, b) {
  const A = tokens(a);
  const B = tokens(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  return inter / (A.size + B.size - inter);
}

function allocateByWeight(total, weights) {
  const sum = weights.reduce((s, w) => s + w.weight, 0) || 1;
  const ideals = weights.map((w) => ({ id: w.id, ideal: (total * w.weight) / sum }));
  const base = {};
  let assigned = 0;
  for (const row of ideals) {
    base[row.id] = Math.floor(row.ideal);
    assigned += base[row.id];
  }
  const order = [...ideals].sort(
    (a, b) => b.ideal - Math.floor(b.ideal) - (a.ideal - Math.floor(a.ideal)),
  );
  let i = 0;
  while (assigned < total) {
    base[order[i % order.length].id] += 1;
    assigned += 1;
    i += 1;
  }
  return base;
}

function makeRng(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rnd) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickExam(bank, weights, total, seed) {
  const rnd = makeRng(seed);
  const allocation = allocateByWeight(total, weights);
  const byChapter = new Map();
  for (const q of bank) {
    const list = byChapter.get(q.chapter) ?? [];
    list.push(q);
    byChapter.set(q.chapter, list);
  }
  const picked = [];
  let skipped = 0;
  for (const [chapterId, need] of Object.entries(allocation)) {
    const pool = shuffle(byChapter.get(chapterId) ?? [], rnd);
    for (const q of pool) {
      if (picked.filter((p) => p.chapter === chapterId).length >= need) break;
      if (picked.some((p) => p.id === q.id)) continue;
      const tooSimilar = picked.some(
        (p) => p.chapter === q.chapter && jaccard(p.stem, q.stem) >= 0.55,
      );
      if (tooSimilar) {
        skipped += 1;
        continue;
      }
      picked.push(q);
    }
    // top-up
    for (const q of pool) {
      if (picked.filter((p) => p.chapter === chapterId).length >= need) break;
      if (!picked.some((p) => p.id === q.id)) picked.push(q);
    }
  }
  return { picked: shuffle(picked.slice(0, total), rnd), allocation, skipped };
}

for (const id of [1, 2, 3, 4, 5]) {
  const meta = JSON.parse(readFileSync(path.join(root, `paper${id}`, "meta.json"), "utf8"));
  const bank = JSON.parse(readFileSync(path.join(root, `paper${id}`, "questions.json"), "utf8")).questions;
  const a = pickExam(bank, meta.weights, meta.exam.count, 11);
  const b = pickExam(bank, meta.weights, meta.exam.count, 99);
  const overlap = a.picked.filter((q) => b.picked.some((x) => x.id === q.id)).length;
  const sumAlloc = Object.values(a.allocation).reduce((s, n) => s + n, 0);
  console.log(
    `P${id}: count=${a.picked.length}/${meta.exam.count} allocSum=${sumAlloc} overlap(seed11vs99)=${overlap} skippedSimilar=${a.skipped}`,
  );
  console.log("  alloc", a.allocation);
  if (a.picked.length !== meta.exam.count) process.exitCode = 1;
  if (sumAlloc !== meta.exam.count) process.exitCode = 1;
}
