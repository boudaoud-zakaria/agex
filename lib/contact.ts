/** Contact inquiry schema shared by the form (client) and the API route (server). */
export const BUILDING = ['Ride-hailing', 'Delivery', 'Fleet', 'Multiple services', 'Other'] as const;
export const STAGES = ['Exploring', 'Preparing launch', 'Already operating'] as const;

export type Inquiry = {
  name: string;
  email: string;
  company?: string;
  market: string;
  building?: string;
  stage?: string;
  message?: string;
  investor?: boolean;
  consent: boolean;
  website?: string; // honeypot
};

export type FieldErrors = Partial<Record<'name' | 'email' | 'market' | 'consent' | 'company' | 'message' | 'building' | 'stage', string>>;

export const FIELD_LABELS: Record<string, string> = {
  name: 'Name', email: 'Work email', market: 'Country / target market', consent: 'Privacy consent',
  company: 'Company / organization', message: 'Message', building: 'What are you building?', stage: 'Stage',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateInquiry(d: Partial<Inquiry>): FieldErrors {
  const e: FieldErrors = {};
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
  if (!str(d.name)) e.name = 'Please enter your name.';
  else if (str(d.name).length > 120) e.name = 'Please keep your name under 120 characters.';
  if (!str(d.email)) e.email = 'Please enter your work email.';
  else if (!EMAIL_RE.test(str(d.email)) || str(d.email).length > 200) e.email = 'Please enter a valid email address, like name@company.com.';
  if (!str(d.market)) e.market = 'Please tell us your country or target market.';
  else if (str(d.market).length > 120) e.market = 'Please keep this under 120 characters.';
  if (str(d.company).length > 160) e.company = 'Please keep this under 160 characters.';
  if (str(d.message).length > 5000) e.message = 'Please keep your message under 5,000 characters.';
  if (d.building && !(BUILDING as readonly string[]).includes(d.building)) e.building = 'Please choose one of the options.';
  if (d.stage && !(STAGES as readonly string[]).includes(d.stage)) e.stage = 'Please choose one of the options.';
  if (d.consent !== true) e.consent = 'Please agree to the privacy terms so we can respond.';
  return e;
}

/** Routing key for CRM / email rules. */
export const inquiryType = (d: Partial<Inquiry>) => (d.investor ? 'investor_partner' : d.building || 'general');
