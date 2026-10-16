'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { stagger, svg as asvg } from 'animejs';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import { SCREENS } from '@/components/platform/Screens';
import { PRODUCTS, type Product, type Screen } from '@/lib/products';
import { $$, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
const VALUES = [
  { icon: 'phone', title: 'Customer experience', text: 'Booking, payments, trip management.' },
  { icon: 'car', title: 'Driver experience', text: 'Jobs, navigation, earnings.' },
  { icon: 'monitor', title: 'Operator platform', text: 'Fleet, operations, analytics.' },
  { icon: 'gear', title: 'One integrated engine', text: 'One technology foundation for all.' },
];

function Shot({ p, s }: { p: Product; s: Screen }) {
  if (s.src) return <img src={s.src} alt={s.alt ?? `${p.name}: ${s.label}`} loading="lazy" />;
  const UI = SCREENS[s.ui];
  return UI ? <UI /> : null;
}

function Frame({ p, screen, back = false }: { p: Product; screen: number; back?: boolean }) {
  return (
    <span className={`pa-device pa-${p.frame}${back ? ' pa-back' : ''}`} aria-hidden={back || undefined}>
      <span className="pa-screen">
        {p.screens.map((s, i) => (
          <span key={s.label} className={`pa-shot${i === screen ? ' is-on' : ''}`} aria-hidden={i !== screen}>
            {(i === screen || !back) && <Shot p={p} s={s} />}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function PlatformInAction() {
  const [active, setActive] = useState(2);
  const [screens, setScreens] = useState<number[]>(PRODUCTS.map(() => 0));
  const stageRef = useRef<HTMLDivElement>(null);

  const select = (i: number) => {
    if (i === active) setScreens(s => s.map((v, k) => (k === i ? (v + 1) % PRODUCTS[k].screens.length : v)));
    else setActive(i);
  };

  // live motion inside the interfaces: vehicles follow routes, charts grow in
  useAnime(ctx => {
    const stage = stageRef.current;
    if (!stage || ctx.reduce) return;
    const loops: any[] = [];
    $$<SVGGElement>('.ui-mover', stage).forEach((m, i) => {
      const path = m.ownerSVGElement?.querySelector<SVGPathElement>(`#${m.dataset.route}`);
      if (!path) return;
      loops.push(ctx.animate(m, { ...asvg.createMotionPath(path), duration: 6000 + i * 700, loop: true, alternate: true, ease: 'inOutSine', autoplay: false }));
    });
    $$('.ud-veh', stage).forEach((v, i) => loops.push(ctx.animate(v, { translateX: [0, (i % 2 ? 1 : -1) * 6], translateY: [0, (i % 3 ? -1 : 1) * 5], duration: 3000 + (i % 4) * 600, loop: true, alternate: true, ease: 'inOutSine', autoplay: false })));
    loops.push(ctx.animate($$('.ui-ring', stage), { scale: [1, 1.9], opacity: [0.8, 0], duration: 1800, loop: true, ease: 'outQuad', autoplay: false }));
    ctx.set($$('.ui-bar', stage), { scaleY: 0 });
    ctx.set($$('.ui-hbar', stage), { scaleX: 0 });
    ctx.onEnter(stage, () => {
      ctx.animate($$('.ui-bar', stage), { scaleY: [0, 1], duration: 900, delay: stagger(25), ease: 'outExpo' });
      ctx.animate($$('.ui-hbar', stage), { scaleX: [0, 1], duration: 900, delay: stagger(90, { start: 300 }), ease: 'outExpo' });
      ctx.animate(asvg.createDrawable($$('.ud-seg', stage)), { draw: ['0 0', '0 1'], duration: 1200, delay: stagger(150), ease: 'inOutQuad' });
      ctx.animate($$('.pa-product', stage), { opacity: [0, (_: any, i: number) => (i === 2 ? 1 : 0.82)], translateY: [30, 0], duration: 900, delay: stagger(120), ease: 'outExpo', onComplete: () => $$('.pa-product', stage).forEach(e => { e.style.opacity = ''; e.style.transform = ''; }) });
    }, 0.2);
    ctx.whenVisible(stage, () => loops.forEach(a => a.play()), () => loops.forEach(a => a.pause()));
  });

  return (
    <section className="platform section-dark deep" id="platform" data-theme="dark" data-label="Platform in action">
      <div className="wrap pa-grid">
        <div className="pa-copy">
          <p className="eyebrow reveal">The platform in action</p>
          <SplitHeading className="display" lines={[{ text: 'Real products.' }, { text: 'Real operations.' }]} />
          <p className="lede reveal">A complete mobility platform for customers, drivers and operators, built to launch, operate and scale in real markets.</p>
          <Link className="btn btn-solid reveal" href="/contact?topic=demo">See the platform in action <span aria-hidden="true">→</span></Link>
        </div>
        <div ref={stageRef} className="pa-stage">
          {PRODUCTS.map((p, i) => {
            const cur = screens[i];
            return (
              <div key={p.key} className={`pa-product pa-${p.key}${i === active ? ' is-active' : ''}`}>
                <button type="button" className="pa-head" onClick={() => select(i)} aria-pressed={i === active}>
                  <span className="pa-ico"><Icon name={p.icon} size={20} /></span>
                  <span><b>{p.name}</b><span>{p.tagline}</span></span>
                </button>
                <button type="button" className="pa-devices" onClick={() => select(i)} aria-label={`${p.name}: show next screen`}>
                  {p.key === 'customer' && <Frame p={p} screen={(cur + 1) % p.screens.length} back />}
                  <Frame p={p} screen={cur} />
                </button>
                <div className="pa-pager">
                  <span className="pa-shot-label">{p.screens[cur].label}</span>
                  <span className="pa-dots">
                    {p.screens.map((s, k) => (
                      <button key={s.label} type="button" className={k === cur ? 'is-on' : undefined} aria-label={`${p.name}: ${s.label}`} aria-pressed={k === cur}
                        onClick={() => { setActive(i); setScreens(sc => sc.map((v, j) => (j === i ? k : v))); }} />
                    ))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="wrap">
        <ul className="value-strip reveal-stagger">
          {VALUES.map(v => (
            <li key={v.title}><Icon name={v.icon} size={32} className="vs-icon" /><span><b>{v.title}</b><span>{v.text}</span></span></li>
          ))}
        </ul>
      </div>
    </section>
  );
}
