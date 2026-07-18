import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  reference: text("reference").notNull().unique(),
  leadType: text("lead_type", {
    enum: ["appointment", "callback"],
  }).notNull(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  location: text("location").notNull().default("Noida"),
  serviceOrCondition: text("service_or_condition").notNull(),
  preferredDate: text("preferred_date").notNull().default(""),
  preferredTime: text("preferred_time").notNull().default(""),
  message: text("message").notNull().default(""),
  marketingConsent: integer("marketing_consent", { mode: "boolean" })
    .notNull()
    .default(false),
  privacyConsent: integer("privacy_consent", { mode: "boolean" })
    .notNull()
    .default(false),
  sourcePage: text("source_page").notNull().default("website"),
  status: text("status", {
    enum: [
      "New",
      "Contact attempted",
      "Contacted",
      "Appointment scheduled",
      "Not interested",
      "Invalid",
      "Follow-up required",
      "Closed",
    ],
  })
    .notNull()
    .default("New"),
  assignedTo: text("assigned_to").notNull().default("Noida front desk"),
  notes: text("notes").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
