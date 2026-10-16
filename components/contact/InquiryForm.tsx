'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { animate, stagger, svg } from 'animejs';
import { BUILDING, FIELD_LABELS, INTERESTS, SOURCES, STAGES, validateInquiry, type FieldErrors, type Inquiry, type InquiryKind } from '@/lib/contact';
import { $$, prefersReducedMotion } from '@/lib/motion';

type Status = 'idle' | 'sending' | 'sent';

const PRESET_MESSAGES: Record<string, string> = {
  demo: 'I’d like to see the AGEX platform in action.',
  careers: 'I’m interested in career opportunities at AGEX.',
};

function readForm(form: HTMLFormElement, kind: InquiryKind): Inquiry {
  const f = new FormData(form);
  const s = (k: string) => ((f.get(k) as string | null) ?? undefined) || undefined;
  return {
    kind, name: s('name'), email: s('email'), company: s('company'), organization: s('organization'), country: s('country'),
    building: s('building'), stage: s('stage'), interest: s('interest'), source: s('source'), message: s('message'),
    website: s('website'), consent: f.get('consent') === 'yes',
  };
}

export default function InquiryForm({ kind = 'customer', countries }: { kind?: InquiryKind; countries: string[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);
  const [summary, setSummary] = useState<string[] | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const investor = kind === 'investor';

  // Presets from links such as /contact?building=Delivery or ?topic=demo
  useEffect(() => {
    const form = formRef.current;
    if (!form || investor) return;
    const q = new URLSearchParams(window.location.search);
    const b = q.get('building');
    if (b) form.querySelector<HTMLInputElement>(`input[name="building"][value="${CSS.escape(b)}"]`)?.click();
    const topic = q.get('topic');
    const msg = form.elements.namedItem('message') as HTMLTextAreaElement | null;
    if (topic && msg && !msg.value && PRESET_MESSAGES[topic]) msg.value = PRESET_MESSAGES[topic];
  }, [investor]);

  useEffect(() => { if (summary) summaryRef.current?.focus(); }, [summary]);

  useEffect(() => {
    if (status !== 'sent' || !successRef.current) return;
    successRef.current.focus();
    if (prefersReducedMotion()) return;
    const el = successRef.current;
    const a = animate(svg.createDrawable($$('circle, path', el)), { draw: ['0 0', '0 1'], duration: 900, delay: stagger(250), ease: 'inOutQuad' });
    const b = animate($$('h2, p, a', el), { opacity: [0, 1], translateY: [16, 0], duration: 800, delay: stagger(90, { start: 300 }), ease: 'outExpo' });
    return () => { a.revert(); b.revert(); };
  }, [status]);

  const revalidate = () => { if (touched && formRef.current) setErrors(validateInquiry(readForm(formRef.current, kind))); };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = readForm(form, kind);
    const errs = validateInquiry(data);
    setTouched(true);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setSummary(Object.entries(errs).map(([k, m]) => `${FIELD_LABELS[k] ?? k}: ${m}`));
      if (!prefersReducedMotion()) animate(form, { translateX: [0, -8, 8, -5, 5, 0], duration: 420, ease: 'inOutSine' });
      return;
    }
    setSummary(null);
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errors) { setErrors(json.errors); setSummary(Object.entries(json.errors as Record<string, string>).map(([k, m]) => `${FIELD_LABELS[k] ?? k}: ${m}`)); }
        else setSummary([json.error || 'We couldn’t send your inquiry. Please try again in a moment.']);
        setStatus('idle');
        return;
      }
      setStatus('sent');
    } catch {
      setSummary(['We couldn’t send your inquiry. Please try again in a moment.']);
      setStatus('idle');
    }
  }

  const fp = (name: keyof FieldErrors) => ({
    'aria-invalid': errors[name] ? true : touched ? false : undefined,
    'aria-describedby': `e-${kind}-${name}`,
    onBlur: revalidate,
    onChange: revalidate,
  });
  const err = (name: keyof FieldErrors) => <p className="err" id={`e-${kind}-${name}`}>{errors[name] ?? ''}</p>;
  const id = (n: string) => `f-${kind}-${n}`;
  const req = <span aria-hidden="true"> *</span>;

  const chips = (name: keyof FieldErrors, legend: ReactNode, options: readonly string[]) => (
    <fieldset className="field-f" aria-describedby={`e-${kind}-${name}`} aria-invalid={errors[name] ? true : undefined}>
      <legend>{legend}</legend>
      <div className="chips">
        {options.map(v => <label key={v}><input type="radio" name={name} value={v} onChange={revalidate} /><span>{v}</span></label>)}
      </div>
      {err(name)}
    </fieldset>
  );

  if (status === 'sent') {
    return (
      <div ref={successRef} className="success" tabIndex={-1}>
        <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" /><path d="M20 33 L28 41 L45 23" /></svg>
        <h2>Thank you. Your inquiry has been received.</h2>
        <p className="lede">{investor ? 'We’ll review your interest and follow up.' : 'We’ll review the details you shared about your market.'}</p>
        <Link className="btn btn-ghost" href="/">Back to home <span aria-hidden="true">←</span></Link>
      </div>
    );
  }

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit}>
      {investor && (
        <div className="form-intro">
          <h2>Investor or strategic partner inquiry</h2>
          <p>Tell us about your interest and we’ll get back to you.</p>
        </div>
      )}
      {summary && (
        <div ref={summaryRef} className="err-summary" role="alert" tabIndex={-1}>
          <p>Please check the highlighted fields.</p>
          <ul>{summary.map(s => <li key={s}>{s}</li>)}</ul>
        </div>
      )}

      <div className="row two">
        <div className="field-f">
          <label htmlFor={id('name')}>Name{req}</label>
          <input id={id('name')} name="name" type="text" autoComplete="name" placeholder="Your name" required {...fp('name')} />
          {err('name')}
        </div>
        <div className="field-f">
          <label htmlFor={id('email')}>Work email{req}</label>
          <input id={id('email')} name="email" type="email" autoComplete="email" placeholder="you@company.com" required {...fp('email')} />
          {err('email')}
        </div>
      </div>
      <div className="row two">
        {investor ? (
          <div className="field-f">
            <label htmlFor={id('organization')}>Organization{req}</label>
            <input id={id('organization')} name="organization" type="text" autoComplete="organization" placeholder="Your company or fund" required {...fp('organization')} />
            {err('organization')}
          </div>
        ) : (
          <div className="field-f">
            <label htmlFor={id('company')}>Company / organization</label>
            <input id={id('company')} name="company" type="text" autoComplete="organization" placeholder="Your company (optional)" {...fp('company')} />
            {err('company')}
          </div>
        )}
        <div className="field-f">
          <label htmlFor={id('country')}>{investor ? 'Country' : 'Country / target market'}{req}</label>
          <div className="select">
            <select id={id('country')} name="country" required defaultValue="" {...fp('country')}>
              <option value="" disabled>Select a country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {err('country')}
        </div>
      </div>

      {investor
        ? chips('interest', <>Type of interest{req}</>, INTERESTS)
        : <>
            {chips('building', <>What are you building?{req}</>, BUILDING)}
            {chips('stage', <>Where are you today?{req}</>, STAGES)}
          </>}

      {investor && (
        <div className="field-f">
          <label htmlFor={id('source')}>How did you hear about AGEX? (optional)</label>
          <div className="select">
            <select id={id('source')} name="source" defaultValue="" {...fp('source')}>
              <option value="">Select an option</option>
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {err('source')}
        </div>
      )}

      <div className="field-f">
        <label htmlFor={id('message')}>{investor ? 'Tell us about your interest' : 'Tell us about your opportunity'}{req}</label>
        <textarea id={id('message')} name="message" rows={4} required
          placeholder={investor
            ? 'What interests you about AGEX? Share a bit about your objectives, potential areas of collaboration or any specific questions.'
            : 'What’s your idea, existing business or biggest challenge? Tell us a little about your market, goals and timeline.'}
          {...fp('message')} />
        {err('message')}
      </div>

      {/* Spam honeypot: hidden from people, tempting to bots */}
      <div className="hp" aria-hidden="true">
        <label htmlFor={id('website')}>Website</label>
        <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="check">
        <input type="checkbox" name="consent" value="yes" required {...fp('consent')} />
        <span className="box" aria-hidden="true" />
        <span>I agree to AGEX TECH processing my details to respond to this inquiry, as described in the <Link href="/legal#privacy">Privacy Policy</Link>.{req}</span>
      </label>
      {err('consent')}

      <div className="form-foot">
        <button className="btn btn-solid btn-lg" type="submit" disabled={status === 'sending'}>
          <span className="label-btn">{status === 'sending' ? 'Sending…' : 'Let’s talk'}</span> <span aria-hidden="true">→</span>
        </button>
        <p className="req">* Required fields</p>
      </div>
    </form>
  );
}
