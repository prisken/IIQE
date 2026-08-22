import { makeRng } from "./exam";
import type { Question } from "./types";

export type DrillSpec = {
  chapter: string | null; // null = random across paper
  count: number;
  seed: number;
};

/** Default drill chapter per paper (highest-weight chapter). */
export function defaultDrillChapter(
  weights: { id: string; weight: number }[],
): string {
  const best = [...weights].sort((a, b) => b.weight - a.weight)[0];
  return best?.id ?? "1";
}

/**
 * Pick `count` questions for a drill:
 * - chapter filter when given (or across the whole paper for random)
 * - seeded shuffle so "再打 10 題（唔同題）" can pass a new seed
 */
export function pickDrill(
  bank: Question[],
  spec: DrillSpec,
): { questions: Question[]; seed: number } {
  const seed = spec.seed ?? (Date.now() ^ Math.floor(Math.random() * 1e9));
  const rnd = makeRng(seed);

  let pool = bank;
  if (spec.chapter) {
    pool = bank.filter((q) => q.chapter === spec.chapter);
  }

  // Deterministic shuffle with the seeded RNG
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return {
    questions: shuffled.slice(0, spec.count),
    seed,
  };
}
