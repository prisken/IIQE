import { NextResponse } from "next/server";

/** TEMP DEBUG — reveal CRM env presence for cross-project copy. Remove after. */
export async function GET() {
  return NextResponse.json({
    url: process.env.CRM_MEMBER_SIGNUP_WEBHOOK_URL ?? "",
    secret: process.env.CRM_WEBHOOK_SECRET ?? "",
  });
}
