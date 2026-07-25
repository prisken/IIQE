import type { Question } from "./types";

export type QuestionIssue = string;

export function validateQuestion(q: Question): QuestionIssue[] {
  const issues: QuestionIssue[] = [];
  if (!q || typeof q.id !== "number") issues.push("missing id");
  if (!q.stem?.trim()) issues.push("empty stem");
  if (!q.chapter?.trim()) issues.push("missing chapter");
  const letters = (q.options || []).map((o) => o.letter);
  if (letters.join("") !== "ABCD") issues.push(`options ${letters.join(",") || "none"}`);
  for (const o of q.options || []) {
    if (!o.text?.trim()) issues.push(`empty option ${o.letter}`);
  }
  if (!["A", "B", "C", "D"].includes(q.answer)) issues.push("bad answer");
  else if (!letters.includes(q.answer)) issues.push("answer not in options");
  return issues;
}

export function filterValidQuestions(bank: Question[]): {
  valid: Question[];
  rejected: { id: number; issues: string[] }[];
} {
  const valid: Question[] = [];
  const rejected: { id: number; issues: string[] }[] = [];
  for (const q of bank) {
    const issues = validateQuestion(q);
    if (issues.length) rejected.push({ id: q.id, issues });
    else valid.push(q);
  }
  return { valid, rejected };
}
