"use client";

import { useState } from "react";
import Link from "next/link";
import {
  OWNER,
  OWNER_IDENTITY_READY,
  FEE_TERMS,
  FEE_TERMS_CONFIRMED,
  waLink,
} from "@/lib/owner";

export default function RecruitPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    paper: "Paper 1",
    whereNow: "溫緊",
    consentExam: false,
    consentCareer: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consentExam) {
      setStatus("error");
      setError("請剔「同意我 WhatsApp 你」先至可以送出。");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          paper: form.paper,
          source: "Hub Cards Recruit Page",
          whereNow: form.whereNow,
          consentExam: form.consentExam,
          consentCareer: form.consentCareer,
          // "只係想溫書" → route as Study Only, never a recruit lead
          role: form.whereNow === "只係想溫書" ? "Study Only" : "Recruit Lead",
          path: "/recruit",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data?.error === "phone or email required" ? "留低電話或電郵，我哋先搵到你。" : "傳送唔到。撳下面改用 WhatsApp。");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("網絡錯誤。撳下面改用 WhatsApp。");
    }
  }

  if (status === "done") {
    const studyOnly = form.whereNow === "只係想溫書";
    return (
      <div className="shell" style={{ padding: "3rem 0 4rem", maxWidth: 640 }}>
        <div className="panel" style={{ padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.6rem" }}>📥</div>
          <h1 className="display" style={{ color: "var(--sea)", margin: "0 0 0.6rem" }}>
            收到。而家撳下去開 WhatsApp。
          </h1>
          <p style={{ lineHeight: 1.7, margin: "0 0 1.2rem" }}>
            {studyOnly
              ? "你淨係想溫書 — 明白，唔會拉你入行。工具照用，隨時返嚟。"
              : `我會用「${OWNER.name || "我"}」呢個名出嚟。頭三句只會問你考邊份、mock 幾多分、想邊個禮拜。唔會一開波拉你入行。`}
          </p>
          <div style={{ display: "flex", gap: "0.7rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={waLink(studyOnly ? "你好，我淨係想溫書，唔好拉我入行。" : "報名")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-amber"
            >
              開 WhatsApp，貼埋我嘅分數 →
            </a>
            <Link href={studyOnly ? "/papers/1/study" : "/papers/1"} className="btn btn-ghost">
              {studyOnly ? "返去繼續溫 →" : "返去溫書"}
            </Link>
          </div>
          <p style={{ margin: "1.1rem 0 0", fontSize: "0.88rem" }}>
            唔方便而家傾？我今日都會覆。想改號碼就回覆「改」。
          </p>
        </div>
      </div>
    );
  }

  const whoReady = OWNER_IDENTITY_READY;
  const faqs = [
    {
      q: "一定要有牌先傾？",
      a: "唔使。未考都可以。你淨係想溫書，揀「只係想溫書」，我會送你返去試卷頁，唔會拉你入行。",
    },
    ...(FEE_TERMS_CONFIRMED
      ? [
          {
            q: "考試費係咪真係全包？",
            a: "範圍、金額、幾時過數，全部寫喺上面黃盒。讀完先留電話。",
          },
        ]
      : []),
    ...(FEE_TERMS_CONFIRMED
      ? [
          {
            q: "可唔可以只考牌、唔入你團隊？",
            a: "可以。工具照用。報銷就唔適用。",
          },
        ]
      : []),
    {
      q: "會唔會逼我買自己單？",
      a: "唔會作為任何條件。如果將來團隊有任何銷售要求，我會當面講，唔會寫喺備試站度呃你入嚟。",
    },
    {
      q: "全職定兼職？",
      a: "兩樣都有人做。頭一年唔穩，好多人走。如果你下個月一定要固定糧，呢行唔適合你。",
    },
    {
      q: "邊個公司？",
      a: "確認後寫喺度。你會知自己掛邊度，唔會「入咗先算」。",
    },
    {
      q: "資料會點用？",
      a: "只用嚟 WhatsApp 你傾今次報名 / 備試。用途睇下面剔格。私隱政策見下。",
    },
    {
      q: "你哋同 VTC / 保監局有關？",
      a: "無關。獨立備試站。教材唔係 Past Paper，唔保證合格。",
    },
  ];

  return (
    <div className="shell" style={{ padding: "2rem 0 4rem", maxWidth: 760 }}>
      <p style={{ margin: 0 }}>
        <Link href="/papers/1" style={{ color: "var(--amber)", fontWeight: 600 }}>
          ← 返去溫書
        </Link>
      </p>

      {/* Who — the person who answers */}
      {whoReady ? (
        <div
          className="panel"
          style={{ marginTop: "1rem", padding: "1.2rem 1.4rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}
        >
          {OWNER.photo ? (
            <img
              src={OWNER.photo}
              alt={OWNER.name}
              style={{ width: "4rem", height: "4rem", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                background: "var(--amber-bright)",
                color: "var(--sea-deep)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.4rem",
                flexShrink: 0,
              }}
            >
              {OWNER.name.slice(0, 1)}
            </div>
          )}
          <div>
            <p style={{ margin: 0, fontWeight: 700 }}>
              {OWNER.name} · {OWNER.title}
            </p>
            <p style={{ margin: "0.3rem 0 0", fontSize: "0.92rem", lineHeight: 1.6, opacity: 0.85 }}>
              你撳送出之後，係我親自覆，唔會落入大隊流水線。我哋仲細 — 所以你會直接對住我。
            </p>
          </div>
        </div>
      ) : (
        <p style={{ margin: "0.8rem 0 0", fontSize: "0.88rem", opacity: 0.7 }}>
          （個人身份資料整理中 — 好快有相有牌號。）暫時：你嘅 message 會由本站負責人親自覆。
        </p>
      )}

      <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", color: "var(--sea)", margin: "1rem 0 0.4rem" }}>
        你準備報 PEAK 嗰陣，我可以陪你填。
      </h1>
      <p style={{ fontSize: "1rem", lineHeight: 1.7, maxWidth: 620, margin: "0 0 1.2rem" }}>
        合格先有得揀入唔入行。未考到之前，唔好同人講夢想。
        呢頁只做三件事：幫你報名、講清楚考試費、約一次 15 分鐘 WhatsApp。
      </p>

      {/* What happens — 3 lines */}
      <section className="panel" style={{ padding: "1.2rem 1.4rem" }}>
        <h2 className="display" style={{ margin: "0 0 0.6rem", fontSize: "1.05rem" }}>
          提交之後會點？
        </h2>
        <ol style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.95rem", lineHeight: 1.95, opacity: 0.88 }}>
          <li>你今日會收到我 WhatsApp，通常 <strong>30 分鐘內</strong>。</li>
          <li>15 分鐘：你考邊份、想邊個禮拜、PPME 定 CSME。</li>
          <li>之後你話唔啱，工具照用。我唔會再追。</li>
        </ol>
      </section>

      {/* Always-free box — cannot miss */}
      <section className="panel" style={{ marginTop: "1rem", padding: "1.2rem 1.4rem", borderColor: "rgba(255,215,0,0.55)", background: "rgba(255,250,235,0.6)" }}>
        <h2 className="display" style={{ margin: "0 0 0.3rem", fontSize: "1.05rem" }}>
          🟡 唔入行都可以繼續用
        </h2>
        <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.7 }}>
          呢個站嘅研習、題庫、模擬試永遠免費。你話唔加入、淨係想溫書，
          我都唔會收走任何嘢。
        </p>
      </section>

      {/* Fee box — written terms, now confirmed */}
      <section className="panel" style={{ marginTop: "1rem", padding: "1.2rem 1.4rem", borderColor: "rgba(255,215,0,0.55)", background: "rgba(255,250,235,0.6)" }}>
        <h2 className="display" style={{ margin: "0 0 0.4rem", fontSize: "1.05rem" }}>
          考試費報銷 — 寫死嘅條款
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
          <tbody>
            {[
              ["報銷邊份", FEE_TERMS.scope],
              ["金額", FEE_TERMS.amount],
              ["幾時", FEE_TERMS.when],
              ["粉紅卡", FEE_TERMS.pinkCard],
              ["證明", FEE_TERMS.proof],
              ["過數", FEE_TERMS.payout],
              ["唔合格", FEE_TERMS.fail],
              ["唔加入", FEE_TERMS.noJoin],
            ].map(([k, v]) => (
              <tr key={k}>
                <td style={{ padding: "0.4rem 0.8rem 0.4rem 0", verticalAlign: "top", fontWeight: 700, whiteSpace: "nowrap", width: "5.5rem" }}>
                  {k}
                </td>
                <td style={{ padding: "0.4rem 0", verticalAlign: "top" }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ margin: "0.7rem 0 0", fontSize: "0.9rem", fontWeight: 700 }}>
          {FEE_TERMS.bottomLine}
        </p>
      </section>

      {/* Primary — WhatsApp first */}
      <div style={{ margin: "1.1rem 0 0.4rem", display: "grid", gap: "0.55rem" }}>
        <a
          href={waLink("報名")}
          target="_blank"
          rel="noreferrer"
          className="btn btn-amber"
          style={{ fontSize: "1rem", padding: "0.85rem 1.4rem", textAlign: "center" }}
        >
          WhatsApp 我兩個字：報名
        </a>
        <p style={{ margin: 0, textAlign: "center", fontSize: "0.85rem", opacity: 0.8 }}>
          最快。而家開就係我。
        </p>
        <p style={{ margin: "0.6rem 0 0", textAlign: "center", fontSize: "0.9rem", fontWeight: 600 }}>
          —— 或者留低電話，我今日 WhatsApp 你 ——
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="panel" style={{ display: "grid", gap: "0.7rem", padding: "1.4rem 1.5rem", marginTop: "0.6rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.7rem" }}>
          <input
            type="text"
            placeholder="點稱呼你？"
            aria-label="你叫咩名"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", border: "1px solid var(--line)", background: "#ffffff", color: "#0d1b2a", fontSize: "0.95rem" }}
          />
          <select
            value={form.paper}
            aria-label="而家準備邊份？"
            onChange={(e) => setForm({ ...form, paper: e.target.value })}
            style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", border: "1px solid var(--line)", background: "#ffffff", color: "#0d1b2a", fontSize: "0.95rem" }}
          >
            <option>Paper 1</option>
            <option>Paper 2</option>
            <option>Paper 3</option>
            <option>Paper 4</option>
            <option>Paper 5</option>
            <option>未決定</option>
          </select>
        </div>

        {/* Qualifier — where are you now */}
        <fieldset style={{ border: "1px solid var(--line)", borderRadius: 10, padding: "0.7rem 0.9rem" }}>
          <legend style={{ fontSize: "0.85rem", fontWeight: 600, padding: "0 0.3rem" }}>你而家？</legend>
          <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.92rem" }}>
            {["未開始溫", "溫緊", "考過，未入行", "只係想溫書"].map((opt) => (
              <label key={opt} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="radio"
                  name="whereNow"
                  checked={form.whereNow === opt}
                  onChange={() => setForm({ ...form, whereNow: opt })}
                />
                {opt}
              </label>
            ))}
          </div>
        </fieldset>

        <input
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="WhatsApp 號碼（香港）+852…"
          aria-label="WhatsApp 電話號碼"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={{ padding: "0.75rem 0.9rem", borderRadius: "10px", border: "1px solid var(--line)", background: "#ffffff", color: "#0d1b2a", fontSize: "0.95rem" }}
        />

        {/* Consent — PDPO opt-in, not a buried sentence */}
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.9rem", lineHeight: 1.5 }}>
          <input
            type="checkbox"
            required
            checked={form.consentExam}
            onChange={(e) => setForm({ ...form, consentExam: e.target.checked })}
            style={{ marginTop: "0.2rem" }}
          />
          <span>
            我同意 {OWNER.name || "本站負責人"} 用呢個號碼 WhatsApp 我，只講考試備試 / 報名。
          </span>
        </label>
        <label style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.9rem", lineHeight: 1.5 }}>
          <input
            type="checkbox"
            checked={form.consentCareer}
            onChange={(e) => setForm({ ...form, consentCareer: e.target.checked })}
            style={{ marginTop: "0.2rem" }}
          />
          <span>我都想聽入行點行。唔剔都得。</span>
        </label>

        {status === "error" && (
          <p style={{ margin: 0, color: "var(--bad)", fontSize: "0.88rem" }}>
            {error}{" "}
            {status === "error" && (
              <a
                href={waLink("報名")}
                target="_blank"
                rel="noreferrer"
                style={{ color: "var(--amber)", fontWeight: 700 }}
              >
                傳送唔到？改用 WhatsApp →
              </a>
            )}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={status === "sending"} style={{ fontSize: "1rem", padding: "0.85rem 1.4rem" }}>
          {status === "sending" ? "傳送緊…" : "留低電話，今日覆你"}
        </button>
        <p style={{ margin: 0, fontSize: "0.85rem", textAlign: "center" }}>
          <strong>今日覆。通常 30 分鐘內。</strong> 遲過今日，當我食言。一次 15 分鐘，唔會 spam。
        </p>
      </form>

      {/* FAQ — the real fears */}
      <section className="panel" style={{ marginTop: "1.25rem", padding: "1.1rem 1.3rem" }}>
        <h2 className="display" style={{ marginTop: 0, fontSize: "1.05rem" }}>
          常見問題
        </h2>
        <div style={{ fontSize: "0.92rem", lineHeight: 1.75, opacity: 0.85 }}>
          {faqs.map((f) => (
            <p key={f.q} style={{ margin: "0 0 0.6rem" }}>
              <strong>問：{f.q}</strong>
              <br />
              <strong>答：</strong>{f.a}
            </p>
          ))}
        </div>
      </section>

      {/* Privacy + disclaimer */}
      <section style={{ marginTop: "1.2rem", fontSize: "0.85rem", opacity: 0.72, lineHeight: 1.8 }}>
        <p style={{ margin: 0 }}>
          獨立團隊，與 VTC / PEAK / 保險業監管局無關。教材唔係 Past Paper，唔保證合格。{" "}
          <Link href="/disclaimer" style={{ color: "var(--amber)", fontWeight: 600 }}>免責聲明</Link>
          {" · "}
          <Link href="/privacy" style={{ color: "var(--amber)", fontWeight: 600 }}>私隱政策</Link>
          {FEE_TERMS_CONFIRMED ? (
            <>
              {" · "}
              <Link href="/exam-fee" style={{ color: "var(--amber)", fontWeight: 600 }}>考試費報銷條款</Link>
            </>
          ) : null}
        </p>
      </section>
    </div>
  );
}
