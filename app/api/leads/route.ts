import { desc } from "drizzle-orm";
import { getChatGPTUser } from "../../chatgpt-auth";
import { getDb } from "../../../db";
import { leads } from "../../../db/schema";

const VALID_TYPES = new Set(["appointment", "callback"]);

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function referenceNumber(prefix: string) {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

function toErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("no such table") || message.includes("leads")) {
    return "Lead storage is not available yet. Please try again shortly.";
  }
  return message;
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Sign in required" }, { status: 401 });
  }

  try {
    const rows = await getDb()
      .select()
      .from(leads)
      .orderBy(desc(leads.createdAt), desc(leads.id))
      .limit(100);

    return Response.json({ leads: rows });
  } catch (error) {
    return Response.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const leadType = clean(payload.leadType);
    const name = clean(payload.name);
    const phone = clean(payload.phone);
    const serviceOrCondition = clean(payload.serviceOrCondition);
    const location = clean(payload.location) || "Noida";
    const privacyConsent = Boolean(payload.privacyConsent);

    if (!VALID_TYPES.has(leadType)) {
      return Response.json({ error: "Invalid lead type" }, { status: 400 });
    }
    if (!name || !phone || !serviceOrCondition || !privacyConsent) {
      return Response.json(
        { error: "Name, phone, service or condition, and consent are required" },
        { status: 400 },
      );
    }

    const reference = referenceNumber(leadType === "appointment" ? "WWA" : "WWC");
    const [lead] = await getDb()
      .insert(leads)
      .values({
        reference,
        leadType: leadType as "appointment" | "callback",
        name,
        phone,
        email: clean(payload.email),
        location,
        serviceOrCondition,
        preferredDate: clean(payload.preferredDate),
        preferredTime: clean(payload.preferredTime),
        message: clean(payload.message),
        marketingConsent: Boolean(payload.marketingConsent),
        privacyConsent,
        sourcePage: clean(payload.sourcePage) || "website",
      })
      .returning();

    return Response.json({ lead }, { status: 201 });
  } catch (error) {
    return Response.json({ error: toErrorMessage(error) }, { status: 500 });
  }
}
