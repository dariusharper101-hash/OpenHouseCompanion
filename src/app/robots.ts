import type { MetadataRoute } from "next";
import { AGENT } from "@/config/agent";

export default function robots(): MetadataRoute.Robots {
  const base = AGENT.siteUrl.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the private dashboard out of search results.
      disallow: "/admin",
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
