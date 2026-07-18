import { eq } from "drizzle-orm";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { getDb } from "../../../../db";
import { leads } from "../../../../db/schema";

const VALID_STATUSES = new Set([
  "New",
  "Contact attempted",
  "Contacted",
  "Appointment scheduled",
  "Not interested",
  "Invalid",
  "Follow-up required",
  "Closed",
]);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Sign in required" }, { status: 401 });
  }

  const { id } = await params;
  const leadId = Number(id);
  const payload = (await request.json()) as Record<string, unknown>;
  const status = clean(payload.status);
  const notes = clean(payload.notes);

  if (!Number.isInteger(leadId) || leadId < 1) {
    return Response.json({ error: "Invalid lead id" }, { status: 400 });
  }
  if (!VALID_STATUSES.has(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const [lead] = await getDb()
      .update(leads)
      .set({
        status: status as typeof leads.$inferInsert.status,
        notes,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(leads.id, leadId))
      .returning();

    if (!lead) {
      return Response.json({ error: "Lead not found" }, { status: 404 });
    }

    return Response.json({ lead });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}
