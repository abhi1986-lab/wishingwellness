import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { siteContent } from "../../../db/schema";
import { mergeSiteContent } from "../../site-content";
import {
  CONTENT_KEY,
  loadSiteContentWithFallback,
} from "../../site-content-store";

export async function GET() {
  try {
    const content = await loadSiteContentWithFallback();
    return Response.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as { content?: unknown };
    const content = mergeSiteContent(payload.content);
    const value = JSON.stringify(content);
    const db = getDb();

    await db
      .insert(siteContent)
      .values({
        key: CONTENT_KEY,
        value,
        updatedBy: user.email,
        updatedAt: new Date().toISOString(),
      })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: {
          value,
          updatedBy: user.email,
          updatedAt: new Date().toISOString(),
        },
      });

    return Response.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}
