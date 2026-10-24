import { AGENT } from "@/config/agent";

// "Save Darius's contact" on the /specials thank-you. Built from agent config
// at build time; iOS Safari opens text/vcard straight into Add Contact.
export const dynamic = "force-static";

function v(s: string) {
  return s.replace(/([\\,;])/g, "\\$1");
}

export function GET() {
  const [first, ...rest] = AGENT.name.split(" ");
  const digits = AGENT.phone.replace(/\D/g, "");
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${v(rest.join(" "))};${v(first)};;;`,
    `FN:${v(AGENT.name)}`,
    AGENT.brokerage ? `ORG:${v(AGENT.brokerage)}` : "",
    AGENT.title ? `TITLE:${v(AGENT.title)}` : "",
    digits ? `TEL;TYPE=CELL:+1${digits.slice(-10)}` : "",
    AGENT.email ? `EMAIL:${v(AGENT.email)}` : "",
    `URL:${AGENT.siteUrl}`,
    "END:VCARD",
  ].filter(Boolean);

  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="darius-harper.vcf"',
    },
  });
}
