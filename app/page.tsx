"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { defaultSiteContent, mergeSiteContent, SiteContent } from "./site-content";

function referenceNumber(prefix: string) {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function Home() {
  const [appointmentRef, setAppointmentRef] = useState("");
  const [callbackRef, setCallbackRef] = useState("");
  const [formError, setFormError] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const contact = content.contact;

  useEffect(() => {
    async function loadContent() {
      const response = await fetch("/api/site-content", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json();
      setContent(mergeSiteContent(data.content));
    }

    void loadContent();
  }, []);

  async function submitAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadType: "appointment",
        name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email"),
        location: form.get("location"),
        serviceOrCondition: form.get("service"),
        preferredDate: form.get("date"),
        preferredTime: form.get("time"),
        message: form.get("message"),
        marketingConsent: form.get("marketingConsent") === "on",
        privacyConsent: form.get("privacyConsent") === "on",
        sourcePage: "homepage-appointment-form",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setFormError(data.error ?? "Could not submit the appointment request.");
      return;
    }
    setAppointmentRef(data.lead?.reference ?? referenceNumber("WWA"));
    event.currentTarget.reset();
  }

  async function submitCallback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadType: "callback",
        name: form.get("callbackName"),
        phone: form.get("callbackPhone"),
        location: "Noida",
        serviceOrCondition: form.get("callbackService"),
        preferredTime: form.get("callbackTime"),
        privacyConsent: form.get("callbackConsent") === "on",
        sourcePage: "homepage-callback-form",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      setFormError(data.error ?? "Could not submit the callback request.");
      return;
    }
    setCallbackRef(data.lead?.reference ?? referenceNumber("WWC"));
    event.currentTarget.reset();
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Wishing Wellness home">
          <span className="brand-mark">W</span>
          <span>{content.brandName}</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#treatments">Treatments</a>
          <a href="#conditions">Conditions</a>
          <a href="#team">Team</a>
          <a href="#location">Location</a>
          <a href="#articles">Blogs</a>
        </nav>
        <div className="header-actions">
          <a className="phone-link" href={contact.phoneHref}>
            Call Noida
          </a>
          <a className="button primary small" href="#appointment">
            Book Appointment
          </a>
        </div>
        <a className="menu-button" href="#appointment" aria-label="Open booking">
          Book
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p className="hero-text">{content.heroText}</p>
          <div className="hero-actions">
            <a className="button primary" href="#appointment">
              Book Appointment
            </a>
            <a className="button secondary" href="#callback">
              Free Consultation
            </a>
          </div>
          <div className="trust-strip" aria-label="Clinic highlights">
            {content.heroTrust.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="hero-media" aria-label="Physiotherapy assessment">
          <img
            src={content.heroImageSrc}
            alt={content.heroImageAlt}
          />
        </div>
      </section>

      <section className="section intro-band" id="about">
        <div className="section-title">
          <p className="eyebrow">{content.aboutEyebrow}</p>
          <h2>{content.aboutTitle}</h2>
          <p>{content.aboutText}</p>
        </div>
        <div className="approach-grid">
          {content.approach.map((item) => (
            <article key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="treatments">
        <div className="section-title wide">
          <p className="eyebrow">{content.treatmentsEyebrow}</p>
          <h2>{content.treatmentsTitle}</h2>
          <p>{content.treatmentsText}</p>
        </div>
        <div className="card-grid">
          {content.services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="card-visual" aria-hidden="true">
                {service.imageSrc ? (
                  <img
                    src={service.imageSrc}
                    alt={service.imageAlt || `${service.title} treatment`}
                  />
                ) : (
                  service.title.slice(0, 2)
                )}
              </div>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
              <div className="tag-row">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section condition-section" id="conditions">
        <div className="section-title">
          <p className="eyebrow">{content.conditionsEyebrow}</p>
          <h2>{content.conditionsTitle}</h2>
          <p>{content.conditionsText}</p>
        </div>
        <div className="body-area-grid">
          {content.bodyAreas.map((area) => (
            <a href="#appointment" key={area}>
              {area}
            </a>
          ))}
        </div>
      </section>

      <section className="split-section" id="team">
        <div className="split-visual">
          <p className="eyebrow">{content.teamEyebrow}</p>
          <h2>{content.teamTitle}</h2>
          <p>{content.teamText}</p>
          <a className="button secondary" href="#appointment">
            Request the right specialist
          </a>
        </div>
        <div className="clinician-list">
          {content.clinicians.map((clinician) => (
            <article key={clinician.name}>
              <div className="avatar">
                {clinician.imageSrc ? (
                  <img
                    src={clinician.imageSrc}
                    alt={clinician.imageAlt || clinician.name}
                  />
                ) : (
                  <span aria-hidden="true">{clinician.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <h3>{clinician.name}</h3>
                <p>{clinician.role}</p>
                <span>{clinician.focus}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section location-band" id="location">
        <div className="section-title">
          <p className="eyebrow">{content.locationEyebrow}</p>
          <h2>{content.locationTitle}</h2>
          <p>{content.locationText}</p>
        </div>
        <div className="location-card">
          <div>
            <h3>{content.clinicName}</h3>
            <p>{contact.address}</p>
            <dl>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={contact.whatsappHref}>Message the clinic</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>{content.clinicHours}</dd>
              </div>
            </dl>
            <a className="button secondary map-link" href={contact.mapHref}>
              Open in Google Maps
            </a>
          </div>
          <a
            className="map-panel"
            href={contact.mapHref}
            aria-label="Open Wishing Wellness Noida in Google Maps"
          >
            <span>Noida</span>
          </a>
        </div>
      </section>

      <section className="forms-section" id="appointment">
        <div className="form-intro">
          <p className="eyebrow">{content.appointmentEyebrow}</p>
          <h2>{content.appointmentTitle}</h2>
          <p>{content.appointmentText}</p>
          <div className="support-box">
            <strong>Need help now?</strong>
            <span>Call or WhatsApp the Noida clinic.</span>
          </div>
        </div>
        <form className="lead-form" onSubmit={submitAppointment}>
          <h3>Your details</h3>
          <label>
            Full name
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            Phone number
            <input name="phone" type="tel" autoComplete="tel" required />
          </label>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label>
            Preferred location
            <select name="location" defaultValue="Noida" required>
              <option>Noida</option>
            </select>
          </label>
          <label>
            Service or condition
            <select name="service" defaultValue="" required>
              <option value="" disabled>
                Select a service
              </option>
              {content.services.map((service) => (
                <option key={service.title}>{service.title}</option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              Preferred date
              <input name="date" type="date" min={today} required />
            </label>
            <label>
              Preferred time
              <input name="time" type="time" />
            </label>
          </div>
          <label>
            Message
            <textarea name="message" rows={4} />
          </label>
          <label className="check">
            <input name="privacyConsent" type="checkbox" required />
            <span>I agree to the privacy policy and processing of this enquiry.</span>
          </label>
          <label className="check">
            <input name="marketingConsent" type="checkbox" />
            <span>I agree to receive wellness updates and follow-up communication.</span>
          </label>
          <button className="button primary" type="submit">
            Submit appointment request
          </button>
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
          {appointmentRef && (
            <p className="success" role="status">
              Request received. Reference {appointmentRef}. The clinic team will
              call within one working day.
            </p>
          )}
          <input type="hidden" name="leadSource" value="website-homepage" />
        </form>
      </section>

      <section className="callback-section" id="callback">
        <div>
          <p className="eyebrow">{content.callbackEyebrow}</p>
          <h2>{content.callbackTitle}</h2>
          <p>{content.callbackText}</p>
        </div>
        <form className="callback-form" onSubmit={submitCallback}>
          <label>
            Name
            <input name="callbackName" required />
          </label>
          <label>
            Phone number
            <input name="callbackPhone" type="tel" required />
          </label>
          <label>
            Service or condition
            <input name="callbackService" required />
          </label>
          <label>
            Preferred callback time
            <input name="callbackTime" />
          </label>
          <label className="check">
            <input name="callbackConsent" type="checkbox" required />
            <span>I consent to being contacted about this enquiry.</span>
          </label>
          <button className="button secondary light" type="submit">
            Request free consultation
          </button>
          {callbackRef && (
            <p className="success light-text" role="status">
              Callback request received. Reference {callbackRef}.
            </p>
          )}
        </form>
      </section>

      <section className="section articles" id="articles">
        <div className="section-title">
          <p className="eyebrow">{content.articlesEyebrow}</p>
          <h2>{content.articlesTitle}</h2>
          <p>{content.articlesText}</p>
        </div>
        <div className="article-list">
          {content.articles.map((article) => (
            <a href="#appointment" key={article}>
              <span>Guide</span>
              <strong>{article}</strong>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>{content.brandName}</strong>
          <p>{content.footerText}</p>
          <p>{contact.address}</p>
        </div>
        <div>
          <strong>Treatments</strong>
          {content.services.slice(0, 3).map((service) => (
            <a href="#treatments" key={service.title}>
              {service.title}
            </a>
          ))}
        </div>
        <div>
          <strong>Location</strong>
          <a href="#location">{content.clinicName}</a>
          <a href={contact.phoneHref}>Call {contact.phoneDisplay}</a>
          <a href={contact.whatsappHref}>WhatsApp</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.mapHref}>Google Maps</a>
        </div>
        <div>
          <strong>Compliance</strong>
          <span>Privacy consent included</span>
          <span>Medical advice requires clinical assessment</span>
          <a href="/admin">Admin login</a>
        </div>
      </footer>
    </main>
  );
}
