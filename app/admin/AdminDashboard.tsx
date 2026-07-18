"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  defaultSiteContent,
  mergeSiteContent,
  PhotoContent,
  SiteContent,
} from "../site-content";

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
  const [activeTab, setActiveTab] = useState<"leads" | "content">("leads");

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

      <nav className="admin-tabs" aria-label="Admin sections">
        <button
          className={activeTab === "leads" ? "active" : ""}
          onClick={() => setActiveTab("leads")}
          type="button"
        >
          Leads
        </button>
        <button
          className={activeTab === "content" ? "active" : ""}
          onClick={() => setActiveTab("content")}
          type="button"
        >
          Site content
        </button>
      </nav>

      {activeTab === "leads" ? (
        <>
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
        </>
      ) : (
        <ContentEditor />
      )}
    </main>
  );
}

function lines(value: string[]) {
  return value.join("\n");
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function parseJson<T>(value: string, label: string): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error(`${label} must be valid JSON.`);
  }
}

function ContentEditor() {
  const [draft, setDraft] = useState<SiteContent>(defaultSiteContent);
  const [heroTrustText, setHeroTrustText] = useState(lines(defaultSiteContent.heroTrust));
  const [bodyAreasText, setBodyAreasText] = useState(lines(defaultSiteContent.bodyAreas));
  const [articlesText, setArticlesText] = useState(lines(defaultSiteContent.articles));
  const [approachJson, setApproachJson] = useState(pretty(defaultSiteContent.approach));
  const [servicesJson, setServicesJson] = useState(pretty(defaultSiteContent.services));
  const [cliniciansJson, setCliniciansJson] = useState(pretty(defaultSiteContent.clinicians));
  const [testimonialsJson, setTestimonialsJson] = useState(pretty(defaultSiteContent.testimonials));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function syncContent(content: SiteContent) {
    setDraft(content);
    setHeroTrustText(lines(content.heroTrust));
    setBodyAreasText(lines(content.bodyAreas));
    setArticlesText(lines(content.articles));
    setApproachJson(pretty(content.approach));
    setServicesJson(pretty(content.services));
    setCliniciansJson(pretty(content.clinicians));
    setTestimonialsJson(pretty(content.testimonials));
  }

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateContact<K extends keyof SiteContent["contact"]>(
    key: K,
    value: SiteContent["contact"][K],
  ) {
    setDraft((current) => ({
      ...current,
      contact: { ...current.contact, [key]: value },
    }));
  }

  async function uploadImage(file: File) {
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/uploads", {
      method: "POST",
      body: form,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Could not upload image");
    }
    return data.url as string;
  }

  function updateServicePhoto(index: number, nextPhoto: PhotoContent) {
    setDraft((current) => {
      const services = current.services.map((service, serviceIndex) =>
        serviceIndex === index ? { ...service, ...nextPhoto } : service,
      );
      setServicesJson(pretty(services));
      return { ...current, services };
    });
  }

  function updateClinicianPhoto(index: number, nextPhoto: PhotoContent) {
    setDraft((current) => {
      const clinicians = current.clinicians.map((clinician, clinicianIndex) =>
        clinicianIndex === index ? { ...clinician, ...nextPhoto } : clinician,
      );
      setCliniciansJson(pretty(clinicians));
      return { ...current, clinicians };
    });
  }

  function updateTestimonialPhoto(index: number, nextPhoto: PhotoContent) {
    setDraft((current) => {
      const testimonials = current.testimonials.map((testimonial, testimonialIndex) =>
        testimonialIndex === index
          ? { ...testimonial, ...nextPhoto }
          : testimonial,
      );
      setTestimonialsJson(pretty(testimonials));
      return { ...current, testimonials };
    });
  }

  async function loadContent() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/site-content", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not load site content");
      setLoading(false);
      return;
    }
    syncContent(mergeSiteContent(data.content));
    setLoading(false);
  }

  async function saveContent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const next = buildDraftContent();
    if (!next) {
      setSaving(false);
      return;
    }

    const response = await fetch("/api/site-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: next }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Could not save site content");
      setSaving(false);
      return;
    }
    syncContent(mergeSiteContent(data.content));
    setMessage("Site content published. Refresh the public site to see the latest version.");
    setSaving(false);
  }

  function buildDraftContent() {
    try {
      return mergeSiteContent({
        ...draft,
        heroTrust: parseLines(heroTrustText),
        bodyAreas: parseLines(bodyAreasText),
        articles: parseLines(articlesText),
        approach: parseJson(approachJson, "Approach steps"),
        services: parseJson(servicesJson, "Services"),
        clinicians: parseJson(cliniciansJson, "Clinicians"),
        testimonials: parseJson(testimonialsJson, "Testimonials"),
      });
    } catch (parseError) {
      setError(parseError instanceof Error ? parseError.message : "Invalid content");
      setMessage("");
      return null;
    }
  }

  function previewDraft() {
    setError("");
    setMessage("");
    const next = buildDraftContent();
    if (!next) return;
    localStorage.setItem("wishing-wellness-preview-content", JSON.stringify(next));
    window.open("/admin/preview", "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    void loadContent();
  }, []);

  if (loading) {
    return <p className="admin-empty">Loading site content...</p>;
  }

  return (
    <form className="content-editor" onSubmit={saveContent}>
      {error && <p className="admin-error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <section>
        <h2>Brand and hero</h2>
        <label>
          Brand name
          <input value={draft.brandName} onChange={(event) => update("brandName", event.target.value)} />
        </label>
        <label>
          Hero eyebrow
          <input value={draft.heroEyebrow} onChange={(event) => update("heroEyebrow", event.target.value)} />
        </label>
        <label>
          Hero title
          <textarea value={draft.heroTitle} onChange={(event) => update("heroTitle", event.target.value)} rows={2} />
        </label>
        <label>
          Hero text
          <textarea value={draft.heroText} onChange={(event) => update("heroText", event.target.value)} rows={4} />
        </label>
        <label>
          Hero photo
          <ImageEditor
            photo={{
              imageSrc: draft.heroImageSrc,
              imageAlt: draft.heroImageAlt,
              imageFit: draft.heroImageFit,
              imagePosition: draft.heroImagePosition,
              imageBrightness: draft.heroImageBrightness,
              imageContrast: draft.heroImageContrast,
              imageSaturation: draft.heroImageSaturation,
            }}
            onChange={(photo) => {
              setDraft((current) => ({
                ...current,
                heroImageSrc: photo.imageSrc ?? "",
                heroImageAlt: photo.imageAlt ?? "",
                heroImageFit: photo.imageFit ?? "cover",
                heroImagePosition: photo.imagePosition ?? "50% 50%",
                heroImageBrightness: photo.imageBrightness ?? 100,
                heroImageContrast: photo.imageContrast ?? 100,
                heroImageSaturation: photo.imageSaturation ?? 100,
              }));
            }}
            onUpload={uploadImage}
          />
        </label>
        <label>
          Hero trust badges
          <textarea value={heroTrustText} onChange={(event) => setHeroTrustText(event.target.value)} rows={4} />
        </label>
      </section>

      <section>
        <h2>About and approach</h2>
        <label>
          About eyebrow
          <input value={draft.aboutEyebrow} onChange={(event) => update("aboutEyebrow", event.target.value)} />
        </label>
        <label>
          About title
          <textarea value={draft.aboutTitle} onChange={(event) => update("aboutTitle", event.target.value)} rows={2} />
        </label>
        <label>
          About text
          <textarea value={draft.aboutText} onChange={(event) => update("aboutText", event.target.value)} rows={4} />
        </label>
        <label>
          Approach cards
          <textarea value={approachJson} onChange={(event) => setApproachJson(event.target.value)} rows={12} />
        </label>
      </section>

      <section>
        <h2>Treatments and conditions</h2>
        <label>
          Treatments eyebrow
          <input value={draft.treatmentsEyebrow} onChange={(event) => update("treatmentsEyebrow", event.target.value)} />
        </label>
        <label>
          Treatments title
          <textarea value={draft.treatmentsTitle} onChange={(event) => update("treatmentsTitle", event.target.value)} rows={2} />
        </label>
        <label>
          Treatments text
          <textarea value={draft.treatmentsText} onChange={(event) => update("treatmentsText", event.target.value)} rows={3} />
        </label>
        <label>
          Service cards
          <textarea value={servicesJson} onChange={(event) => setServicesJson(event.target.value)} rows={16} />
        </label>
        <p className="editor-hint">
          Each treatment card can use the upload controls below. The JSON stays available for changing titles, summaries and tags.
        </p>
        <div className="photo-editor-list">
          {draft.services.map((service, index) => (
            <ImageEditor
              key={`${service.title}-${index}`}
              label={service.title}
              photo={service}
              onChange={(photo) => updateServicePhoto(index, photo)}
              onUpload={uploadImage}
            />
          ))}
        </div>
        <label>
          Conditions eyebrow
          <input value={draft.conditionsEyebrow} onChange={(event) => update("conditionsEyebrow", event.target.value)} />
        </label>
        <label>
          Conditions title
          <textarea value={draft.conditionsTitle} onChange={(event) => update("conditionsTitle", event.target.value)} rows={2} />
        </label>
        <label>
          Conditions text
          <textarea value={draft.conditionsText} onChange={(event) => update("conditionsText", event.target.value)} rows={3} />
        </label>
        <label>
          Body areas
          <textarea value={bodyAreasText} onChange={(event) => setBodyAreasText(event.target.value)} rows={8} />
        </label>
      </section>

      <section>
        <h2>Team, location and contact</h2>
        <label>
          Team eyebrow
          <input value={draft.teamEyebrow} onChange={(event) => update("teamEyebrow", event.target.value)} />
        </label>
        <label>
          Team title
          <textarea value={draft.teamTitle} onChange={(event) => update("teamTitle", event.target.value)} rows={2} />
        </label>
        <label>
          Team text
          <textarea value={draft.teamText} onChange={(event) => update("teamText", event.target.value)} rows={4} />
        </label>
        <label>
          Clinician cards
          <textarea value={cliniciansJson} onChange={(event) => setCliniciansJson(event.target.value)} rows={12} />
        </label>
        <p className="editor-hint">
          Each clinician card can use the upload controls below. The JSON stays available for changing names, roles and focus.
        </p>
        <div className="photo-editor-list">
          {draft.clinicians.map((clinician, index) => (
            <ImageEditor
              key={`${clinician.name}-${index}`}
              label={clinician.name}
              photo={clinician}
              onChange={(photo) => updateClinicianPhoto(index, photo)}
              onUpload={uploadImage}
            />
          ))}
        </div>
        <label>
          Testimonials eyebrow
          <input value={draft.testimonialsEyebrow} onChange={(event) => update("testimonialsEyebrow", event.target.value)} />
        </label>
        <label>
          Testimonials title
          <input value={draft.testimonialsTitle} onChange={(event) => update("testimonialsTitle", event.target.value)} />
        </label>
        <label>
          Testimonial video cards
          <textarea value={testimonialsJson} onChange={(event) => setTestimonialsJson(event.target.value)} rows={14} />
        </label>
        <p className="editor-hint">
          Add YouTube links in videoUrl. Use the thumbnail controls below to match the video-card style.
        </p>
        <div className="photo-editor-list">
          {draft.testimonials.map((testimonial, index) => (
            <ImageEditor
              key={`${testimonial.title}-${index}`}
              label={testimonial.title}
              photo={testimonial}
              onChange={(photo) => updateTestimonialPhoto(index, photo)}
              onUpload={uploadImage}
            />
          ))}
        </div>
        <label>
          Clinic name
          <input value={draft.clinicName} onChange={(event) => update("clinicName", event.target.value)} />
        </label>
        <label>
          Clinic hours
          <input value={draft.clinicHours} onChange={(event) => update("clinicHours", event.target.value)} />
        </label>
        <label>
          Phone display
          <input value={draft.contact.phoneDisplay} onChange={(event) => updateContact("phoneDisplay", event.target.value)} />
        </label>
        <label>
          Phone link
          <input value={draft.contact.phoneHref} onChange={(event) => updateContact("phoneHref", event.target.value)} />
        </label>
        <label>
          WhatsApp link
          <input value={draft.contact.whatsappHref} onChange={(event) => updateContact("whatsappHref", event.target.value)} />
        </label>
        <label>
          Email
          <input value={draft.contact.email} onChange={(event) => updateContact("email", event.target.value)} />
        </label>
        <label>
          Address
          <textarea value={draft.contact.address} onChange={(event) => updateContact("address", event.target.value)} rows={3} />
        </label>
        <label>
          Google Maps link
          <textarea value={draft.contact.mapHref} onChange={(event) => updateContact("mapHref", event.target.value)} rows={3} />
        </label>
      </section>

      <section>
        <h2>Forms, articles and footer</h2>
        <label>
          Appointment title
          <input value={draft.appointmentTitle} onChange={(event) => update("appointmentTitle", event.target.value)} />
        </label>
        <label>
          Appointment text
          <textarea value={draft.appointmentText} onChange={(event) => update("appointmentText", event.target.value)} rows={3} />
        </label>
        <label>
          Callback title
          <input value={draft.callbackTitle} onChange={(event) => update("callbackTitle", event.target.value)} />
        </label>
        <label>
          Callback text
          <textarea value={draft.callbackText} onChange={(event) => update("callbackText", event.target.value)} rows={3} />
        </label>
        <label>
          Articles title
          <input value={draft.articlesTitle} onChange={(event) => update("articlesTitle", event.target.value)} />
        </label>
        <label>
          Articles
          <textarea value={articlesText} onChange={(event) => setArticlesText(event.target.value)} rows={6} />
        </label>
        <label>
          Footer text
          <textarea value={draft.footerText} onChange={(event) => update("footerText", event.target.value)} rows={3} />
        </label>
      </section>

      <div className="content-editor-actions">
        <button className="button secondary" onClick={loadContent} type="button">
          Reload
        </button>
        <button className="button secondary" onClick={previewDraft} type="button">
          Preview draft
        </button>
        <button className="button primary" disabled={saving} type="submit">
          {saving ? "Publishing..." : "Publish to live site"}
        </button>
      </div>
    </form>
  );
}

