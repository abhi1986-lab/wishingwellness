import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { siteContent } from "../db/schema";
import { defaultSiteContent, mergeSiteContent, SiteContent } from "./site-content";

export const CONTENT_KEY = "homepage";

export function readSiteContent(value: string): SiteContent {
  try {
    return mergeSiteContent(JSON.parse(value));
  } catch {
    return defaultSiteContent;
  }
}

export async function loadSiteContent(): Promise<SiteContent> {
  const [row] = await getDb()
    .select()
    .from(siteContent)
    .where(eq(siteContent.key, CONTENT_KEY))
    .limit(1);

  return row ? readSiteContent(row.value) : defaultSiteContent;
}

export async function loadSiteContentWithFallback(): Promise<SiteContent> {
  try {
    return await loadSiteContent();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    if (
      message.includes("no such table") ||
      message.includes("Cloudflare D1 binding")
    ) {
      return defaultSiteContent;
    }
    throw error;
  }
}
