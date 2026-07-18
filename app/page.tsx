"use client";

import { FormEvent, useMemo, useState } from "react";

const services = [
  {
    title: "Physiotherapy",
    summary:
      "Assessment-led recovery plans for pain, stiffness, posture, mobility and everyday function.",
    tags: ["Back pain", "Neck pain", "Posture"],
  },
  {
    title: "Spine Care",
    summary:
      "Integrated support for disc concerns, sciatica, scoliosis and persistent spinal pain.",
    tags: ["Lower back", "Sciatica", "Scoliosis"],
  },
  {
    title: "Sports Rehab",
    summary:
      "Return-to-sport programmes for injuries, ACL rehabilitation and performance rebuilding.",
    tags: ["ACL", "Knee", "Shoulder"],
  },
  {
    title: "Pelvic Health",
    summary:
      "Sensitive, whole-person care for pelvic pain, postnatal recovery and related symptoms.",
    tags: ["Pelvis", "Core", "Recovery"],
  },
  {
    title: "Vestibular Rehab",
    summary:
      "Care for dizziness, balance problems, concussion, whiplash and movement confidence.",
    tags: ["Dizziness", "Balance", "Migraine"],
  },
  {
    title: "TMJ Rehabilitation",
    summary:
      "Manual therapy and corrective exercise for jaw pain, headaches and craniofacial tension.",
    tags: ["TMJ", "Headache", "Jaw"],
  },
];

const bodyAreas = [
  "Lower back",
  "Neck",
  "Shoulder",
  "Knee",
  "Ankle and foot",
  "Hip",
  "Pelvis",
  "Head and jaw",
];

const clinicians = [
  {
    name: "Founder / Clinical Lead",
    role: "Integrated pain management and manual therapy",
    focus: "Whole-body assessment, Fascia Dynamics, spine and complex cases",
  },
  {
    name: "Physiotherapy Specialist",
    role: "Mobility restoration and corrective exercise",
    focus: "Posture, strength, daily function and post-injury recovery",
  },
  {
    name: "Sports Rehab Specialist",
    role: "ACL and return-to-sport programmes",
    focus: "Testing, progressive loading and performance confidence",
  },
];

const articles = [
  "When lower-back pain needs a clinical assessment",
  "How vestibular rehabilitation helps dizziness",
  "What to expect during ACL rehabilitation",
];

const contact = {
  phoneDisplay: "096503 53668",
  phoneHref: "tel:+919650353668",
  whatsappHref: "https://wa.me/919650353668",
  email: "hello@wishingwellness.example",
  mapHref:
    "https://www.google.com/maps/place/Wishing+Wellness+Physiotherapy+Clinic+%7C+Dr.+Amrinder+Kaur+-+Best+Physiotherapist+%7C+Sector133,+Noida/@28.5080734,77.3679616,17z",
  address:
    "G 70, KP I, Sector 133, Noida, Shahpur Govardhanpur Khadar, Uttar Pradesh 201304",
};

