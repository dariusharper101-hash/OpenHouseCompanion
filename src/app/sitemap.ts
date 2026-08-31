import type { MetadataRoute } from "next";
import { AGENT } from "@/config/agent";

const LEARN_TOPICS = [
  "process", "programs", "taxes", "insurance",
  "warranties", "inspections", "contracts", "selling",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = AGENT.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = ["", "/tools", "/learn", "/start"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const learnRoutes = LEARN_TOPICS.map((slug) => ({
    url: `${base}/learn/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...learnRoutes];
}
