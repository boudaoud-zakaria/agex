/** Contact inquiry schemas shared by the forms (client) and the API route (server). */
export const BUILDING = ['Ride-hailing', 'Delivery', 'Fleet management', 'Multiple services', 'Other'] as const;
export const STAGES = ['Exploring', 'Preparing launch', 'Already operating'] as const;
export const INTERESTS = ['Investment', 'Strategic partnership', 'Co-building', 'Other'] as const;
export const SOURCES = ['Search engine', 'LinkedIn', 'Event or conference', 'Referral', 'News or media', 'Other'] as const;

export type InquiryKind = 'customer' | 'investor';
export type Inquiry = {
  kind?: InquiryKind;
  name?: string;
  email?: string;
  company?: string;      // customer (optional)
  organization?: string; // investor (required)
  country?: string;
  building?: string;     // customer
  stage?: string;        // customer
  interest?: string;     // investor
  source?: string;       // investor (optional)
  message?: string;
  consent?: boolean;
  website?: string;      // honeypot
};
export type FieldErrors = Partial<Record<keyof Inquiry, string>>;

export const FIELD_LABELS: Record<string, string> = {
  name: 'Name', email: 'Work email', company: 'Company / organization', organization: 'Organization', country: 'Country',
  building: 'What are you building?', stage: 'Where are you today?', interest: 'Type of interest', source: 'How did you hear about AGEX?',
  message: 'Message', consent: 'Privacy consent',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const inList = (v: string, list: readonly string[]) => list.includes(v);

export function validateInquiry(d: Inquiry): FieldErrors {
  const e: FieldErrors = {};
  const kind: InquiryKind = d.kind === 'investor' ? 'investor' : 'customer';
  if (!str(d.name)) e.name = 'Please enter your name.';
  else if (str(d.name).length > 120) e.name = 'Please keep your name under 120 characters.';
  if (!str(d.email)) e.email = 'Please enter your work email.';
  else if (!EMAIL_RE.test(str(d.email)) || str(d.email).length > 200) e.email = 'Please enter a valid email address, like name@company.com.';
  if (!str(d.country)) e.country = kind === 'investor' ? 'Please select your country.' : 'Please select your country or target market.';
  else if (str(d.country).length > 80) e.country = 'Please select a country from the list.';
  if (!str(d.message)) e.message = kind === 'investor' ? 'Please tell us about your interest.' : 'Please tell us about your opportunity.';
  else if (str(d.message).length > 5000) e.message = 'Please keep your message under 5,000 characters.';

  if (kind === 'customer') {
    if (str(d.company).length > 160) e.company = 'Please keep this under 160 characters.';
    if (!str(d.building)) e.building = 'Please choose what you are building.';
    else if (!inList(str(d.building), BUILDING)) e.building = 'Please choose one of the options.';
    if (!str(d.stage)) e.stage = 'Please tell us where you are today.';
    else if (!inList(str(d.stage), STAGES)) e.stage = 'Please choose one of the options.';
  } else {
    if (d.consent !== true) e.consent = 'Please agree to the privacy terms so we can respond.';
    if (!str(d.organization)) e.organization = 'Please enter your organization.';
    else if (str(d.organization).length > 160) e.organization = 'Please keep this under 160 characters.';
    if (!str(d.interest)) e.interest = 'Please choose your type of interest.';
    else if (!inList(str(d.interest), INTERESTS)) e.interest = 'Please choose one of the options.';
    if (str(d.source) && !inList(str(d.source), SOURCES)) e.source = 'Please choose one of the options.';
  }
  return e;
}

/** Routing key for CRM / email rules. */
export const inquiryType = (d: Inquiry) => (d.kind === 'investor' ? 'investor_partner' : d.building || 'general');