function ImageEditor({
  label = "Photo",
  photo,
  onChange,
  onUpload,
}: {
  label?: string;
  photo: PhotoContent;
  onChange: (photo: PhotoContent) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function update<K extends keyof PhotoContent>(key: K, value: PhotoContent[K]) {
    onChange({ ...photo, [key]: value });
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await onUpload(file);
      onChange({
        ...photo,
        imageSrc: url,
        imageAlt: photo.imageAlt || file.name.replace(/\.[^.]+$/, ""),
      });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Could not upload image");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="image-editor">
      <div className="image-editor-preview">
        {photo.imageSrc ? (
          <img
            src={photo.imageSrc}
            alt={photo.imageAlt || label}
            style={{
              objectFit: photo.imageFit ?? "cover",
              objectPosition: photo.imagePosition ?? "50% 50%",
              filter: `brightness(${photo.imageBrightness ?? 100}%) contrast(${photo.imageContrast ?? 100}%) saturate(${photo.imageSaturation ?? 100}%)`,
            }}
          />
        ) : (
          <span>No photo</span>
        )}
      </div>
      <div className="image-editor-controls">
        <strong>{label}</strong>
        <label className="upload-button">
          {uploading ? "Uploading..." : "Upload replacement photo"}
          <input
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={uploading}
            onChange={handleFileChange}
            type="file"
          />
        </label>
        {uploadError && <p className="admin-error">{uploadError}</p>}
        <label>
          Photo URL
          <input
            value={photo.imageSrc ?? ""}
            onChange={(event) => update("imageSrc", event.target.value)}
          />
        </label>
        <label>
          Alt text
          <input
            value={photo.imageAlt ?? ""}
            onChange={(event) => update("imageAlt", event.target.value)}
          />
        </label>
        <div className="photo-control-grid">
          <label>
            Fit
            <select
              value={photo.imageFit ?? "cover"}
              onChange={(event) =>
                update("imageFit", event.target.value as PhotoContent["imageFit"])
              }
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </label>
          <label>
            Focus
            <select
              value={photo.imagePosition ?? "50% 50%"}
              onChange={(event) => update("imagePosition", event.target.value)}
            >
              <option value="50% 50%">Center</option>
              <option value="50% 0%">Top</option>
              <option value="50% 100%">Bottom</option>
              <option value="0% 50%">Left</option>
              <option value="100% 50%">Right</option>
              <option value="0% 0%">Top left</option>
              <option value="100% 0%">Top right</option>
              <option value="0% 100%">Bottom left</option>
              <option value="100% 100%">Bottom right</option>
            </select>
          </label>
          <label>
            Brightness
            <input
              max="140"
              min="60"
              onChange={(event) => update("imageBrightness", Number(event.target.value))}
              type="range"
              value={photo.imageBrightness ?? 100}
            />
          </label>
          <label>
            Contrast
            <input
              max="140"
              min="60"
              onChange={(event) => update("imageContrast", Number(event.target.value))}
              type="range"
              value={photo.imageContrast ?? 100}
            />
          </label>
          <label>
            Saturation
            <input
              max="160"
              min="0"
              onChange={(event) => update("imageSaturation", Number(event.target.value))}
              type="range"
              value={photo.imageSaturation ?? 100}
            />
          </label>
        </div>
        <button
          className="button secondary"
          onClick={() =>
            onChange({
              ...photo,
              imageSrc: "",
              imageAlt: "",
              imageFit: "cover",
              imagePosition: "50% 50%",
              imageBrightness: 100,
              imageContrast: 100,
              imageSaturation: 100,
            })
          }
          type="button"
        >
          Remove photo
        </button>
      </div>
    </div>
  );
}
