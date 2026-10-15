'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { animate, stagger, svg } from 'animejs';
import { BUILDING, FIELD_LABELS, STAGES, validateInquiry, type FieldErrors, type Inquiry } from '@/lib/contact';
import { $$, prefersReducedMotion } from '@/lib/motion';

type Status = 'idle' | 'sending' | 'sent';

function readForm(form: HTMLFormElement): Partial<Inquiry> {
  const f = new FormData(form);
  const s = (k: string) => (f.get(k) as string | null) ?? undefined;
  return {
    name: s('name'), email: s('email'), company: s('company'), market: s('market'),
    building: s('building'), stage: s('stage'), message: s('message'), website: s('website'),
    investor: f.get('investor') === 'yes', consent: f.get('consent') === 'yes',
  };
}

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState(false);
  const [summary, setSummary] = useState<string[] | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  // Re-validate live once the user has attempted to submit
  const revalidate = () => { if (touched && formRef.current) setErrors(validateInquiry(readForm(formRef.current))); };

  useEffect(() => {
    if (summary) summaryRef.current?.focus();
  }, [summary]);

  useEffect(() => {
    if (status !== 'sent' || !successRef.current) return;
    successRef.current.focus();
    if (prefersReducedMotion()) return;
    const el = successRef.current;
    const a = animate(svg.createDrawable($$('circle, path', el)), { draw: ['0 0', '0 1'], duration: 900, delay: stagger(250), ease: 'inOutQuad' });
    const b = animate($$('h2, p, a', el), { opacity: [0, 1], translateY: [16, 0], duration: 800, delay: stagger(90, { start: 300 }), ease: 'outExpo' });
    return () => { a.revert(); b.revert(); };
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = readForm(form);
    const errs = validateInquiry(data);
    setTouched(true);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setSummary(Object.entries(errs).map(([k, m]) => `${FIELD_LABELS[k]}: ${m}`));
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

  const fieldProps = (name: keyof FieldErrors) => ({
    'aria-invalid': errors[name] ? true : touched ? false : undefined,
    'aria-describedby': `e-${name}`,
    onBlur: revalidate,
    onChange: revalidate,
  });
  const err = (name: keyof FieldErrors) => <p className="err" id={`e-${name}`}>{errors[name] ?? ''}</p>;

  if (status === 'sent') {
    return (
      <div ref={successRef} className="success" tabIndex={-1}>
        <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" /><path d="M20 33 L28 41 L45 23" /></svg>
        <h2>Thank you. Your inquiry has been received.</h2>
        <p className="lede">We’ll review the details you shared about your market.</p>
        <Link className="btn btn-ghost mono" href="/">Back to home <span aria-hidden="true">←</span></Link>
      </div>
    );
  }

  return (
    <form ref={formRef} className="form" noValidate onSubmit={onSubmit}>
      {summary && (
        <div ref={summaryRef} className="err-summary" role="alert" tabIndex={-1}>
          <p>Please check the highlighted fields.</p>
          <ul>{summary.map(s => <li key={s}>{s}</li>)}</ul>
        </div>
      )}

      <div className="row two">
        <div className="field-f">
          <label htmlFor="f-name">Name <span aria-hidden="true">*</span></label>
          <input id="f-name" name="name" type="text" autoComplete="name" required {...fieldProps('name')} />
          {err('name')}
        </div>
        <div className="field-f">
          <label htmlFor="f-email">Work email <span aria-hidden="true">*</span></label>
          <input id="f-email" name="email" type="email" autoComplete="email" required {...fieldProps('email')} />
          {err('email')}
        </div>
      </div>
      <div className="row two">
        <div className="field-f">
          <label htmlFor="f-company">Company / organization</label>
          <input id="f-company" name="company" type="text" autoComplete="organization" {...fieldProps('company')} />
          {err('company')}
        </div>
        <div className="field-f">
          <label htmlFor="f-market">Country / target market <span aria-hidden="true">*</span></label>
          <input id="f-market" name="market" type="text" autoComplete="country-name" required {...fieldProps('market')} />
          {err('market')}
        </div>
      </div>

      <fieldset className="field-f">
        <legend>What are you building?</legend>
        <div className="chips">
          {BUILDING.map(v => <label key={v}><input type="radio" name="building" value={v} /><span>{v}</span></label>)}
        </div>
      </fieldset>

      <fieldset className="field-f">
        <legend>Stage</legend>
        <div className="chips">
          {STAGES.map(v => <label key={v}><input type="radio" name="stage" value={v} /><span>{v}</span></label>)}
        </div>
      </fieldset>

      <div className="field-f">
        <label htmlFor="f-message">Message</label>
        <textarea id="f-message" name="message" rows={5} {...fieldProps('message')} />
        {err('message')}
      </div>

      {/* Spam honeypot: hidden from people, tempting to bots */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="check">
        <input type="checkbox" name="investor" value="yes" />
        <span className="box" aria-hidden="true" />
        <span>I’m contacting AGEX as an investor or strategic partner.</span>
      </label>

      <label className="check">
        <input type="checkbox" name="consent" value="yes" required {...fieldProps('consent')} />
        <span className="box" aria-hidden="true" />
        <span>I agree to AGEX TECH processing my details to respond to this inquiry, as described in the <Link href="/legal#privacy">Privacy Policy</Link>. <span aria-hidden="true">*</span></span>
      </label>
      {err('consent')}

      <div className="form-foot">
        <button className="btn btn-solid btn-lg" type="submit" disabled={status === 'sending'}>
          <span className="label">{status === 'sending' ? 'Sending…' : 'Send inquiry'}</span> <span aria-hidden="true">→</span>
        </button>
        <p className="mono req">* Required</p>
      </div>
    </form>
  );
}
