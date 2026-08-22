import type { Question } from "./types";

export type QuestionBankSession = {
  chapter: string;
  index: number;
  revealed: boolean;
  picked: string | null;
};

export type MockExamSession = {
  phase: "review" | "exam";
  paper: Question[];
  answers: Record<number, string>;
  focusQuestionId?: number;
  // exam-phase resume fields
  idx?: number;
  secondsLeft?: number;
  flags?: number[];
  savedAt?: number;
};

function qbankKey(paperId: number) {
  return `iiqe:qbank:${paperId}`;
}

function mockKey(paperId: number) {
  return `iiqe:mock:${paperId}`;
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode
  }
}

export function loadQuestionBankSession(paperId: number): QuestionBankSession | null {
  return readJson<QuestionBankSession>(qbankKey(paperId));
}

export function saveQuestionBankSession(paperId: number, state: QuestionBankSession) {
  writeJson(qbankKey(paperId), state);
}

export function loadMockExamSession(paperId: number): MockExamSession | null {
  const data = readJson<MockExamSession>(mockKey(paperId));
  if (!data || !Array.isArray(data.paper)) return null;
  return data;
}

export function saveMockExamSession(paperId: number, state: MockExamSession) {
  writeJson(mockKey(paperId), state);
}

export function clearMockExamSession(paperId: number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(mockKey(paperId));
  } catch {
    // ignore
  }
}
