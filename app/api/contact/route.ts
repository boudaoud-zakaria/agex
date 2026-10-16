import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { inquiryType, validateInquiry, type Inquiry } from '@/lib/contact';
import { mailConfigured, sendInquiryEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

// Submissions are appended as JSON lines here (a Docker volume in production).
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.jsonl');

async function storeSubmission(record: object) {
  await mkdir(DATA_DIR, { recursive: true });
  await appendFile(SUBMISSIONS_FILE, JSON.stringify(record) + '\n', { encoding: 'utf8', mode: 0o600 });
}

// Best-effort per-instance rate limit (5 requests / 10 minutes / IP).
// Use a shared store (e.g. Redis/KV) or your platform's WAF for production-grade limiting.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: Inquiry;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn anything.
  if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true });

  const errors = validateInquiry(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const clean = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null);
  const kind = body.kind === 'investor' ? 'investor' : 'customer';
  const inquiry = {
    kind,
    name: clean(body.name),
    email: clean(body.email),
    ...(kind === 'customer'
      ? { company: clean(body.company), building: clean(body.building), stage: clean(body.stage) }
      : { organization: clean(body.organization), interest: clean(body.interest), source: clean(body.source) }),
    country: clean(body.country),
    message: clean(body.message),
    consent: body.consent === true,
    inquiry_type: inquiryType({ ...body, kind }),
    received_at: new Date().toISOString(),
  };

  // 1) Persist to disk (durable record, survives redeploys via the data volume)
  let stored = false;
  try {
    await storeSubmission(inquiry);
    stored = true;
  } catch (err) {
    console.error('[contact] could not write submission to disk:', err);
  }

  // 2) Email the inquiry (Brevo SMTP → CONTACT_TO, default investor@agextech.com)
  let emailed = false;
  if (mailConfigured()) {
    try {
      await sendInquiryEmail(inquiry);
      emailed = true;
    } catch (err) {
      console.error('[contact] email delivery failed:', err instanceof Error ? err.message : err);
    }
  }

  // 3) Optional CRM / webhook forwarding
  const hook = process.env.CONTACT_WEBHOOK_URL;
  let delivered = false;
  if (hook) {
    try {
      const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inquiry) });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      delivered = true;
    } catch (err) {
      console.error('[contact] webhook delivery failed:', err);
    }
  }

  // Routing metadata only in logs (no personal data)
  console.info(`[contact] inquiry type=${inquiry.inquiry_type} country=${inquiry.country} stored=${stored} email=${mailConfigured() ? emailed : 'not-configured'} webhook=${hook ? delivered : 'not-configured'}`);

  if (!stored && !emailed && !delivered) {
    return NextResponse.json({ ok: false, error: 'We couldn’t send your inquiry. Please try again in a moment.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
