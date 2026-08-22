import { OWNER, OWNER_IDENTITY_READY, TESTIMONIALS, waLink } from "@/lib/owner";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "邊個整呢個站 | Hub Cards",
  description: "Prisken Lo — 持牌個人保險中介。點解整、我會做咩、我唔會做咩。",
};

export default function AboutPage() {
  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 720 }}>
      <p style={{ margin: 0 }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 返回首頁
        </Link>
      </p>

      <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", margin: "0.8rem 0 0.9rem" }}>
        邊個整呢個站
      </h1>

      <div className="panel" style={{ padding: "1.5rem 1.6rem" }}>
        {OWNER_IDENTITY_READY ? (
          <div style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {OWNER.photo ? (
              <img
                src={OWNER.photo}
                alt={OWNER.name}
                style={{ width: "7rem", height: "7rem", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
            ) : null}
            <div style={{ minWidth: 220, flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "1.15rem" }}>
                我係 {OWNER.name}，{OWNER.title}。
              </p>
              <p style={{ margin: "0.3rem 0 0", fontSize: "0.9rem", opacity: 0.75 }}>
                牌照可以喺保險業監管局公眾登記冊查。
              </p>
              {OWNER.company ? (
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem" }}>
                  掛 {OWNER.company}。你會知自己掛邊度，唔會「入咗先算」。
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, opacity: 0.75 }}>個人資料整理中。</p>
        )}

        <h2 className="display" style={{ fontSize: "1.1rem", margin: "1.6rem 0 0.4rem", color: "var(--sea)" }}>
          點解整
        </h2>
        <p style={{ margin: 0, lineHeight: 1.8, fontSize: "0.95rem" }}>
          考 IIQE 嗰陣我覺得免費工具太散，收費平台又未問你入行就收錢。
          所以我整咗研習、題庫、模擬試，全部免費。
        </p>

        <h2 className="display" style={{ fontSize: "1.1rem", margin: "1.4rem 0 0.4rem", color: "var(--sea)" }}>
          我會做
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.95rem", lineHeight: 1.9 }}>
          <li>陪你報 PEAK</li>
          <li>講清楚考試費報銷</li>
          <li>如果你問團隊，老實講頭一年點</li>
        </ul>

        <h2 className="display" style={{ fontSize: "1.1rem", margin: "1.4rem 0 0.4rem", color: "var(--sea)" }}>
          我唔會做
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.95rem", lineHeight: 1.9 }}>
          <li>未合格就拉你入行</li>
          <li>用「考試費我哋俾」四個字掩蓋條件</li>
          <li>因為你話唔加入而收走工具</li>
          <li>扮 VTC / PEAK / 保監局</li>
        </ul>

        <h2 className="display" style={{ fontSize: "1.1rem", margin: "1.4rem 0 0.4rem", color: "var(--sea)" }}>
          聯絡
        </h2>
        <p style={{ margin: 0, fontSize: "0.95rem" }}>
          <a
            href={waLink("你好，我睇咗 About 頁，想問下備試。")}
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--amber)", fontWeight: 700 }}
          >
            WhatsApp Prisken Lo
          </a>{" "}
          · 2 日內覆，通常更快。
        </p>

        {TESTIMONIALS.length > 0 ? (
          <>
            <h2 className="display" style={{ fontSize: "1.1rem", margin: "1.4rem 0 0.4rem", color: "var(--sea)" }}>
              有人用呢度考到
            </h2>
            <div style={{ display: "grid", gap: "0.8rem" }}>
              {TESTIMONIALS.map((t) => (
                <div key={t.name} style={{ padding: "0.9rem 1rem", borderRadius: 12, background: "rgba(15,107,92,0.06)", border: "1px solid var(--line)" }}>
                  <p style={{ margin: 0, lineHeight: 1.7, fontSize: "0.95rem" }}>「{t.line}」</p>
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", opacity: 0.75 }}>
                    — {t.name} · {t.paper} · {t.when}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
