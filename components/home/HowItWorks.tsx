'use client';

import Link from 'next/link';
import { useRef } from 'react';
import SplitHeading from '@/components/SplitHeading';
import { $, $$, clamp01, subscribeScroll, useAnime } from '@/lib/motion';

const STEPS = [
  { n: '01', t: 'Configure', d: 'Define your services, market and operating model.' },
  { n: '02', t: 'Launch', d: 'Deploy your branded apps and operator platform.' },
  { n: '03', t: 'Operate', d: 'Manage trips, captains, fleets and performance.' },
  { n: '04', t: 'Expand', d: 'Add services and territories on the same engine.' },
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
      fill.style.transform = `scaleX(${p})`;
      head.style.left = `${p * 100}%`;
      steps.forEach((s, i) => s.classList.toggle('is-on', p >= i * 0.25 + 0.02 || p >= 0.999));
    }));
  });

  return (
    <section className="how section-light alt" id="how" data-theme="light" data-label="05 / How it works">
      <div className="wrap">
        <div className="section-head split-head">
          <div>
            <p className="eyebrow mono reveal">05 <span className="sep">/</span> How it works</p>
            <SplitHeading className="display" text="Your mobility business. Powered by AGEX." />
          </div>
          <Link className="btn btn-solid-dark reveal" href="/contact">Discuss your market <span aria-hidden="true">→</span></Link>
        </div>
        <div ref={ref} className="timeline">
          <div className="tl-track" aria-hidden="true">
            <span className="tl-ticks">{Array.from({ length: 61 }, (_, i) => <i key={i} className={i % 15 === 0 ? 'major' : undefined} />)}</span>
            <span className="tl-fill" /><span className="tl-head" />
          </div>
          <ol className="tl-steps">
            {STEPS.map(s => (
              <li key={s.n} className="tl-step">
                <span className="tl-node" aria-hidden="true" />
                <span className="tl-num mono">{s.n}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
