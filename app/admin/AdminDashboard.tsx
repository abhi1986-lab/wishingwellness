"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Lead = {
  id: number;
  reference: string;
  leadType: "appointment" | "callback";
  name: string;
  phone: string;
  email: string;
  location: string;
  serviceOrCondition: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: string;
  assignedTo: string;
  notes: string;
  createdAt: string;
};

const statuses = [
  "New",
  "Contact attempted",
  "Contacted",
  "Appointment scheduled",
  "Follow-up required",
  "Not interested",
  "Invalid",
  "Closed",
];

export function AdminDashboard({ adminName }: { adminName: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  const counts = useMemo(() => {
    return leads.reduce(
      (acc, lead) => {
        acc.total += 1;
        if (lead.status === "New") acc.new += 1;
        if (lead.leadType === "appointment") acc.appointments += 1;
        if (lead.leadType === "callback") acc.callbacks += 1;
        return acc;
      },
      { total: 0, new: 0, appointments: 0, callbacks: 0 },
    );
  }, [leads]);

  async function loadLeads() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/leads", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not load leads");
      setLoading(false);
      return;
    }
    setLeads(data.leads ?? []);
    setLoading(false);
  }

  async function updateLead(event: FormEvent<HTMLFormElement>, id: number) {
    event.preventDefault();
    setSavingId(id);
    setError("");

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: form.get("status"),
        notes: form.get("notes"),
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not update lead");
      setSavingId(null);
      return;
    }
    setLeads((current) =>
      current.map((lead) => (lead.id === id ? data.lead : lead)),
    );
    setSavingId(null);
  }

  useEffect(() => {
    void loadLeads();
  }, []);

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Wishing Wellness leads</h1>
          <p>Signed in as {adminName}</p>
        </div>
        <div className="admin-actions">
          <button className="button secondary" onClick={loadLeads} type="button">
            Refresh
          </button>
          <a className="button primary" href="/">
            View site
          </a>
          <a className="button secondary" href="/signout-with-chatgpt?return_to=/">
            Sign out
          </a>
        </div>
      </header>

      <section className="admin-stats" aria-label="Lead summary">
        <article>
          <span>Total leads</span>
          <strong>{counts.total}</strong>
        </article>
        <article>
          <span>New</span>
          <strong>{counts.new}</strong>
        </article>
        <article>
          <span>Appointments</span>
          <strong>{counts.appointments}</strong>
        </article>
        <article>
          <span>Callbacks</span>
          <strong>{counts.callbacks}</strong>
        </article>
      </section>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-empty">Loading leads...</p>}
      {!loading && leads.length === 0 && (
        <p className="admin-empty">No leads yet. New public form submissions will appear here.</p>
      )}

      <section className="lead-table" aria-label="Lead list">
        {leads.map((lead) => (
          <article className="lead-row" key={lead.id}>
            <div className="lead-main">
              <div>
                <span className={`lead-type ${lead.leadType}`}>
                  {lead.leadType}
                </span>
                <h2>{lead.name}</h2>
                <p>{lead.serviceOrCondition}</p>
              </div>
              <dl>
                <div>
                  <dt>Reference</dt>
                  <dd>{lead.reference}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{lead.email || "Not provided"}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{lead.location}</dd>
                </div>
                <div>
                  <dt>Preferred</dt>
                  <dd>
                    {[lead.preferredDate, lead.preferredTime]
                      .filter(Boolean)
                      .join(" ") || "Callback"}
                  </dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{new Date(lead.createdAt).toLocaleString()}</dd>
                </div>
              </dl>
              {lead.message && <p className="lead-message">{lead.message}</p>}
            </div>
            <form className="lead-update" onSubmit={(event) => updateLead(event, lead.id)}>
              <label>
                Status
                <select name="status" defaultValue={lead.status}>
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label>
                Notes
                <textarea name="notes" defaultValue={lead.notes} rows={4} />
              </label>
              <button className="button primary" disabled={savingId === lead.id} type="submit">
                {savingId === lead.id ? "Saving..." : "Save"}
              </button>
            </form>
          </article>
        ))}
      </section>
    </main>
  );
}
