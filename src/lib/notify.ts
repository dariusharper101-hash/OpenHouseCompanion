import type { Lead } from "@/types/lead";
import { PRODUCT_LABELS } from "@/types/lead";

// ─── New-lead notification ─────────────────────────────────────────────────────
// Emails you the moment a lead comes in, via Resend's HTTP API (no SDK needed).
// Fully env-gated and best-effort: if it's not configured or the send fails, the
// lead is still saved and the request still succeeds — notifications never block.
//
// To enable: set RESEND_API_KEY and NOTIFY_EMAIL (where alerts go). Optionally set
// NOTIFY_FROM (a verified sender; defaults to Resend's onboarding address, which
// works for testing without domain setup).

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL;
const NOTIFY_FROM = process.env.NOTIFY_FROM || "Hop In Real Estate <onboarding@resend.dev>";

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value: unknown): string {
  if (value === "" || value === null || value === undefined) return "";
  const v = typeof value === "boolean" ? (value ? "Yes" : "No") : esc(value);
  return `<tr><td style="padding:4px 12px 4px 0;color:#64748b;font-size:13px;">${label}</td><td style="padding:4px 0;color:#0f172a;font-size:13px;font-weight:500;">${v}</td></tr>`;
}

function buildHtml(lead: Lead): string {
  const isBuyer = lead.role === "buying" || lead.role === "both";
  const isSeller = lead.role === "selling" || lead.role === "both";
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:560px;">
    <h2 style="color:#2563eb;margin:0 0 4px;">New lead: ${esc(lead.firstName)} ${esc(lead.lastName)}</h2>
    <p style="color:#64748b;margin:0 0 16px;font-size:13px;">
      ${esc(PRODUCT_LABELS[lead.product] ?? lead.product)} &middot; ${new Date(lead.createdAt).toLocaleString("en-US")}
    </p>
    <table style="border-collapse:collapse;width:100%;">
      ${row("Email", lead.email)}
      ${row("Phone", lead.phone)}
      ${row("Looking to", lead.role)}
      ${isBuyer ? row("Client type", lead.clientType) : ""}
      ${isBuyer ? row("Timeline", lead.timeline) : ""}
      ${isBuyer ? row("Pre-approved", lead.isPreApproved) : ""}
      ${isBuyer ? row("Budget", [lead.budgetMin, lead.budgetMax].filter(Boolean).join(" – ")) : ""}
      ${isBuyer ? row("Areas", lead.neighborhoods) : ""}
      ${isBuyer ? row("Veteran", lead.isVeteran) : ""}
      ${isSeller ? row("Property", lead.sellerAddress) : ""}
      ${isSeller ? row("Est. value", lead.sellerEstimatedValue) : ""}
      ${isSeller ? row("Sell timeline", lead.sellerTimeline) : ""}
      ${row("Source", lead.source)}
      ${row("Notes", lead.notes)}
    </table>
    <p style="margin:16px 0 0;font-size:13px;">
      <a href="tel:${esc(lead.phone)}" style="color:#2563eb;">Call</a> &nbsp;·&nbsp;
      <a href="mailto:${esc(lead.email)}" style="color:#2563eb;">Email</a>
    </p>
  </div>`;
}

export async function notifyNewLead(lead: Lead): Promise<void> {
  if (!RESEND_API_KEY || !NOTIFY_EMAIL) {
    // Not configured — record which piece is missing so this is diagnosable
    // from the logs instead of failing silently.
    console.warn(
      "Lead notification skipped — email not configured:",
      `RESEND_API_KEY=${RESEND_API_KEY ? "set" : "MISSING"}`,
      `NOTIFY_EMAIL=${NOTIFY_EMAIL ? "set" : "MISSING"}`
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [NOTIFY_EMAIL],
        subject: `New ${PRODUCT_LABELS[lead.product] ?? lead.product} lead: ${lead.firstName} ${lead.lastName} (${lead.role})`,
        html: buildHtml(lead),
        reply_to: lead.email,
      }),
    });
    if (!res.ok) {
      console.error("Lead notification failed:", res.status, await res.text());
    } else {
      console.log(`Lead notification sent to ${NOTIFY_EMAIL} for ${lead.firstName} ${lead.lastName}`);
    }
  } catch (err) {
    console.error("Lead notification error:", err);
  }
}
