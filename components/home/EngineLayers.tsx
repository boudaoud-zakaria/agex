'use client';

import { useRef } from 'react';
import { stagger, svg, utils } from 'animejs';
import { $, $$, buildDial, C, fb, gp, mk, pinProgress, roundedPath, seeded, subscribeScroll, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
const LAYERS = [
  { title: 'Rider', text: 'Booking, tracking and payments.', items: ['Booking', 'Live tracking', 'Payments'] },
  { title: 'Captain', text: 'Availability, trips and earnings.', items: ['Availability', 'Trips', 'Earnings'] },
  { title: 'Operator', text: 'Dispatch, fleet control and reporting.', items: ['Dispatch', 'Fleet control', 'Reporting'] },
  { title: 'Core', text: 'Matching, pricing, identity, support and integrations.', items: ['Matching & pricing', 'Identity & support', 'Integrations'] },
];

const SPECS = [
  ['module   rider', 'scope    booking', '         tracking', '         payments', 'brand    operator-owned', 'runs_on  agex.core'],
  ['module   captain', 'scope    availability', '         trips', '         earnings', 'brand    operator-owned', 'runs_on  agex.core'],
  ['module   operator', 'scope    dispatch', '         fleet control', '         reporting', 'surface  operator console', 'runs_on  agex.core'],
  ['module   core', 'scope    matching · pricing', '         identity · support', '         integrations', 'shared   rider · captain', '         operator'],
];

type Demo = { g: SVGGElement; tl: any };

export default function EngineLayers() {
  const root = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);

  useAnime(ctx => {
    const pin = root.current, host = dialRef.current;
    if (!pin || !host) return;
    const rnd = seeded(7);
    const dial = buildDial(host, ctx, { progress: true });
    const st = dial.stage;
    const demos: Demo[] = [];
    const txt = (g: Element, x: number, y: number, s: string, cls = '', anchor = 'middle') => {
      const t = mk('text', { x, y, 'text-anchor': anchor, class: cls }, g); t.textContent = s; return t;
    };

    // 01 Rider — pickup → route → drop-off, with booking states
    {
      const g = mk('g', { class: 'demo' }, st);
      const pts = ([[3, 9], [3, 6], [7, 6], [7, 3], [9, 3]] as const).map(p => gp(p[0], p[1]));
      const route = mk('path', { class: 'ln', d: roundedPath(pts, 12), 'stroke-width': 2.4 }, g);
      const a = pts[0], b = pts[pts.length - 1];
      const pickup = mk('circle', { class: 'solid', cx: a[0], cy: a[1], r: 7, ...fb }, g);
      const drop = mk('circle', { class: 'hollow', cx: b[0], cy: b[1], r: 7, ...fb }, g);
      const pr = mk('circle', { class: 'ln', cx: a[0], cy: a[1], r: 7, ...fb }, g);
      txt(g, a[0] + 14, a[1] + 4, 'Pickup', 'strong', 'start');
      txt(g, b[0] - 14, b[1] - 12, 'Drop-off', 'strong', 'end');
      const car = mk('g', {}, g);
      mk('circle', { r: 14, fill: '#fff', opacity: 0.12 }, car);
      mk('rect', { class: 'solid', x: -9, y: -4.5, width: 18, height: 9, rx: 3.5 }, car);
      const states = ['Booked', 'En route', 'Paid'].map((s, i) => txt(g, 222 + i * 78, 476, s));
      const draw = svg.createDrawable(route);
      const motion = svg.createMotionPath(route);
      const tl = ctx.timeline({ autoplay: false, loop: true })
        .add(states, { opacity: 0.3, duration: 1 }, 0)
        .add(pickup, { scale: [0, 1], duration: 500, ease: 'outBack' }, 0)
        .add(pr, { scale: [1, 3.4], opacity: [0.9, 0], duration: 1100, ease: 'outQuad' }, 100)
        .add(states[0], { opacity: [0.3, 1], duration: 300 }, 200)
        .add(car, { opacity: [0, 1], duration: 200 }, 700)
        .add(draw, { draw: ['0 0', '0 1'], duration: 2300, ease: 'inOutSine' }, 700)
        .add(car, { ...motion, duration: 2300, ease: 'inOutSine' }, 700)
        .add(states[0], { opacity: 0.3, duration: 300 }, 1000)
        .add(states[1], { opacity: [0.3, 1], duration: 300 }, 1000)
        .add(drop, { scale: [1, 1.5, 1], duration: 500 }, 3000)
        .add(states[1], { opacity: 0.3, duration: 300 }, 3100)
        .add(states[2], { opacity: [0.3, 1], duration: 300 }, 3100)
        .add([route, car], { opacity: 0, duration: 400 }, 4400)
        .add({ v: 0 }, { v: 1, duration: 200 }, 4800);
      demos.push({ g, tl });
    }

    // 02 Captain — availability field
    {
      const g = mk('g', { class: 'demo' }, st);
      const cand = dial.dots.filter(() => rnd() < 0.34);
      const caps = cand.map((d, i) => mk('circle', { class: i % 3 === 0 ? 'hollow' : 'solid', cx: d.getAttribute('cx')!, cy: d.getAttribute('cy')!, r: 4.5, ...fb }, g));
      txt(g, 245, 478, '● Available');
      txt(g, 355, 478, '○ On trip');
      const tl = ctx.animate(caps, {
        scale: [0, 1, 1, 1, 0], opacity: [0, 1, 1, 1, 0],
        duration: () => utils.random(2800, 4600), delay: () => utils.random(0, 1600),
        loop: true, ease: 'inOutSine', autoplay: false,
      });
      demos.push({ g, tl });
    }

    // 03 Operator — dispatch sweep
    {
      const g = mk('g', { class: 'demo' }, st);
      const veh: Array<{ ang: number; c: SVGCircleElement; line: SVGLineElement }> = [];
      for (let i = 0; i < 16; i++) {
        const ang = rnd() * Math.PI * 2, rad = 50 + rnd() * 140;
        const x = C + Math.cos(ang) * rad, y = C + Math.sin(ang) * rad;
        const line = mk('line', { x1: C, y1: C, x2: x, y2: y, stroke: '#fff', 'stroke-width': 1, opacity: 0 }, g);
        const c = mk('circle', { class: 'hollow', cx: x, cy: y, r: 4, ...fb }, g);
        veh.push({ ang: ((ang * 180) / Math.PI + 360) % 360, c, line });
      }
      const sweep = mk('g', { style: 'transform-origin:300px 300px' }, g);
      mk('path', { d: `M${C} ${C} L${C + 196} ${C} A196 196 0 0 0 ${C + 196 * Math.cos(-0.75)} ${C + 196 * Math.sin(-0.75)} Z`, fill: '#fff', opacity: 0.07 }, sweep);
      mk('line', { x1: C, y1: C, x2: C + 196, y2: C, stroke: '#fff', 'stroke-width': 1.6 }, sweep);
      mk('circle', { class: 'solid', cx: C, cy: C, r: 5 }, g);
      txt(g, C, 134, 'Dispatch', 'strong');
      const state = { a: 0 };
      const tl = ctx.animate(state, {
        a: 360, duration: 4200, loop: true, ease: 'linear', autoplay: false,
        onUpdate: () => {
          utils.set(sweep, { rotate: state.a });
          veh.forEach(v => {
            const diff = (state.a - v.ang + 360) % 360;
            const k = diff < 70 ? 1 - diff / 70 : 0;
            v.c.setAttribute('fill', k > 0.02 ? '#fff' : '#121212');
            v.c.style.transform = `scale(${1 + k * 0.8})`;
            v.line.setAttribute('opacity', (k * 0.5).toFixed(3));
          });
        },
      });
      demos.push({ g, tl });
    }

    // 04 Core — shared engine linked to rider, captain, operator
    {
      const g = mk('g', { class: 'demo' }, st);
      const orbit = mk('g', { style: 'transform-origin:300px 300px' }, g);
      mk('circle', { class: 'ln-dim', cx: C, cy: C, r: 88, 'stroke-dasharray': '2 6' }, orbit);
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; mk('circle', { class: 'solid', cx: C + Math.cos(a) * 88, cy: C + Math.sin(a) * 88, r: 3.5 }, orbit); }
      const pulses: Array<{ el: SVGCircleElement; dx: number; dy: number }> = [];
      ([['Rider', -90], ['Captain', 30], ['Operator', 150]] as const).forEach(([name, deg]) => {
        const a = (deg * Math.PI) / 180, x = C + Math.cos(a) * 166, y = C + Math.sin(a) * 166;
        const x0 = C + Math.cos(a) * 54, y0 = C + Math.sin(a) * 54, x1 = C + Math.cos(a) * 154, y1 = C + Math.sin(a) * 154;
        mk('line', { class: 'ln', x1: x0, y1: y0, x2: x1, y2: y1 }, g);
        mk('circle', { class: 'hollow', cx: x, cy: y, r: 11 }, g);
        mk('circle', { class: 'solid', cx: x, cy: y, r: 4 }, g);
        const off = deg === -90 ? [0, -22] : [Math.cos(a) * 18, Math.sin(a) * 18 + 22];
        txt(g, x + off[0], y + off[1], name, 'strong');
        pulses.push({ el: mk('circle', { class: 'solid', cx: x0, cy: y0, r: 3.2, opacity: 0 }, g), dx: x1 - x0, dy: y1 - y0 });
      });
      mk('circle', { cx: C, cy: C, r: 52, fill: '#fff' }, g);
      mk('use', { href: '#agex-logo', width: 1841, height: 254, fill: '#0a0a0a', transform: `translate(${C - 31} ${C - 12}) scale(${62 / 1841})` }, g);
      mk('text', { x: C, y: C + 20, 'text-anchor': 'middle', style: 'fill:#0a0a0a' }, g).textContent = 'Core';
      const tl = ctx.timeline({ autoplay: false, loop: true })
        .add(orbit, { rotate: [0, 72], duration: 3000, ease: 'inOutQuad' }, 0);
      pulses.forEach((p, i) => {
        tl.add(p.el, { translateX: [p.dx, 0], translateY: [p.dy, 0], opacity: [0, 1, 1, 0], duration: 1300, ease: 'inOutSine' }, i * 220)
          .add(p.el, { translateX: [0, p.dx], translateY: [0, p.dy], opacity: [0, 1, 1, 0], duration: 1300, ease: 'inOutSine' }, 1600 + i * 220);
      });
      demos.push({ g, tl });
    }

    demos.forEach(d => { d.g.style.transformOrigin = '300px 300px'; });
    const articles = $$('.layer', pin);
    const tabs = $$<HTMLButtonElement>('.layer-tabs button', pin);
    const specBody = $('.spec-body', pin);
    const specStep = $('.spec-step', pin);
    let current = -1, active = false, typer: any = null;

    const renderSpec = (lines: string[], n: number) => {
      const shown = lines.join('\n').slice(0, n);
      specBody.innerHTML = shown.split('\n').map(l => l.replace(/^(\S+)/, '<span class="k">$1</span>')).join('\n') + '<span class="caret"></span>';
    };

    // Per-step fade handles, so fast scrolling can never leave a stale fade-in running
    const fades: any[][] = demos.map(() => []);
    const stopFades = (k: number) => { fades[k].forEach(a => a.pause()); fades[k] = []; };

    const go = (i: number) => {
      if (i === current) return;
      const prev = current; current = i;
      tabs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-current', k === i ? 'step' : 'false'); });
      specStep.textContent = `0${i + 1}/04`;
      // Hard-reset every step that is neither leaving nor entering
      demos.forEach((d, k) => {
        if (k === i || k === prev) return;
        stopFades(k); d.tl.pause();
        ctx.set(d.g, { opacity: 0 }); ctx.set(articles[k], { opacity: 0 }); articles[k].classList.remove('is-active');
      });
      if (prev > -1) {
        const pa = articles[prev];
        stopFades(prev);
        demos[prev].tl.pause();
        if (ctx.reduce) { pa.classList.remove('is-active'); ctx.set(pa, { opacity: 0 }); ctx.set(demos[prev].g, { opacity: 0 }); }
        else {
          fades[prev].push(
            ctx.animate(pa, { opacity: 0, translateY: -18, duration: 320, ease: 'inQuad', onComplete: () => { if (current !== prev) pa.classList.remove('is-active'); } }),
            ctx.animate(demos[prev].g, { opacity: 0, scale: 0.94, duration: 350, ease: 'inQuad' }),
          );
        }
      }
      const na = articles[i];
      stopFades(i);
      na.classList.add('is-active');
      const lines = SPECS[i];
      if (ctx.reduce) {
        ctx.set(na, { opacity: 1 }); ctx.set(demos[i].g, { opacity: 1 });
        renderSpec(lines, Infinity);
        demos[i].tl.seek(i === 0 ? 3600 : 1500);
        return;
      }
      fades[i].push(
        ctx.animate(na, { opacity: [0, 1], translateY: [26, 0], duration: 700, delay: 160, ease: 'outExpo' }),
        ctx.animate($$('.layer-title, .layer-text, .arrow-list li', na), { opacity: [0, 1], translateY: [16, 0], duration: 700, delay: stagger(60, { start: 200 }), ease: 'outExpo' }),
        ctx.animate(demos[i].g, { opacity: [0, 1], scale: [0.94, 1], duration: 600, delay: 200, ease: 'outExpo' }),
      );
      if (active) demos[i].tl.restart();
      const total = lines.join('\n').length;
      const o = { n: 0 };
      typer?.pause();
      typer = ctx.animate(o, { n: total, duration: 900, ease: 'linear', onUpdate: () => renderSpec(lines, Math.round(o.n)) });
    };

    const onTab = (k: number) => () => {
      const top = pin.getBoundingClientRect().top + window.scrollY;
      const span = pin.offsetHeight - window.innerHeight;
      window.scrollTo({ top: top + span * ((k + 0.5) / 4), behavior: ctx.reduce ? 'auto' : 'smooth' });
    };
    const handlers = tabs.map((t, k) => { const h = onTab(k); t.addEventListener('click', h); return h; });
    ctx.onCleanup(() => tabs.forEach((t, k) => t.removeEventListener('click', handlers[k])));

    ctx.whenVisible(pin,
      () => { active = true; dial.idle.forEach(a => a.play()); if (current > -1 && !ctx.reduce) demos[current].tl.play(); },
      () => { active = false; dial.idle.forEach(a => a.pause()); if (current > -1) demos[current].tl.pause(); });

    go(0);
    const circ = 2 * Math.PI * 296;
    ctx.onCleanup(subscribeScroll(() => {
      const p = pinProgress(pin);
      go(Math.min(3, Math.floor(p * 4 * 0.9999)));
      dial.prog?.setAttribute('stroke-dashoffset', (circ * (1 - p)).toFixed(1));
    }));
  });

  return (
    <section className="layers section-dark" id="layers" data-theme="dark" data-label="03 / Engine layers" aria-label="Engine layers">
      <div ref={root} className="layers-pin">
        <div className="layers-sticky">
          <div className="layers-stage wrap">
            <div ref={dialRef} className="dial dial-lg" aria-hidden="true" />

            <div className="layer-copy">
              {LAYERS.map((l, i) => (
                <article key={l.title} className={`layer${i === 0 ? ' is-active' : ''}`} data-step={i}>
                  <p className="eyebrow mono">Layer 0{i + 1}</p>
                  <h3 className="layer-title">{l.title}</h3>
                  <p className="layer-text">{l.text}</p>
                  <ul className="arrow-list mono">{l.items.map(it => <li key={it}>{it}</li>)}</ul>
                </article>
              ))}
            </div>

            <div className="spec-card mono" aria-hidden="true">
              <div className="spec-head"><span>agex.engine</span><span className="spec-step">01/04</span></div>
              <pre className="spec-body" />
            </div>

            <ol className="layer-tabs mono">
              {LAYERS.map((l, i) => (
                <li key={l.title}><button type="button" className={i === 0 ? 'is-active' : undefined}>0{i + 1} {l.title}</button></li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
