export type PhotoContent = {
  imageSrc?: string;
  imageAlt?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  imageBrightness?: number;
  imageContrast?: number;
  imageSaturation?: number;
};

export type ServiceContent = {
  title: string;
  summary: string;
  tags: string[];
} & PhotoContent;

export type ApproachContent = {
  step: string;
  title: string;
  text: string;
};

export type ClinicianContent = {
  name: string;
  role: string;
  focus: string;
} & PhotoContent;

export type TestimonialContent = {
  title: string;
  source: string;
  videoUrl: string;
} & PhotoContent;

export type SiteContent = {
  theme: "classic" | "mint";
  brandName: string;
  brandLogoSrc: string;
  brandLogoAlt: string;
  brandLogoFit: "cover" | "contain";
  brandLogoPosition: string;
  brandLogoBrightness: number;
  brandLogoContrast: number;
  brandLogoSaturation: number;
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  heroImageSrc: string;
  heroImageAlt: string;
  heroImageFit: "cover" | "contain";
  heroImagePosition: string;
  heroImageBrightness: number;
  heroImageContrast: number;
  heroImageSaturation: number;
  heroImageFade: boolean;
  heroTrust: string[];
  aboutEyebrow: string;
  aboutTitle: string;
  aboutText: string;
  approach: ApproachContent[];
  treatmentsEyebrow: string;
  treatmentsTitle: string;
  treatmentsText: string;
  services: ServiceContent[];
  conditionsEyebrow: string;
  conditionsTitle: string;
  conditionsText: string;
  bodyAreas: string[];
  teamEyebrow: string;
  teamTitle: string;
  teamText: string;
  clinicians: ClinicianContent[];
  testimonialsEyebrow: string;
  testimonialsTitle: string;
  testimonials: TestimonialContent[];
  locationEyebrow: string;
  locationTitle: string;
  locationText: string;
  clinicName: string;
  clinicHours: string;
  appointmentEyebrow: string;
  appointmentTitle: string;
  appointmentText: string;
  callbackEyebrow: string;
  callbackTitle: string;
  callbackText: string;
  articlesEyebrow: string;
  articlesTitle: string;
  articlesText: string;
  articles: string[];
  footerText: string;
  contact: {
    phoneDisplay: string;
    phoneHref: string;
    whatsappHref: string;
    email: string;
    mapHref: string;
    address: string;
  };
};

