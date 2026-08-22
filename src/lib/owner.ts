/**
 * Personal facts that only Prisken can confirm.
 * Once provided, every page that uses these lights up — no other edits needed.
 */
export const OWNER = {
  /** Display name, e.g. "Prisken Lo" or a preferred public name. */
  name: "",
  /** HK insurance intermediary licence number, e.g. "M123456" — makes identity checkable. */
  licenseNo: "",
  /** Agency / company the licence is held under, e.g. "AIA Hong Kong". */
  company: "",
  /** Path to a real photo (place under public/), e.g. "/branding/prisken.jpg". Empty = no photo shown. */
  photo: "",
};

/** True once Prisken has provided the checkable identity facts. */
export const OWNER_IDENTITY_READY =
  Boolean(OWNER.name) && Boolean(OWNER.licenseNo);

/**
 * Exam-fee reimbursement terms, written in one sentence a stranger can
 * understand. Until Prisken confirms this, NO money copy is allowed anywhere
 * on the site — Pass 0. Flip to true only when the text is locked.
 */
export const FEE_TERMS_CONFIRMED = false;

/** WhatsApp number used for lead follow-up (E.164, no +). */
export const WHATSAPP_NUMBER = "85260147819";

export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
