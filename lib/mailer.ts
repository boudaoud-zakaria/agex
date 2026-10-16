/**
 * Contact-form email delivery over SMTP (Brevo relay). Server-only: import from route handlers.
 * Configure via environment (see .env.example): SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD,
 * SMTP_FROM, SMTP_USE_TLS, CONTACT_TO.
 */
import nodemailer, { type Transporter } from 'nodemailer';

type Record_ = Record<string, unknown>;
let transporter: Transporter | null = null;

const env = (k: string) => (process.env[k] ?? '').trim();
export const mailConfigured = () => Boolean(env('SMTP_HOST') && env('SMTP_USERNAME') && env('SMTP_PASSWORD') && env('SMTP_FROM'));

function getTransport() {
  if (transporter) return transporter;
  const port = Number(env('SMTP_PORT') || 587);
  transporter = nodemailer.createTransport({
    host: env('SMTP_HOST'),
    port,
    secure: port === 465, // implicit TLS on 465; STARTTLS otherwise
    requireTLS: port !== 465 && env('SMTP_USE_TLS').toLowerCase() !== 'false',
    auth: { user: env('SMTP_USERNAME'), pass: env('SMTP_PASSWORD') },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
  return transporter;
}

const esc = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const oneLine = (v: unknown) => String(v ?? '').replace(/[\r\n]+/g, ' ').slice(0, 140);

const FIELDS: Array<[string, string]> = [
  ['kind', 'Inquiry type'], ['name', 'Name'], ['email', 'Work email'], ['company', 'Company / organization'], ['organization', 'Organization'],
  ['country', 'Country / target market'], ['building', 'What are you building?'], ['stage', 'Where are you today?'],
  ['interest', 'Type of interest'], ['source', 'How did you hear about AGEX?'], ['message', 'Message'], ['consent', 'Privacy consent'], ['received_at', 'Received'],
];

export async function sendInquiryEmail(inq: Record_) {
  const investor = inq.kind === 'investor';
  const subject = investor
    ? `Investor / partner inquiry: ${oneLine(inq.interest)} · ${oneLine(inq.organization)} (${oneLine(inq.country)})`
    : `New mobility business inquiry: ${oneLine(inq.building)} · ${oneLine(inq.country)}`;
  const rows = FIELDS.filter(([k]) => inq[k] !== null && inq[k] !== undefined && inq[k] !== '')
    .map(([k, label]) => {
      const raw = k === 'kind' ? (investor ? 'Investor / strategic partner' : 'Customer (mobility business)') : k === 'consent' ? (inq[k] ? 'Yes' : 'Not requested') : inq[k];
      return { label, value: String(raw) };
    });
  const text = `${subject}\n\n` + rows.map(r => `${r.label}: ${r.value}`).join('\n') + '\n\nReply to this email to answer the sender directly.';
  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f2ee;font-family:Avenir Next,Avenir,Helvetica,Arial,sans-serif;color:#0e0e0e">
  <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;border:1px solid #e5e2dc;border-collapse:separate">
    <tr><td style="padding:22px 26px;background:#0a0a0a;border-radius:14px 14px 0 0;color:#f5f4f1;font-size:13px;letter-spacing:.16em;text-transform:uppercase">AGEX TECH · Website inquiry</td></tr>
    <tr><td style="padding:24px 26px 6px;font-size:20px;font-weight:600">${esc(investor ? 'Investor or strategic partner inquiry' : 'New mobility business inquiry')}</td></tr>
    <tr><td style="padding:6px 26px 24px">
      <table role="presentation" width="100%" style="border-collapse:collapse;font-size:15px;line-height:1.5">
        ${rows.map(r => `<tr><td style="padding:10px 12px 10px 0;border-top:1px solid #eeebe6;color:#6b6a66;width:38%;vertical-align:top">${esc(r.label)}</td><td style="padding:10px 0;border-top:1px solid #eeebe6;white-space:pre-wrap">${esc(r.value)}</td></tr>`).join('')}
      </table>
    </td></tr>
    <tr><td style="padding:0 26px 22px;color:#8b8984;font-size:13px">Reply to this email to answer ${esc(inq.name)} directly.</td></tr>
  </table></body></html>`;

  return getTransport().sendMail({
    from: { name: 'AGEX Website', address: env('SMTP_FROM') },
    to: env('CONTACT_TO') || 'investor@agextech.com',
    replyTo: typeof inq.email === 'string' ? { name: oneLine(inq.name), address: inq.email } : undefined,
    subject,
    text,
    html,
  });
}

/** Connection + authentication check without sending anything. */
export const verifyMail = () => getTransport().verify();