export const defaultSiteContent: SiteContent = {
  theme: "classic",
  brandName: "Wishing Wellness",
  brandLogoSrc: "",
  brandLogoAlt: "Wishing Wellness logo",
  brandLogoFit: "contain",
  brandLogoPosition: "50% 50%",
  brandLogoBrightness: 100,
  brandLogoContrast: 100,
  brandLogoSaturation: 100,
  heroEyebrow: "Integrated rehabilitation in Noida",
  heroTitle: "Move better. Live without persistent pain.",
  heroText:
    "Physiotherapy, chiropractic care, manual therapy and specialist rehabilitation guided by whole-body assessment, clear education and measurable progress.",
  heroImageSrc: "/images/clinic-care.png",
  heroImageAlt: "A physiotherapist guiding a patient through a mobility assessment",
  heroImageFit: "cover",
  heroImagePosition: "50% 50%",
  heroImageBrightness: 100,
  heroImageContrast: 100,
  heroImageSaturation: 100,
  heroImageFade: false,
  heroTrust: ["One Noida clinic", "Manual therapy", "Lead confirmation"],
  aboutEyebrow: "Why Wishing Wellness",
  aboutTitle: "Multidisciplinary assessment, one connected plan",
  aboutText:
    "Care starts by understanding why symptoms keep returning, not just where they appear. Treatment can combine manual therapy, Fascia Dynamics, corrective exercise, vestibular training and practical lifestyle guidance.",
  approach: [
    {
      step: "01",
      title: "Assess the whole body",
      text: "Movement, strength, posture, pain triggers and daily goals are reviewed together.",
    },
    {
      step: "02",
      title: "Treat and educate",
      text: "Sessions pair hands-on care with simple explanations and home guidance.",
    },
    {
      step: "03",
      title: "Rebuild confidence",
      text: "Progressive exercises help patients return to work, sport and normal routines.",
    },
  ],
  treatmentsEyebrow: "Treatments",
  treatmentsTitle: "Care designed around the whole body",
  treatmentsText: "Browse by treatment, speciality, condition or body area.",
  services: [
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
  ],
  conditionsEyebrow: "Conditions",
  conditionsTitle: "Where are you feeling discomfort?",
  conditionsText:
    "Start with a body area, then speak with the Noida clinic team about the relevant conditions, treatments and next step.",
  bodyAreas: [
    "Lower back",
    "Neck",
    "Shoulder",
    "Knee",
    "Ankle and foot",
    "Hip",
    "Pelvis",
    "Head and jaw",
  ],
  teamEyebrow: "Clinical team",
  teamTitle: "Specialists who work together",
  teamText:
    "Profiles, qualifications and exact clinic schedules can be managed as structured content when final credentials are verified.",
  clinicians: [
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
  ],
  testimonialsEyebrow: "Testimonials",
  testimonialsTitle: "What Our Clients Say About Us",
  testimonials: [
    {
      title: "Client testimonial | Learn more about integrated care",
      source: "Wishing Wellness",
      videoUrl: "",
      imageSrc: "",
      imageAlt: "Client testimonial video thumbnail",
      imageFit: "cover",
      imagePosition: "50% 50%",
      imageBrightness: 92,
      imageContrast: 105,
      imageSaturation: 95,
    },
    {
      title: "Sports recovery story | Patient experience",
      source: "Wishing Wellness",
      videoUrl: "",
      imageSrc: "",
      imageAlt: "Sports recovery testimonial video thumbnail",
      imageFit: "cover",
      imagePosition: "50% 50%",
      imageBrightness: 92,
      imageContrast: 105,
      imageSaturation: 95,
    },
    {
      title: "Why movement confidence matters",
      source: "Wishing Wellness",
      videoUrl: "",
      imageSrc: "",
      imageAlt: "Patient testimonial video thumbnail",
      imageFit: "cover",
      imagePosition: "50% 50%",
      imageBrightness: 92,
      imageContrast: 105,
      imageSaturation: 95,
    },
  ],
  locationEyebrow: "Clinic",
  locationTitle: "Visit Wishing Wellness Noida",
  locationText:
    "Contact details are shown consistently across the site so enquiries route to the right front-desk team.",
  clinicName: "Noida Clinic",
  clinicHours: "Mon-Sat, 9:00 AM-7:00 PM",
  appointmentEyebrow: "Appointment",
  appointmentTitle: "Request a clinic appointment",
  appointmentText:
    "This is an appointment request. A coordinator will call to confirm the time and share any preparation details.",
  callbackEyebrow: "Free consultation",
  callbackTitle: "Prefer a callback first?",
  callbackText:
    "Share the service or symptom you are exploring. Callback requests are kept separate from appointment requests.",
  articlesEyebrow: "Education",
  articlesTitle: "Latest patient guides",
  articlesText:
    "Educational articles can connect symptoms, conditions, services and appointment CTAs for search-led visitors.",
  articles: [
    "When lower-back pain needs a clinical assessment",
    "How vestibular rehabilitation helps dizziness",
    "What to expect during ACL rehabilitation",
  ],
  footerText: "Integrated physiotherapy and rehabilitation care in Noida.",
  contact: {
    phoneDisplay: "096503 53668",
    phoneHref: "tel:+919650353668",
    whatsappHref: "https://wa.me/919650353668",
    email: "hello@wishingwellness.example",
    mapHref:
      "https://www.google.com/maps/place/Wishing+Wellness+Physiotherapy+Clinic+%7C+Dr.+Amrinder+Kaur+-+Best+Physiotherapist+%7C+Sector133,+Noida/@28.5080734,77.3679616,17z",
    address:
      "G 70, KP I, Sector 133, Noida, Shahpur Govardhanpur Khadar, Uttar Pradesh 201304",
  },
};

export function mergeSiteContent(value: unknown): SiteContent {
  if (!value || typeof value !== "object") return defaultSiteContent;
  const partial = value as Partial<SiteContent>;
  const theme = partial.theme === "mint" ? "mint" : "classic";
  return {
    ...defaultSiteContent,
    ...partial,
    theme,
    contact: {
      ...defaultSiteContent.contact,
      ...(partial.contact ?? {}),
    },
  };
}
