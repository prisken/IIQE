export type ExamConfig = {
  count: number;
  minutes: number;
  passPercent: number;
};

export type ChapterWeight = {
  id: string;
  weight: number;
  titleZh: string;
  titleEn: string;
};

export type PaperMeta = {
  id: number;
  code: string;
  titleZh: string;
  titleEn: string;
  exam: ExamConfig;
  weights: ChapterWeight[];
  stats: {
    manualChapters: number;
    guideChapters: number;
    questions: number;
    questionsByChapter: Record<string, number>;
  };
};

export type ContentBlock =
  | { type: "p" | "meta"; text: string }
  | { type: "table"; markdown: string }
  | { type: "point"; title: string; text: string };

export type StudySection = {
  id: string;
  title: string;
  blocks: ContentBlock[];
  preview?: string;
  manualTarget?: string | null;
  hasContent?: boolean;
  isBranch?: boolean;
  childIds?: string[];
};

export type StudyChapter = {
  id: string;
  title: string;
  sections: StudySection[];
};

export type StudyDoc = { chapters: StudyChapter[] };

export type QuestionOption = { letter: string; text: string };

export type Question = {
  id: number;
  ref: string;
  chapter: string;
  stem: string;
  stemLines: string[];
  options: QuestionOption[];
  answer: "A" | "B" | "C" | "D";
  explanation: string;
};
