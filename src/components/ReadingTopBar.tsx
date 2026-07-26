"use client";

import Link from "next/link";

/** Compact sticky back/context bar for reading screens. */
export function ReadingTopBar({
  backHref,
  backLabel,
  title,
  actions,
  secondaryHref,
  secondaryLabel,
}: {
  backHref: string;
  backLabel: string;
  title?: string;
  actions?: React.ReactNode;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="reading-topbar">
      <div className="reading-topbar-back-group">
        <Link href={backHref} className="btn btn-ghost reading-back">
          ← {backLabel}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link href={secondaryHref} className="btn btn-ghost reading-back-secondary">
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
      {title ? <span className="reading-topbar-title">{title}</span> : <span />}
      <div className="reading-topbar-actions">{actions}</div>
    </div>
  );
}
