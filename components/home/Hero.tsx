'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { stagger } from 'animejs';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import HeroEngine from '@/components/visuals/HeroEngine';
import { $, $$, afterIntro, useAnime } from '@/lib/motion';
import { FILM_OPEN_EVENT } from '@/components/FilmPlayer';

const VALUES = [
  { icon: 'layers', title: 'Multi-vertical platform', text: 'Ride-hailing, delivery and fleet.' },
  { icon: 'globe', title: 'Built for local markets', text: 'Your brand. Your operations.' },
  { icon: 'network', title: 'Proven technology', text: 'Built on real mobility operations.' },
  { icon: 'growth', title: 'Built to scale', text: 'From launch to expansion.' },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useAnime(ctx => {
    const section = sectionRef.current;
    if (!section || ctx.reduce) return;
    const header = $('.site-header');
    const words = $$('[data-split] .w > span', section);
    const intro = $$('[data-intro]', section);
    const values = $$('.hv-item', section);
    ctx.set(values, { opacity: 0, translateY: 14 });
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      ctx.timeline({ defaults: { ease: 'outExpo' } })
        .add(header, { opacity: [0, 1], translateY: [-20, 0], duration: 900 }, 0)
        .add(words, { translateY: ['108%', '0%'], duration: 1100, delay: stagger(60) }, 150)
        .add(intro, { opacity: [0, 1], translateY: [18, 0], duration: 1000, delay: stagger(90) }, 450)
        .add(values, { opacity: [0, 1], translateY: [14, 0], duration: 900, delay: stagger(90) }, 900);
    };
    afterIntro(ctx, () => { if (document.fonts?.ready) document.fonts.ready.then(run); else run(); });
    return () => {
      cancelled = true;
      if (header) { header.style.opacity = ''; header.style.transform = ''; }
    };
  });

  return (
    <section ref={sectionRef} className="hero section-dark" id="top" data-theme="dark" data-label="Hero" data-own-intro>
      <div className="hero-grid wrap">
        <div className="hero-copy">
          <SplitHeading as="h1" className="hero-title" text="The engine behind modern mobility." />
          <p className="hero-statement" data-intro>Your brand. Your market. Our engine.</p>
          <p className="hero-support" data-intro>
            Launch, operate and scale your mobility business with one technology platform powering ride-hailing, delivery and fleet operations.
          </p>
          <div className="hero-actions" data-intro>
            <Link className="btn btn-solid" href="/contact">Start your mobility business <span aria-hidden="true">→</span></Link>
            <a className="btn btn-ghost" href="#engine">Explore the engine <span aria-hidden="true">↓</span></a>
          </div>
          <button type="button" className="film-cta" data-intro onClick={() => window.dispatchEvent(new Event(FILM_OPEN_EVENT))}>
            <span className="film-cta-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6.5v11l9-5.5-9-5.5Z" /></svg></span>
            <span><b>Watch the AGEX film</b><span>00:10 · Brand film</span></span>
          </button>
        </div>
        <div className="hero-visual" data-intro>
          <HeroEngine />
        </div>
      </div>
      <div className="wrap">
        <ul className="hero-values">
          {VALUES.map(v => (
            <li key={v.title} className="hv-item">
              <Icon name={v.icon} size={34} className="hv-icon" />
              <span><b>{v.title}</b><span>{v.text}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
