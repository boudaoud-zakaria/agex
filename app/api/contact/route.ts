import { NextResponse } from 'next/server';
import { inquiryType, validateInquiry, type Inquiry } from '@/lib/contact';

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

  let body: Partial<Inquiry>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn anything.
  if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true });

  const errors = validateInquiry(body);
  if (Object.keys(errors).length) return NextResponse.json({ ok: false, errors }, { status: 422 });

  const clean = (v: unknown) => (typeof v === 'string' ? v.trim() : undefined);
  const inquiry = {
    name: clean(body.name),
    email: clean(body.email),
    company: clean(body.company) || null,
    market: clean(body.market),
    building: clean(body.building) || null,
    stage: clean(body.stage) || null,
    message: clean(body.message) || null,
    investor: body.investor === true,
    consent: true,
    inquiry_type: inquiryType(body),
    received_at: new Date().toISOString(),
  };

  const hook = process.env.CONTACT_WEBHOOK_URL;
  if (hook) {
    try {
      const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inquiry) });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } catch (err) {
      console.error('[contact] delivery failed:', err);
      return NextResponse.json({ ok: false, error: 'We couldn’t send your inquiry. Please try again in a moment.' }, { status: 502 });
    }
  } else {
    // Not configured: log routing metadata only (no personal data).
    console.warn(`[contact] CONTACT_WEBHOOK_URL not set — inquiry NOT delivered (type=${inquiry.inquiry_type}, market=${inquiry.market}).`);
  }

  return NextResponse.json({ ok: true });
}
