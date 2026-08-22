export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  readingMin: number;
  excerpt: string;
  /** Simple blocks: "p" = paragraph, "h2" = subheading, "ul" = list items */
  blocks: { type: "p" | "h2" | "ul"; text?: string; items?: string[] }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "iiqe-paper1-pass-mark",
    title: "IIQE Paper 1 幾多題先合格？75 題、120 分鐘、53 題的拆解",
    date: "2026-08-23",
    readingMin: 4,
    excerpt: "Paper 1 合格線係 70%，即 75 題要啱 53 題。但點樣計、點樣溫先實際？",
    blocks: [
      { type: "p", text: "最多人問嘅問題：IIQE Paper 1 到底要啱幾多題先合格？答案好簡單：75 題入面要啱 53 題，即 70%。" },
      { type: "h2", text: "Paper 1 基本資料" },
      { type: "ul", items: ["題數：75 題，全部 4 選 1", "時間：120 分鐘", "合格線：70% = 53 題", "冇扣錯題分，空白就係放棄"] },
      { type: "p", text: "換句話講，你只可以錯 22 題。聽落好少，但因為題目係按官方章節比重抽，Ch 3 保險原則（約 30%）同 Ch 6 規管（約 21%）加埋已經佔一半卷，集中火力喺呢兩章最實際。" },
      { type: "h2", text: "合格線唔代表要滿分" },
      { type: "p", text: "70% 係資格試合格線，唔係鬥高分。策略上：先打最重嘅章節，用模擬試計時習慣節奏，錯題返去天書睇原理，比盲目操 1,000 題有用。" },
    ],
  },
  {
    slug: "ppme-vs-csme",
    title: "PPME 定 CSME？IIQE 筆試同電腦試點揀",
    date: "2026-08-23",
    readingMin: 4,
    excerpt: "筆試平 HK$70，電腦試即日知成績。兩者分別唔止價錢。",
    blocks: [
      { type: "p", text: "報 IIQE 嗰陣第一個選擇：PPME（筆試）定 CSME（電腦試）？" },
      { type: "h2", text: "價錢（PEAK 官方收費）" },
      { type: "ul", items: ["Paper 1–3：筆試 PPME HK$195 / 電腦試 CSME HK$265", "Paper 5：PPME HK$325 / CSME HK$390", "MPFE：PPME HK$325 / CSME HK$395", "以 PEAK 官方公布為準"] },
      { type: "h2", text: "最大分別：幾時知成績" },
      { type: "p", text: "電腦試（CSME）即日知道合格與否，仲可以喺考試中旗標題目；筆試（PPME）要等成績。貴 HK$70 換即日知，對想盡快安排下一步嘅人通常值得。" },
      { type: "p", text: "場次先到先得，建議提早大約兩星期報名。" },
    ],
  },
  {
    slug: "which-papers-do-i-need",
    title: "IIQE 要考邊幾份？一般保險、人壽、投連、強積金路線圖",
    date: "2026-08-23",
    readingMin: 5,
    excerpt: "唔係五份全部要考。牌照組合係法定嘅，睇你想做邊類業務。",
    blocks: [
      { type: "p", text: "好多人以為 IIQE 五份卷全部要考。其實唔係 — 你要考邊幾份，取決於你想做嘅業務。" },
      { type: "h2", text: "建議路線" },
      { type: "ul", items: ["Paper 1（必考）→ 再考 Paper 3（人壽）→ 需要時 Paper 5（投連）", "一般保險線：Paper 1 + Paper 2", "強積金中介：另考 MPFE（官方唔叫 IIQE Paper 4）", "Paper 5 唔可以代替 Paper 3"] },
      { type: "p", text: "你只可以錯 22 題（P1）。先考必考卷，合格先再揀線 — 一次報五份只會分散火力。" },
      { type: "p", text: "唔肯定自己考邊份？用我哋嘅免費揀卷工具，或者 WhatsApp 問（兩個字：考邊份）。" },
    ],
  },
  {
    slug: "7-day-study-plan-paper1",
    title: "7 日溫書表：Paper 1 每日 40 分鐘版",
    date: "2026-08-23",
    readingMin: 4,
    excerpt: "目標先打穿 Ch 3 + Ch 6（約一半卷）。每日 40 分鐘，唔使爆肝。",
    blocks: [
      { type: "p", text: "如果 mock 未達標，唔好急住報名。用呢條 7 日線，每日約 40 分鐘，先打穿佔卷最多嘅章節。" },
      { type: "h2", text: "7 日線（Paper 1）" },
      { type: "ul", items: ["日 1：Ch 3 保險原則前半 — 讀 20 分 + 10 題", "日 2：Ch 3 其餘 — 讀 20 分 + 10 題 + 昨日錯題", "日 3：Ch 3 再測 20 題，錯題抄返原則一句", "日 4：Ch 6 規管前半 — 讀 20 分 + 10 題", "日 5：Ch 6 其餘 — 讀 20 分 + 10 題", "日 6：Ch 3+6 混合 30 題", "日 7：休息或只做錯題。未到 53，唔好報真場。"] },
      { type: "p", text: "Ch 2 法律原則放第二個 7 日；Ch 1/4/5/7 用零碎時間補。呢個站嘅 10 題快測同模擬試都係免費，直接跟住練就得。" },
    ],
  },
  {
    slug: "mpfe-vs-iiqe-paper4",
    title: "MPFE 係咪 IIQE Paper 4？點解個名成日搞錯",
    date: "2026-08-23",
    readingMin: 3,
    excerpt: "官方根本冇 IIQE Paper IV。你講嘅「Paper 4」其實係 MPFE。",
    blocks: [
      { type: "p", text: "好多備試網站叫「IIQE Paper 4」，但官方 IIQE 只有 I、II、III、V（同 VI 旅遊）。你講嘅「Paper 4」其實係強制性公積金計劃考試（MPFE）。" },
      { type: "h2", text: "實際資料" },
      { type: "ul", items: ["官方名：Mandatory Provident Fund Schemes Examination（MPFE）", "題數：80 題 · 120 分鐘 · 合格 70% = 56 題", "費用：PPME HK$325 / CSME HK$395（唔係 HK$195）"] },
      { type: "p", text: "我哋網站為咗方便叫佢 Paper 4，但費用同官方定位都同 IIQE 卷唔同，報名前留意。" },
    ],
  },
  {
    slug: "exam-day-checklist",
    title: "IIQE 考試當日：要帶咩、幾時到、有咩唔帶得",
    date: "2026-08-23",
    readingMin: 3,
    excerpt: "身份證、確認電郵、提早 30 分鐘。電子產品唔入場。",
    blocks: [
      { type: "p", text: "考前一天最易出事嘅位：帶漏嘢、遲到、帶咗唔帶得嘅嘢入場。" },
      { type: "h2", text: "當日清單" },
      { type: "ul", items: ["提早 30 分鐘到", "帶身份證原件 + 確認電郵", "電話、智能手錶、電子產品唔入場", "成績只有合格 / 不合格 — 官方唔會話你幾多分"] },
      { type: "p", text: "一經提交報名：唔改期、唔取消、唔退費。所以未準備好唔好報 — 用免費 mock 確認自己企穩 53 題先。" },
    ],
  },
  {
    slug: "how-to-apply-insurance-licence",
    title: "考完 IIQE 之後：出牌要經過咩步驟？",
    date: "2026-08-23",
    readingMin: 4,
    excerpt: "考試只係資格。出牌要經保險業監管局，仲有委任、培訓等步驟。",
    blocks: [
      { type: "p", text: "合格之後好快會諗：幾時有牌？其實考試只係第一關。" },
      { type: "h2", text: "出牌流程概覽" },
      { type: "ul", items: ["通過相關 IIQE 卷（或獲豁免）", "由保險公司 / 代理機構委任做中介人", "完成機構培訓同內部程序", "向保險業監管局（IA）註冊"] },
      { type: "p", text: "呢個站唔處理出牌，亦唔係官方。細節以 IA 同你嘅委任機構為準。想有人陪你行呢啲步驟，我哋可以傾。" },
    ],
  },
  {
    slug: "mock-score-what-is-good-enough",
    title: "模擬試幾多分先算穩？70% 之外嘅三個心理關口",
    date: "2026-08-23",
    readingMin: 4,
    excerpt: "70% 係合格線，但穩陣同合格係兩件事。睇你嘅分數落到邊個區間。",
    blocks: [
      { type: "p", text: "合格線 70% = 53/75。但唔同分數區間，下一步應該唔同。" },
      { type: "h2", text: "三個區間" },
      { type: "ul", items: ["< 38/75（約 <50%）：未到考場水平。拎 7 日溫書表，唔好報名", "38–52/75（50–69%）：差幾題。針對弱項再操 20 題，唔好轉去操第二份卷", "≥ 53/75：達合格線。可以開始計劃報 PEAK 場次"] },
      { type: "p", text: "用我哋嘅模擬試（按官方比重抽題、計時、即時批改）做完，會直接話你知落喺邊個區間同最弱嘅章節。" },
    ],
  },
  {
    slug: "free-iiqe-prep-tools",
    title: "免費 IIQE 備試工具大檢閱：Hub Cards 有咩、冇咩",
    date: "2026-08-23",
    readingMin: 4,
    excerpt: "邊啲工具真係免費、邊啲會中途收錢？一次過講清楚。",
    blocks: [
      { type: "p", text: "市面上打「免費」旗號嘅 IIQE 備試工具唔少，但好多操到一半就要俾錢。" },
      { type: "h2", text: "Hub Cards 提供（全部免費）" },
      { type: "ul", items: ["研習手冊 + 高密度天書（分章閱讀）", "分章題庫，答案遮罩、按需揭曉", "10 題快測（唔使登記，即答即對錯）", "按官方比重抽題嘅模擬試，計時 + 弱項分析", "唔加入團隊都可以用，唔會收走任何嘢"] },
      { type: "p", text: "我哋冇嘅：保證合格、官方 Past Paper（嗰啲要自己上 PEAK 買）。教材係練習題，唔係歷屆試題。" },
    ],
  },
  {
    slug: "first-year-in-insurance-honest",
    title: "入行第一年，老實講：幾多人走、最難係咩",
    date: "2026-08-23",
    readingMin: 5,
    excerpt: "唔會同你講「頭一年好易」。以下係真實啲嘅版本。",
    blocks: [
      { type: "p", text: "如果你下個月一定要固定糧，呢行唔適合你。呢句嘢應該喺入行之前講，唔係入咗先算。" },
      { type: "h2", text: "頭一年現實" },
      { type: "ul", items: ["收入唔穩，好多人頭一年就走", "考牌只係入場券，之後係搵客同經營", "會有人迫你買自己單 — 我哋唔會作為報銷條件", "有 mentor 帶同自己摸，係兩回事"] },
      { type: "p", text: "我哋寧願你考到牌、諗清楚先入行。溫書工具照用，入行與否你自己話事。" },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
