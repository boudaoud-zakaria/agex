'use client';

import { Fragment, useRef } from 'react';
import { stagger } from 'animejs';
import Icon, { iconPaths } from '@/components/Icon';
import { $, $$, buildDial, C, mk, pinProgress, subscribeScroll, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
type View = {
  key: string; title: string; text: string; icon: string;
  caps: Array<{ icon: string; t: string; d: string }>;
  panel: { layer: string; purpose: string; usedBy: string; outcome: string };
};

const VIEWS: View[] = [
  {
    key: 'customer', title: 'Customer', icon: 'users', text: 'A seamless mobility experience under your brand.',
    caps: [
      { icon: 'route', t: 'Booking & tracking', d: 'Book in seconds and follow every trip live.' },
      { icon: 'wallet', t: 'Payments', d: 'Simple, secure in-app payments.' },
      { icon: 'clock', t: 'Trip management', d: 'Upcoming and past trips in one place.' },
    ],
    panel: { layer: 'Customer', purpose: 'Gives your customers a seamless way to book, track and pay, under your brand.', usedBy: 'Your customers', outcome: 'A trusted branded experience that keeps customers coming back.' },
  },
  {
    key: 'driver', title: 'Driver', icon: 'car', text: 'Everything drivers need to manage their daily operations.',
    caps: [
      { icon: 'chat', t: 'Job requests', d: 'Receive and accept jobs in real time.' },
      { icon: 'route', t: 'Navigation', d: 'Guidance to every pickup and drop-off.' },
      { icon: 'wallet', t: 'Earnings', d: 'Clear visibility of trips and earnings.' },
    ],
    panel: { layer: 'Driver', purpose: 'Equips drivers with everything they need to work efficiently every day.', usedBy: 'Your drivers', outcome: 'Productive drivers and reliable service on every trip.' },
  },
  {
    key: 'operator', title: 'Operator', icon: 'building', text: 'One platform to manage and grow your mobility business.',
    caps: [
      { icon: 'eye', t: 'Live operations', d: 'Monitor trips and service in real time.' },
      { icon: 'truck', t: 'Fleet & drivers', d: 'Manage vehicles, drivers and availability.' },
      { icon: 'bars', t: 'Performance insights', d: 'Reporting to track and improve performance.' },
    ],
    panel: { layer: 'Operator', purpose: 'Gives your team one platform to run, monitor and grow the business.', usedBy: 'Your operations team', outcome: 'Full control and visibility as you scale.' },
  },
  {
    key: 'core', title: 'Core', icon: 'network', text: 'The technology connecting every part of your mobility operation.',
    caps: [
      { icon: 'box', t: 'Dispatch & pricing', d: 'Real-time matching and dynamic pricing.' },
      { icon: 'shield', t: 'Identity & support', d: 'Verification, safety and support tools.' },
      { icon: 'plug', t: 'Integrations', d: 'Open APIs and third-party integrations.' },
    ],
    panel: { layer: 'Core', purpose: 'Powers the entire mobility ecosystem with a unified, scalable technology platform.', usedBy: 'Customer, Driver, Operator', outcome: 'A reliable foundation to launch, operate and scale your business.' },
  },
];

// wheel node angles (Customer top, Driver bottom-right, Operator bottom-left)
const NODES = [{ v: 0, deg: -90 }, { v: 1, deg: 30 }, { v: 2, deg: 150 }];
const TICKS = 41;

export default function EngineLayers() {
  const root = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);

  useAnime(ctx => {
    const pin = root.current, host = dialRef.current;
    if (!pin || !host) return;
    const dial = buildDial(host, ctx, { progress: true });
    const st = dial.stage;

    // ---- wheel: core + three nodes
    const orbit = mk('g', { style: 'transform-origin:300px 300px' }, st);
    mk('circle', { class: 'ew-orbit', cx: C, cy: C, r: 92, 'stroke-dasharray': '2 6' }, orbit);
    for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2 + 0.4; mk('circle', { class: 'ew-dot', cx: C + Math.cos(a) * 92, cy: C + Math.sin(a) * 92, r: 3.2 }, orbit); }
    const linkGroups: SVGGElement[] = [], nodeGroups: SVGGElement[] = [], solids: SVGCircleElement[] = [], darkIcons: SVGGElement[] = [], halos: SVGCircleElement[] = [];
    const pulses: Array<{ el: SVGCircleElement; dx: number; dy: number; link: number }> = [];
    NODES.forEach((n, i) => {
      const a = (n.deg * Math.PI) / 180, x = C + Math.cos(a) * 170, y = C + Math.sin(a) * 170;
      const x0 = C + Math.cos(a) * 58, y0 = C + Math.sin(a) * 58, x1 = C + Math.cos(a) * 142, y1 = C + Math.sin(a) * 142;
      const lg = mk('g', { class: 'ew-linkg' }, st);
      mk('line', { class: 'ew-link', x1: x0, y1: y0, x2: x1, y2: y1 }, lg);
      for (let k = 0; k < 2; k++) {
        const pc = mk('circle', { class: 'ew-pulse', cx: x0, cy: y0, r: 3.2, opacity: 0 }, lg);
        pulses.push({ el: pc, dx: x1 - x0, dy: y1 - y0, link: i });
      }
      linkGroups.push(lg);
      const g = mk('g', { class: 'ew-node', style: 'transform-box:fill-box;transform-origin:center' }, st);
      halos.push(mk('circle', { class: 'ew-halo', cx: x, cy: y, r: 28, opacity: 0, style: 'transform-box:fill-box;transform-origin:center' }, g));
      mk('circle', { class: 'ew-node-ring', cx: x, cy: y, r: 27 }, g);
      solids.push(mk('circle', { class: 'ew-node-solid', cx: x, cy: y, r: 27, opacity: 0 }, g));
      const href = `#ew-ico-${VIEWS[n.v].icon}`;
      mk('use', { class: 'ew-ico', href, x: x - 12, y: y - 12, width: 24, height: 24 }, g);
      darkIcons.push(mk('use', { class: 'ew-ico ew-ico-dark', href, x: x - 12, y: y - 12, width: 24, height: 24, opacity: 0 }, g) as unknown as SVGGElement);
      const ly = n.deg === -90 ? y - 40 : y + 48;
      mk('text', { class: 'ew-label', x, y: ly, 'text-anchor': 'middle' }, g).textContent = VIEWS[n.v].title.toUpperCase();
      nodeGroups.push(g);
    });
    const coreHalo = mk('circle', { class: 'ew-halo', cx: C, cy: C, r: 56, opacity: 0, style: 'transform-box:fill-box;transform-origin:center' }, st);
    mk('circle', { class: 'ew-core', cx: C, cy: C, r: 56 }, st);
    mk('use', { href: '#agex-logo', width: 1841, height: 254, fill: '#0a0a0a', transform: `translate(${C - 34} ${C - 14}) scale(${68 / 1841})` }, st);
    mk('text', { class: 'ew-core-label', x: C, y: C + 20, 'text-anchor': 'middle' }, st).textContent = 'CORE';

    // ---- continuous motion
    const orbitSpin = ctx.animate(orbit, { rotate: 360, duration: 60000, ease: 'linear', loop: true, autoplay: false });
    const pulseAnims = pulses.map((p, i) => ctx.animate(p.el, {
      translateX: i % 2 ? [p.dx, 0] : [0, p.dx], translateY: i % 2 ? [p.dy, 0] : [0, p.dy], opacity: [0, 1, 1, 0],
      duration: 1600, delay: (i % 2) * 800 + p.link * 200, loop: true, ease: 'inOutSine', autoplay: false,
    }));
    const haloAnims = [...halos, coreHalo].map(h => ctx.animate(h, { scale: [1, 1.5], opacity: [0.6, 0], duration: 1800, loop: true, ease: 'outQuad', autoplay: false }));

    const articles = $$('.ee-view', pin);
    const panels = $$('.ee-panel-body', pin);
    const tabs = $$<HTMLButtonElement>('.ee-tabs button', pin);
    const counter = $('.ee-count', pin);
    let current = -1, active = false;
    const fades: any[][] = VIEWS.map(() => []);
    const stopFades = (k: number) => { fades[k].forEach(a => a.pause()); fades[k] = []; };
    const syncLoops = () => {
      const on = active && !ctx.reduce;
      dial.idle.forEach(a => (on ? a.play() : a.pause()));
      on ? orbitSpin.play() : orbitSpin.pause();
      pulseAnims.forEach((a, i) => (on && (current === 3 || pulses[i].link === current) ? a.play() : a.pause()));
      haloAnims.forEach((a, i) => (on && (i === current || (i === 3 && current === 3)) ? a.play() : a.pause()));
      [...halos, coreHalo].forEach((h, i) => { if (!(i === current || (i === 3 && current === 3))) h.setAttribute('opacity', '0'); });
      pulses.forEach(p => { if (!(current === 3 || p.link === current)) p.el.setAttribute('opacity', '0'); });
    };

    const highlight = (i: number, instant: boolean) => {
      const d = instant ? 0 : 500;
      NODES.forEach((_, k) => {
        const sel = k === i, isCore = i === 3;
        ctx.animate(nodeGroups[k], { opacity: sel || isCore ? 1 : 0.42, scale: sel ? 1.08 : 1, duration: d, ease: 'outExpo' });
        ctx.animate(solids[k], { opacity: sel ? 1 : 0, duration: d, ease: 'outQuad' });
        ctx.animate(darkIcons[k], { opacity: sel ? 1 : 0, duration: d, ease: 'outQuad' });
        ctx.animate(linkGroups[k], { opacity: sel || isCore ? 1 : 0.22, duration: d, ease: 'outQuad' });
      });
    };

    const go = (i: number) => {
      if (i === current) return;
      const prev = current; current = i;
      tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-pressed', String(k === i)); });
      counter.textContent = `0${i + 1} / 04`;
      highlight(i, ctx.reduce || prev === -1);
      [articles, panels].forEach(list => list.forEach((el, k) => {
        if (k !== i && k !== prev) { el.classList.remove('is-active'); ctx.set(el, { opacity: 0 }); }
      }));
      if (prev > -1) {
        stopFades(prev);
        const out = [articles[prev], panels[prev]];
        if (ctx.reduce) out.forEach(el => { el.classList.remove('is-active'); ctx.set(el, { opacity: 0 }); });
        else out.forEach(el => fades[prev].push(ctx.animate(el, { opacity: 0, translateY: -14, duration: 300, ease: 'inQuad', onComplete: () => { if (current !== prev) el.classList.remove('is-active'); } })));
      }
      stopFades(i);
      const inn = [articles[i], panels[i]];
      inn.forEach(el => el.classList.add('is-active'));
      if (ctx.reduce) inn.forEach(el => ctx.set(el, { opacity: 1, translateY: 0 }));
      else {
        inn.forEach(el => fades[i].push(ctx.animate(el, { opacity: [0, 1], translateY: [20, 0], duration: 700, delay: 140, ease: 'outExpo' })));
        fades[i].push(ctx.animate($$('.ee-title, .ee-text, .ee-cap', articles[i]), { opacity: [0, 1], translateY: [14, 0], duration: 700, delay: stagger(60, { start: 180 }), ease: 'outExpo' }));
      }
      syncLoops();
    };

    const onTab = (k: number) => () => {
      const top = pin.getBoundingClientRect().top + window.scrollY;
      const span = pin.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * ((k + 0.5) / 4), behavior: ctx.reduce ? 'auto' : 'smooth' });
    };
    const handlers = tabs.map((t, k) => { const h = onTab(k); t.addEventListener('click', h); return h; });
    ctx.onCleanup(() => tabs.forEach((t, k) => t.removeEventListener('click', handlers[k])));
    ctx.whenVisible(pin, () => { active = true; syncLoops(); }, () => { active = false; syncLoops(); });

    // local progress ruler
    const rTicks = $$('.ee-ruler-ticks i', pin), rMark = $('.ee-ruler-mark', pin), rTrack = $('.ee-ruler-ticks', pin);
    go(0);
    const circ = 2 * Math.PI * 296;
    ctx.onCleanup(subscribeScroll(() => {
      const p = pinProgress(pin);
      go(Math.min(3, Math.floor(p * 4 * 0.9999)));
      dial.prog?.setAttribute('stroke-dashoffset', (circ * (1 - p)).toFixed(1));
      rMark.style.transform = `translateX(${(p * (rTrack.offsetWidth - 2)).toFixed(1)}px)`;
      const hot = Math.round(p * (TICKS - 1));
      rTicks.forEach((t, k) => t.classList.toggle('hot', Math.abs(k - hot) <= 1));
    }));
  });

  return (
    <section className="layers section-dark" id="layers" data-theme="dark" data-label="Explore the engine" aria-label="Explore the engine">
      <div ref={root} className="layers-pin">
        <div className="layers-sticky">
          <div className="ee wrap">
            <div className="ee-copy">
              {VIEWS.map((v, i) => (
                <article key={v.key} className={`ee-view${i === 0 ? ' is-active' : ''}`}>
                  <p className="eyebrow">Explore the engine</p>
                  <h3 className="ee-title">{v.title}</h3>
                  <p className="ee-text">{v.text}</p>
                  <ul className="ee-caps">
                    {v.caps.map(c => (
                      <li key={c.t} className="ee-cap">
                        <span className="ee-cap-ico"><Icon name={c.icon} size={20} /></span>
                        <span><b>{c.t}</b><span>{c.d}</span></span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div ref={dialRef} className="dial ee-dial" aria-hidden="true" />
            <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
              {['users', 'car', 'building'].map(k => <symbol key={k} id={`ew-ico-${k}`} viewBox="0 0 24 24">{iconPaths(k)}</symbol>)}
            </svg>

            <aside className="ee-panel" aria-live="polite">
              <div className="ee-panel-head code"><span>agex.engine</span><span className="ee-count">01 / 04</span></div>
              <div className="ee-panel-bodies">
                {VIEWS.map((v, i) => (
                  <dl key={v.key} className={`ee-panel-body${i === 0 ? ' is-active' : ''}`}>
                    <dt>Layer</dt><dd>{v.panel.layer}</dd>
                    <dt>Purpose</dt><dd>{v.panel.purpose}</dd>
                    <dt>Key capabilities</dt><dd><ul>{v.caps.map(c => <li key={c.t}>{c.t}</li>)}</ul></dd>
                    <dt>Used by</dt><dd>{v.panel.usedBy}</dd>
                    <dt>Outcome</dt><dd>{v.panel.outcome}</dd>
                  </dl>
                ))}
              </div>
            </aside>

            <div className="ee-bottom">
              <div className="ee-tabs" role="group" aria-label="Engine views">
                {VIEWS.map((v, i) => (
                  <Fragment key={v.key}>
                    {i > 0 && <span className="ee-tab-sep" aria-hidden="true" />}
                    <button type="button" className={i === 0 ? 'is-active' : undefined} aria-pressed={i === 0}>
                      <span className="code">0{i + 1}</span> {v.title}
                    </button>
                  </Fragment>
                ))}
              </div>
              <div className="ee-ruler" aria-hidden="true">
                <span className="label">Explore the engine</span>
                <span className="ee-ruler-track">
                  <span className="ee-ruler-ticks">{Array.from({ length: TICKS }, (_, i) => <i key={i} className={i % 5 === 0 ? 'major' : undefined} />)}</span>
                  <span className="ee-ruler-mark" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

