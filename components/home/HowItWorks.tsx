'use client';

import Link from 'next/link';
import { useRef } from 'react';
import SplitHeading from '@/components/SplitHeading';
import { $, $$, clamp01, subscribeScroll, useAnime } from '@/lib/motion';

const STEPS = [
  { n: '01', t: 'Define', d: 'Shape your market opportunity, business model and unit economics together with AGEX.' },
  { n: '02', t: 'Prepare', d: 'You secure local licensing and assemble your operations team. We configure your brand, services and platform.' },
  { n: '03', t: 'Deploy', d: 'We deploy the technology and integrations. You prepare your drivers, partners and local operations.' },
  { n: '04', t: 'Go Live', d: 'Launch under your own brand. You run the business; we power and support the technology.' },
];
const ROLES = [
  { who: 'You bring', d: 'The market opportunity, local licensing and the operating team, and you run the business.' },
  { who: 'AGEX brings', d: 'Business model and unit economics, platform configuration and deployment, and ongoing technology support.' },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);

  useAnime(ctx => {
    const root = ref.current;
    if (!root) return;
    const fill = $('.tl-fill', root), head = $('.tl-head', root), steps = $$('.tl-step', root);
    ctx.onCleanup(subscribeScroll(() => {
      const vh = window.innerHeight;
      const r = root.getBoundingClientRect();
      const p = ctx.reduce ? 1 : clamp01((vh * 0.85 - r.top) / (vh * 0.55));
      fill.style.transform = `scaleX(${p * 0.75})`;
      head.style.left = `${p * 75}%`;
      steps.forEach((s, i) => s.classList.toggle('is-on', p >= (i / 3) * 0.98));
    }));
  });

  return (
    <section className="how section-light alt" id="how" data-theme="light" data-label="How it works">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow eyebrow-line reveal">How it works</p>
          <SplitHeading className="display" lines={[{ text: 'From your opportunity.', tone: 'muted' }, { text: 'To your mobility business.' }]} />
          <p className="lede reveal">Together, we shape the business, prepare the operations and deploy the technology to bring your vision to market.</p>
        </div>
        <div ref={ref} className="timeline">
          <div className="tl-track" aria-hidden="true">
            <span className="tl-fill" /><span className="tl-head" />
          </div>
          <ol className="tl-steps">
            {STEPS.map(s => (
              <li key={s.n} className="tl-step">
                <span className="tl-node" aria-hidden="true" />
                <span className="tl-num code">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="how-foot">
          <dl className="roles reveal-stagger">
            {ROLES.map(r => <div key={r.who}><dt>{r.who}</dt><dd>{r.d}</dd></div>)}
          </dl>
          <Link className="btn btn-solid-dark btn-lg reveal" href="/contact">Discuss your opportunity <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  );
}
