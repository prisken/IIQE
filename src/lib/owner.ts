/**
 * Personal facts — confirmed by Prisken 2026-08-23.
 * Once provided, every page that uses these lights up — no other edits needed.
 */
export const OWNER = {
  /** Display name. */
  name: "Prisken Lo",
  /** HK insurance intermediary licence number — leave empty to show title only. */
  licenseNo: "",
  /** Public title shown when no licence number is displayed. */
  title: "持牌個人保險中介（Individual Insurance Agent）",
  /** Agency / company the licence is held under (optional, leave empty to hide). */
  company: "",
  /** Real photo (public/). */
  photo: "/branding/prisken-lo.jpg",
};

/** True once Prisken has provided the identity facts. */
export const OWNER_IDENTITY_READY = Boolean(OWNER.name);

/** WhatsApp number used for lead follow-up (E.164, no +). */
export const WHATSAPP_NUMBER = "85260147819";

export function waLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/**
 * Exam-fee reimbursement — terms confirmed by Prisken 2026-08-23.
 * One rule a stranger can understand: join as a recruit, pink card locked to
 * us for 3 months (no other agent can recruit you), sit any paper and show
 * valid exam proof (pass not required) — we refund the fee.
 */
export const FEE_TERMS_CONFIRMED = true;

export const FEE_TERMS = {
  /** 報銷邊份 */
  scope: "任何一份 IIQE 卷（Paper 1–5 / MPFE）",
  /** 官方原價 (PEAK 1 Sep 2026 handbook) */
  officialFees:
    "P1–3：筆試 PPME HK$195 · 電腦試 CSME HK$265；P5：PPME HK$325 / CSME HK$390；MPFE：PPME HK$325 / CSME HK$395。以 PEAK 官方公布為準。",
  /** 我哋報銷金額 */
  amount: "全數退回你實際俾嘅考試費",
  /** 包唔包電腦試 */
  includesCsme: "包 — 以你實際俾咗嘅金額為準",
  /** 幾時先申請到 */
  when: "加入做招募，粉紅卡鎖定 3 個月後",
  /** 粉紅卡係咩 */
  pinkCard:
    "保險中介人登記。鎖定期內，你只會掛喺我哋團隊，其他 agent 唔可以招募你。",
  /** 證明 */
  proof: "任何一份卷嘅有效考試出席 / 成績證明 — 唔使合格，有去考就得",
  /** 過數 */
  payout: "證明核實後 14 日內過數（Prisken Lo 直接轉帳）",
  /** 唔合格 */
  fail: "照報銷 — 只要你有去考，有證明就得",
  /** 唔加入 */
  noJoin: "唔報銷。研習、題庫、模擬試照用。",
  /** 最後一行 */
  bottomLine: "以上係全部條件。冇隱藏 KPI、冇逼你買自己單先至過數。",
};

/**
 * Real testimonials only — never invented. First name + paper + month.
 * Section renders only when at least one entry exists.
 *
 * ⚠️ SEEDED 2026-08-23 by Prisken's request — these are PLACEHOLDER entries
 * so the layout can be seen. They must be swapped for REAL passers before
 * the site carries them long-term (see reply to Prisken: fake proof is the
 * one thing that breaks the trust positioning + IA advertising rules).
 * To remove all: empty the array. To swap: edit name/when/line.
 */
export const TESTIMONIALS: { name: string; paper: string; when: string; line: string }[] = [
  {
    name: "阿欣",
    paper: "Paper 1",
    when: "2026 年 7 月",
    line: "本身唔係保險行業，純粹想考個牌傍身。日日用呢度操 20 題，兩個禮拜後 mock 由 39 分升到 54 分，真試 59/75 過咗。",
  },
  {
    name: "家豪",
    paper: "Paper 3",
    when: "2026 年 6 月",
    line: "最驚 Ch 4 人壽運作嗰 part，天書加題庫咁樣 loop，最後合格線 35 題我拎咗 41。免費之餘仲有得對答案解釋，唔使自己估。",
  },
  {
    name: "敏儀",
    paper: "Paper 1 + 2",
    when: "2026 年 5 月",
    line: "考完 P1 未敢報 P2，跟住建議路線操多兩星期，兩份一次過搞掂。模擬試個計時好緊要，習慣咗真試唔會慌。",
  },
];
