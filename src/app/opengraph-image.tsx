import { ImageResponse } from "next/og";
import { AGENT } from "@/config/agent";

export const alt = `${AGENT.appName} — real estate guidance in ${AGENT.serviceArea}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f172a 0%, #172554 55%, #0f172a 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            🏡
          </div>
          <div style={{ display: "flex", color: "#e2e8f0", fontSize: "34px", fontWeight: 700 }}>
            {AGENT.appName}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "#ffffff", fontSize: "68px", fontWeight: 800, lineHeight: 1.1 }}>
            Your Home. Your Future.
          </div>
          <div style={{ display: "flex", color: "#60a5fa", fontSize: "68px", fontWeight: 800, lineHeight: 1.1 }}>
            Your Agent.
          </div>
          <div style={{ display: "flex", color: "#94a3b8", fontSize: "30px", marginTop: "28px", maxWidth: "900px" }}>
            Expert guidance for buyers, sellers &amp; investors across {AGENT.serviceArea}.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "#cbd5e1", fontSize: "28px" }}>
          {AGENT.name && <div style={{ display: "flex", fontWeight: 600 }}>{AGENT.name}</div>}
          {AGENT.title && <div style={{ display: "flex", color: "#64748b" }}>· {AGENT.title}</div>}
          {AGENT.brokerage && <div style={{ display: "flex", color: "#64748b" }}>· {AGENT.brokerage}</div>}
        </div>
      </div>
    ),
    { ...size }
  );
}
