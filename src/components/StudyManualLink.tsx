"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  resolveQuestionStudyTarget,
  studyHrefForQuestion,
} from "@/lib/study";
import type { Question, StudyDoc } from "@/lib/types";

/** Link from an answer explanation to the related study-manual section. */
export function StudyManualLink({
  paperId,
  question,
  manual,
  from,
}: {
  paperId: number;
  question: Question;
  manual: StudyDoc;
  from: "questions" | "mock";
}) {
  const target = useMemo(
    () => resolveQuestionStudyTarget(manual, question.ref, question.chapter),
    [manual, question.ref, question.chapter],
  );

  if (!target) return null;

  const href = studyHrefForQuestion(paperId, target, from);
  const label = target.section.title
    ? `手冊 §${target.section.id} ${target.section.title}`
    : `手冊 §${target.section.id}`;

  return (
    <p style={{ margin: "0.65rem 0 0" }}>
      <Link
        href={href}
        className="study-answer-link"
        onClick={() => {
          // Soft scroll restore hint for mock results
          if (from === "mock") {
            try {
              sessionStorage.setItem(
                `iiqe:mock-focus:${paperId}`,
                String(question.id),
              );
            } catch {
              // ignore
            }
          }
        }}
      >
        詳閱相關內容：{label} →
      </Link>
    </p>
  );
}
