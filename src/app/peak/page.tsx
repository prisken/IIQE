import { FEE_TERMS_CONFIRMED } from "@/lib/owner";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "自己上 PEAK 報 IIQE | Hub Cards",
  description:
    "官方報名步驟、PPME vs CSME、當日要帶咩、合格之後點 — 自己搞得掂。",
};

export default function PeakPage() {
  return (
    <div className="shell" style={{ padding: "1.5rem 0 3rem", maxWidth: 780 }}>
      <p style={{ margin: 0 }}>
        <Link href="/" style={{ color: "var(--sea)" }}>
          ← 返去溫書
        </Link>
      </p>

      <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", margin: "0.8rem 0 0.4rem" }}>
        自己上 PEAK 報 IIQE
      </h1>
      <p style={{ lineHeight: 1.7, opacity: 0.85, maxWidth: 640, fontSize: "0.95rem" }}>
        官方報名係唯一合法渠道。我唔代收報名費，亦唔代你撳。
        想有人 WhatsApp 一齊填，去 <Link href="/recruit" style={{ color: "var(--amber)", fontWeight: 600 }}>/recruit</Link>。
        呢頁俾你自己搞得掂。
      </p>

      <div className="panel" style={{ marginTop: "1rem", padding: "1.2rem 1.4rem" }}>
        <p style={{ margin: 0, fontWeight: 700 }}>報名系統（官方）</p>
        <p style={{ margin: "0.3rem 0 0", fontSize: "0.95rem" }}>
          <a href="https://www.vtc.edu.hk/cpdc" target="_blank" rel="noreferrer" style={{ color: "var(--amber)", fontWeight: 600 }}>
            https://www.vtc.edu.hk/cpdc ↗
          </a>
        </p>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.82rem", opacity: 0.7 }}>
          核對網址係 vtc.edu.hk / peak.edu.hk，唔好經任何代報。
        </p>
      </div>

      <h2 className="display" style={{ fontSize: "1.2rem", margin: "1.4rem 0 0.5rem", color: "var(--sea)" }}>
        報之前準備
      </h2>
      <div className="panel" style={{ padding: "1.1rem 1.3rem", fontSize: "0.95rem", lineHeight: 1.9 }}>
        <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>姓名必須同香港身份證 / 護照完全一致</li>
          <li>香港手提電話</li>
          <li>電郵（收確認信）</li>
          <li>Visa / Master / 銀聯</li>
          <li>提早大約兩星期，場次先到先得</li>
          <li>一經提交：唔改期、唔取消、唔退費</li>
        </ul>
      </div>

      <h2 className="display" style={{ fontSize: "1.2rem", margin: "1.4rem 0 0.5rem", color: "var(--sea)" }}>
        PPME 定 CSME？
      </h2>
      <div className="panel" style={{ padding: "1.1rem 1.3rem", fontSize: "0.95rem", lineHeight: 1.9 }}>
        <p style={{ margin: 0 }}>
          <strong>筆試 PPME</strong>：平啲（P1–3 = HK$195），要等成績。
        </p>
        <p style={{ margin: "0.4rem 0 0" }}>
          <strong>電腦試 CSME</strong>：P1–3 = HK$265，當日知合格與否，可以旗標。
        </p>
        <p style={{ margin: "0.4rem 0 0", opacity: 0.8 }}>
          我自己考會揀 CSME。貴 HK$70，換即日知。P5 / MPFE 費用唔同，睇{" "}
          {FEE_TERMS_CONFIRMED ? (
            <Link href="/exam-fee" style={{ color: "var(--amber)", fontWeight: 600 }}>
              /exam-fee
            </Link>
          ) : (
            "PEAK 官方表"
          )}{" "}
          旁邊嗰個官方表。
        </p>
      </div>

      <h2 className="display" style={{ fontSize: "1.2rem", margin: "1.4rem 0 0.5rem", color: "var(--sea)" }}>
        當日
      </h2>
      <div className="panel" style={{ padding: "1.1rem 1.3rem", fontSize: "0.95rem", lineHeight: 1.9 }}>
        <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
          <li>提早 30 分鐘</li>
          <li>帶身份證原件 + 確認電郵</li>
          <li>電話、智能手錶、電子產品唔入場</li>
          <li>成績只有合格 / 不合格。官方唔會話你幾多分、邊題錯。</li>
        </ul>
      </div>

      <h2 className="display" style={{ fontSize: "1.2rem", margin: "1.4rem 0 0.5rem", color: "var(--sea)" }}>
        合格之後
      </h2>
      <div className="panel" style={{ padding: "1.1rem 1.3rem", fontSize: "0.95rem", lineHeight: 1.9 }}>
        <p style={{ margin: 0 }}>
          考試只係資格。出牌要經保險業監管局，仲有委任、培訓、其他法定步驟。
          呢個站唔處理出牌。
        </p>
      </div>

      <div style={{ marginTop: "1.4rem", display: "flex", gap: "0.7rem", flexWrap: "wrap", alignItems: "center" }}>
        <a href="https://www.vtc.edu.hk/cpdc" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: "0.95rem" }}>
          我自己去報（官方）→
        </a>
        <Link href="/recruit" className="btn btn-amber" style={{ fontSize: "0.95rem" }}>
          想人陪你揀場次 →
        </Link>
        {FEE_TERMS_CONFIRMED ? (
          <Link href="/exam-fee" className="btn btn-ghost" style={{ fontSize: "0.95rem" }}>
            先睇考試費報銷條款 →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
