import { NextResponse } from "next/server";

/**
 * Hub Cards lead capture — POST /api/leads
 * Body: { name?, phone?, email?, paper?, source? }
 * Forwards to the team CRM webhook (same pattern as PPA member sync).
 */
export async function POST(request: Request) {
  const webhookUrl = process.env.CRM_MEMBER_SIGNUP_WEBHOOK_URL;
  const webhookSecret = process.env.CRM_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    return NextResponse.json(
      { ok: false, error: "CRM not configured on server" },
      { status: 500 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();
  const paper = String(body.paper || "").trim();
  const source = String(body.source || "Hub Cards").trim();
  const expectations = String(body.expectations || "").trim();

  // At least one contact channel required
  if (!phone && !email) {
    return NextResponse.json(
      { ok: false, error: "phone or email required" },
      { status: 400 },
    );
  }

  const payload = {
    email: email || null,
    name: name || null,
    contactNumber: phone || null,
    ...(phone ? { phone } : {}),
    memberId: `hubcards-${Date.now()}`,
    provider: "Hub Cards",
    role: "Recruit Lead",
    source,
    signedUpAt: new Date().toISOString(),
    paper: paper || null,
    ...(expectations ? { expectations } : {}),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": webhookSecret,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[hubcards-leads] CRM webhook failed ${response.status}: ${text}`);
      return NextResponse.json(
        { ok: false, error: "crm webhook failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[hubcards-leads] CRM webhook request failed:", error);
    return NextResponse.json({ ok: false, error: "network error" }, { status: 502 });
  }
}
