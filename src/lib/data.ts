import { readFile } from "node:fs/promises";
import path from "node:path";
import type { PaperMeta, Question, StudyDoc } from "./types";

const DATA = path.join(process.cwd(), "public", "data");

async function loadJson<T>(rel: string): Promise<T> {
  const raw = await readFile(path.join(DATA, rel), "utf8");
  return JSON.parse(raw) as T;
}

export async function getPapers(): Promise<PaperMeta[]> {
  const data = await loadJson<{ papers: PaperMeta[] }>("papers.json");
  return data.papers;
}

export async function getPaperMeta(id: number): Promise<PaperMeta> {
  return loadJson<PaperMeta>(`paper${id}/meta.json`);
}

export async function getManual(id: number): Promise<StudyDoc> {
  return loadJson<StudyDoc>(`paper${id}/manual.json`);
}

export async function getGuide(id: number): Promise<StudyDoc> {
  return loadJson<StudyDoc>(`paper${id}/guide.json`);
}

export async function getQuestions(id: number): Promise<Question[]> {
  const data = await loadJson<{ questions: Question[] }>(`paper${id}/questions.json`);
  return data.questions;
}
