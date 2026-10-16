'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { animate } from 'animejs';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import { PRODUCTS, type Product } from '@/lib/products';
import { prefersReducedMotion } from '@/lib/motion';

const VALUES = [
  { icon: 'phone', title: 'Customer experience', text: 'Booking, payments, trip management.' },
  { icon: 'car', title: 'Driver experience', text: 'Jobs, navigation, earnings.' },
  { icon: 'monitor', title: 'Operator platform', text: 'Fleet, operations, analytics.' },
  { icon: 'gear', title: 'One integrated engine', text: 'One technology foundation for all.' },
];

/** Neutral wireframe used until real screenshots are supplied (no data, no metrics). */
function Placeholder({ frame, variant }: { frame: Product['frame']; variant: number }) {
  if (frame === 'laptop') {
    return (
      <div className="wf wf-laptop">
        <div className="wf-side">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</div>
        <div className="wf-main">
          <div className="wf-kpis">{Array.from({ length: 4 }, (_, i) => <i key={i} />)}</div>
          <div className="wf-row">
            <div className="wf-chart">{[38, 52, 44, 66, 58, 74, 62, 80, 70, 86, 76, 92].map((h, i) => <i key={i} style={{ height: `${variant === 1 ? 100 - h : h}%` }} />)}</div>
            <div className="wf-map"><span className="wf-route" /><i /><i /><i /></div>
          </div>
          <div className="wf-row wf-row-sm"><div className="wf-ring" /><div className="wf-lines">{Array.from({ length: 4 }, (_, i) => <i key={i} />)}</div></div>
        </div>
      </div>
    );
  }
  return (
    <div className={`wf wf-phone wf-v${variant}`}>
      <div className="wf-status" />
      {variant === 2 ? (
        <div className="wf-list">{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div>
      ) : (
        <div className="wf-map"><span className="wf-route" /><i /><i /></div>
      )}
      <div className="wf-sheet"><i /><i /><b /></div>
    </div>
  );
}

function Device({ p, active, screen, onSelect, onScreen }: { p: Product; active: boolean; screen: number; onSelect: () => void; onScreen: (i: number) => void }) {
  return (
    <div className={`pa-product pa-${p.key}${active ? ' is-active' : ''}`}>
      <button type="button" className="pa-head" onClick={onSelect} aria-pressed={active}>
        <span className="pa-ico"><Icon name={p.icon} size={20} /></span>
        <span><b>{p.name}</b><span>{p.tagline}</span></span>
      </button>
      <button type="button" className={`pa-device pa-${p.frame}`} onClick={onSelect} aria-label={`Show ${p.name}`}>
        <span className="pa-screen">
          {p.screens.map((s, i) => (
            <span key={s.label} className={`pa-shot${i === screen ? ' is-on' : ''}`} aria-hidden={i !== screen}>
              {s.src ? <img src={s.src} alt={s.alt ?? `${p.name}: ${s.label}`} loading="lazy" /> : <Placeholder frame={p.frame} variant={i} />}
            </span>
          ))}
        </span>
      </button>
      <div className="pa-pager">
        <span className="pa-shot-label">{p.screens[screen].label}</span>
        <span className="pa-dots">
          {p.screens.map((s, i) => (
            <button key={s.label} type="button" className={i === screen ? 'is-on' : undefined} aria-label={`${p.name}: ${s.label}`} aria-pressed={i === screen} onClick={() => onScreen(i)} />
          ))}
        </span>
      </div>
    </div>
  );
}

export default function PlatformInAction() {
  const [active, setActive] = useState(2);
  const [screens, setScreens] = useState<number[]>(PRODUCTS.map(() => 0));
  const stageRef = useRef<HTMLDivElement>(null);

  const select = (i: number) => {
    if (i === active) { setScreens(s => s.map((v, k) => (k === i ? (v + 1) % PRODUCTS[k].screens.length : v))); return; }
    setActive(i);
    const el = stageRef.current?.children[i] as HTMLElement | undefined;
    if (el && !prefersReducedMotion()) animate(el, { translateY: [8, 0], duration: 600, ease: 'outExpo' });
  };

  return (
    <section className="platform section-dark deep" id="platform" data-theme="dark" data-label="Platform in action">
      <div className="wrap pa-grid">
        <div className="pa-copy">
          <SplitHeading className="display" lines={[{ text: 'Real products.' }, { text: 'Real operations.' }]} />
          <p className="lede reveal">A complete mobility platform for customers, drivers and operators, built to launch, operate and scale in real markets.</p>
          <Link className="btn btn-solid reveal" href="/contact?topic=demo">See the platform in action <span aria-hidden="true">→</span></Link>
        </div>
        <div ref={stageRef} className="pa-stage reveal">
          {PRODUCTS.map((p, i) => (
            <Device key={p.key} p={p} active={i === active} screen={screens[i]} onSelect={() => select(i)}
              onScreen={k => { setActive(i); setScreens(s => s.map((v, j) => (j === i ? k : v))); }} />
          ))}
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
