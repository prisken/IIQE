"use client";

import Link from "next/link";

/** Compact sticky back/context bar for reading screens. */
export function ReadingTopBar({
  backHref,
  backLabel,
  title,
  actions,
}: {
  backHref: string;
  backLabel: string;
  title?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="reading-topbar">
      <Link href={backHref} className="btn btn-ghost reading-back">
        ← {backLabel}
      </Link>
      {title ? <span className="reading-topbar-title">{title}</span> : <span />}
      <div className="reading-topbar-actions">{actions}</div>
    </div>
  );
}
