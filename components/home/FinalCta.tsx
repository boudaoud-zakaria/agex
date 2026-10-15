'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { stagger, svg } from 'animejs';
import SplitHeading from '@/components/SplitHeading';
import { LOGO_PATHS } from '@/lib/logo';
import { $$, useAnime } from '@/lib/motion';

export default function FinalCta() {
  const markRef = useRef<SVGSVGElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useAnime(ctx => {
    const mark = markRef.current;
    if (!mark || ctx.reduce) return;
    const dr = svg.createDrawable($$('path', mark));
    ctx.set(dr, { draw: '0 0' });
    ctx.onEnter(sectionRef.current, () => ctx.animate(dr, { draw: ['0 0', '0 1'], duration: 2600, delay: stagger(160), ease: 'inOutQuart' }), 0.25);
  });

  return (
    <section ref={sectionRef} className="final section-dark deep" id="contact-cta" data-theme="dark" data-label="09 / Contact">
      <svg ref={markRef} className="final-mark" viewBox="0 0 1841 254" aria-hidden="true">
        {LOGO_PATHS.map(d => <path key={d} d={d} />)}
      </svg>
      <div className="wrap final-inner">
        <p className="eyebrow mono reveal">09 <span className="sep">/</span> Let’s move the world</p>
        <SplitHeading className="display final-title" text="Ready to start your mobility business?" />
        <p className="lede reveal">Tell us where you want to operate. We’ll explore how AGEX can power your launch.</p>
        <Link className="btn btn-solid btn-lg reveal" href="/contact">Contact us <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