function referenceNumber(prefix: string) {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

export default function Home() {
  const [appointmentRef, setAppointmentRef] = useState("");
  const [callbackRef, setCallbackRef] = useState("");
  const [formError, setFormError] = useState("");
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

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
          <span>Wishing Wellness</span>
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
          <p className="eyebrow">Integrated rehabilitation in Noida</p>
          <h1>Move better. Live without persistent pain.</h1>
          <p className="hero-text">
            Physiotherapy, chiropractic care, manual therapy and specialist
            rehabilitation guided by whole-body assessment, clear education and
            measurable progress.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#appointment">
              Book Appointment
            </a>
            <a className="button secondary" href="#callback">
              Free Consultation
            </a>
          </div>
          <div className="trust-strip" aria-label="Clinic highlights">
            <span>One Noida clinic</span>
            <span>Manual therapy</span>
            <span>Lead confirmation</span>
          </div>
        </div>
        <div className="hero-media" aria-label="Physiotherapy assessment">
          <img
            src="/images/clinic-care.png"
            alt="A physiotherapist guiding a patient through a mobility assessment"
          />
        </div>
      </section>

      <section className="section intro-band" id="about">
        <div className="section-title">
          <p className="eyebrow">Why Wishing Wellness</p>
          <h2>Multidisciplinary assessment, one connected plan</h2>
          <p>
            Care starts by understanding why symptoms keep returning, not just
            where they appear. Treatment can combine manual therapy, Fascia
            Dynamics, corrective exercise, vestibular training and practical
            lifestyle guidance.
          </p>
        </div>
        <div className="approach-grid">
          <article>
            <span>01</span>
            <h3>Assess the whole body</h3>
            <p>Movement, strength, posture, pain triggers and daily goals are reviewed together.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Treat and educate</h3>
            <p>Sessions pair hands-on care with simple explanations and home guidance.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Rebuild confidence</h3>
            <p>Progressive exercises help patients return to work, sport and normal routines.</p>
          </article>
        </div>
      </section>

      <section className="section" id="treatments">
        <div className="section-title wide">
          <p className="eyebrow">Treatments</p>
          <h2>Care designed around the whole body</h2>
          <p>Browse by treatment, speciality, condition or body area.</p>
        </div>
        <div className="card-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <div className="card-visual" aria-hidden="true">
                {service.title.slice(0, 2)}
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
          <p className="eyebrow">Conditions</p>
          <h2>Where are you feeling discomfort?</h2>
          <p>
            Start with a body area, then speak with the Noida clinic team about
            the relevant conditions, treatments and next step.
          </p>
        </div>
        <div className="body-area-grid">
          {bodyAreas.map((area) => (
            <a href="#appointment" key={area}>
              {area}
            </a>
          ))}
        </div>
      </section>

      <section className="split-section" id="team">
        <div className="split-visual">
          <p className="eyebrow">Clinical team</p>
          <h2>Specialists who work together</h2>
          <p>
            Profiles, qualifications and exact clinic schedules can be managed
            as structured content when final credentials are verified.
          </p>
          <a className="button secondary" href="#appointment">
            Request the right specialist
          </a>
        </div>
        <div className="clinician-list">
          {clinicians.map((clinician) => (
            <article key={clinician.name}>
              <div className="avatar" aria-hidden="true">
                {clinician.name.charAt(0)}
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
          <p className="eyebrow">Clinic</p>
          <h2>Visit Wishing Wellness Noida</h2>
          <p>
            Contact details are shown consistently across the site so enquiries
            route to the right front-desk team.
          </p>
        </div>
        <div className="location-card">
          <div>
            <h3>Noida Clinic</h3>
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
                <dd>Mon-Sat, 9:00 AM-7:00 PM</dd>
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
          <p className="eyebrow">Appointment</p>
          <h2>Request a clinic appointment</h2>
          <p>
            This is an appointment request. A coordinator will call to confirm
            the time and share any preparation details.
          </p>
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
              {services.map((service) => (
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
          <p className="eyebrow">Free consultation</p>
          <h2>Prefer a callback first?</h2>
          <p>
            Share the service or symptom you are exploring. Callback requests
            are kept separate from appointment requests.
          </p>
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
          <p className="eyebrow">Education</p>
          <h2>Latest patient guides</h2>
          <p>
            Educational articles can connect symptoms, conditions, services and
            appointment CTAs for search-led visitors.
          </p>
        </div>
        <div className="article-list">
          {articles.map((article) => (
            <a href="#appointment" key={article}>
              <span>Guide</span>
              <strong>{article}</strong>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>Wishing Wellness</strong>
          <p>Integrated physiotherapy and rehabilitation care in Noida.</p>
          <p>{contact.address}</p>
        </div>
        <div>
          <strong>Treatments</strong>
          <a href="#treatments">Physiotherapy</a>
          <a href="#treatments">Spine Care</a>
          <a href="#treatments">Sports Rehab</a>
        </div>
        <div>
          <strong>Location</strong>
          <a href="#location">Noida Clinic</a>
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
