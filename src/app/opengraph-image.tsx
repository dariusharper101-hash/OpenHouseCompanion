import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { AGENT } from "@/config/agent";
export const alt = `${AGENT.appName} — Big move. Real talk. Hop in.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpengraphImage() {
  const mark = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/brand/hop-wordmark.png"))).toString("base64")}`;
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: 64, background: "#261e1b", color: "#fbf6ef" }}>
    {/* ImageResponse renders original artwork inside a share-card layout. */}
    <img src={mark} width={360} height={121} alt="Hop In Real Estate" />
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}><div style={{ display: "flex", flexDirection: "column", fontSize: 62, lineHeight: 1.1 }}><div style={{ display: "flex" }}>Big move. Real talk.</div><div style={{ display: "flex" }}>Hop in.</div></div><div style={{ display: "flex", fontSize: 27 }}>Buying, selling and renting across Dallas–Fort Worth.</div></div>
    <div style={{ display: "flex", fontSize: 25 }}>{AGENT.name} · {AGENT.brokerage}</div>
  </div>, size);
}
