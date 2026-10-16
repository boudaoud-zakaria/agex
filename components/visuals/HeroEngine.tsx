'use client';

import { useRef } from 'react';
import { stagger, svg as asvg } from 'animejs';
import Icon from '@/components/Icon';
import { box, iso, loop, pin, plate } from '@/lib/iso';
import { $$, mk, seeded, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
const OX = 410, OY = 330;

const ENVS = [
  { key: 'ride', at: [-232, 0], label: 'Ride-hailing', text: 'On-demand rides and scheduled rides.', icon: 'car' },
  { key: 'delivery', at: [0, -232], label: 'Delivery', text: 'On-demand and scheduled delivery.', icon: 'box' },
  { key: 'fleet', at: [232, 0], label: 'Fleet', text: 'Corporate, government and private fleets.', icon: 'truck' },
] as const;

// Card anchor positions (% of the scene box)
const CARD_POS: Record<string, { left: string; top: string }> = {
  ride: { left: '36%', top: '2%' },
  delivery: { left: '79%', top: '-2%' },
  fleet: { left: '44%', top: '81%' },
};

/** Approved hero visual: the AGEX engine connected to three mobility environments. */
export default function HeroEngine() {
  const svgRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useAnime(ctx => {
    const s = svgRef.current, root = rootRef.current;
    if (!s || !root) return;
    s.innerHTML = '';
    ctx.onCleanup(() => { s.innerHTML = ''; });
    const rnd = seeded(11);
    const P = iso(OX, OY);

    // faint ground grid
    const grid = mk('g', { class: 'he-grid' }, s);
    for (let i = -6; i <= 6; i++) {
      const k = i * 64;
      const a = P(k, -400), b = P(k, 400), c = P(-400, k), d = P(400, k);
      mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grid);
      mk('line', { x1: c[0], y1: c[1], x2: d[0], y2: d[1] }, grid);
    }

    // connections (engine ↔ environments)
    const linkG = mk('g', {}, s);
    const links = ENVS.map(e => {
      const [eu, ev] = e.at;
      const dir = [Math.sign(eu), Math.sign(ev)];
      const a = P(dir[0] * 62, dir[1] * 62), b = P(eu - dir[0] * 80, ev - dir[1] * 80);
      mk('path', { class: 'he-link-base', d: `M${a[0]} ${a[1]} L${b[0]} ${b[1]}` }, linkG);
      return mk('path', { class: 'he-link', d: `M${a[0]} ${a[1]} L${b[0]} ${b[1]}` }, linkG);
    });

    // environments
    const outlines: Element[] = [], buildings: Element[] = [], roads: SVGPathElement[] = [], vehicles: Array<{ el: Element; path: SVGPathElement; dur: number; delay: number }> = [];
    ENVS.forEach(e => {
      const EP = iso(...P(e.at[0], e.at[1]));
      const g = mk('g', { class: `he-env he-${e.key}` }, s);
      const pl = plate(g, EP, 78, 10, 'pl he-plate');
      outlines.push(...pl.outline);
      const roadPath = mk('path', { class: 'he-road', d: loop(EP, -62, -62, 62, 62, 18) }, g);
      roads.push(roadPath);
      const bg = mk('g', {}, g);
      const list: number[][] =
        e.key === 'ride' ? [[-26, -28, 20, 20, 96], [0, -30, 16, 16, 128], [-30, 2, 18, 18, 72], [22, -6, 14, 14, 58], [-6, 24, 18, 16, 44], [24, 26, 12, 12, 34], [-36, 32, 10, 10, 26]]
        : e.key === 'delivery' ? [[-24, -24, 34, 22, 26], [20, -28, 22, 16, 44], [-26, 18, 18, 18, 18], [6, 2, 16, 16, 30], [26, 22, 22, 18, 22], [-2, 32, 12, 12, 14]]
        : [[-12, -26, 70, 24, 26], [28, 6, 26, 40, 20]];
      list.sort((a, b) => a[0] + a[1] - (b[0] + b[1])).forEach(([u, v, w, d, h]) => buildings.push(box(bg, EP, u, v, w, d, h, 'bx he-bx')));
      if (e.key === 'fleet') {
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) buildings.push(box(bg, EP, -34 + c * 14, 10 + r * 11, 10, 6, 5, 'bx he-car'));
      }
      if (e.key !== 'ride') pin(g, EP, e.key === 'delivery' ? 40 : -40, e.key === 'delivery' ? -2 : -40, 26, 'pin he-pin');
      else pin(g, EP, 38, 40, 22, 'pin he-pin');
      // moving vehicles on the loop road
      const n = e.key === 'ride' ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const v = mk('g', { class: 'he-veh' }, g);
        mk('circle', { r: 7, class: 'he-veh-glow' }, v);
        mk('rect', { x: -4.5, y: -2.5, width: 9, height: 5, rx: 1.6, class: 'he-veh-body' }, v);
        vehicles.push({ el: v, path: roadPath, dur: 9000 + rnd() * 5000, delay: -(i / n) * 9000 });
      }
    });

    // the engine: three stacked layers with the AGEX mark
    const eng = mk('g', { class: 'he-engine' }, s);
    const layers = [0, 12, 24].map((z, i) => {
      const LP = iso(OX, OY - z);
      const p = plate(eng, LP, 62 - i * 3, 9, `pl he-eng he-eng-${i}`);
      outlines.push(...p.outline);
      return p;
    });
    const top = layers[2];
    const glow = mk('polygon', { class: 'he-glow', points: top.top.getAttribute('points')! }, eng);
    const markG = mk('g', { transform: `matrix(1 .5 -1 .5 ${OX} ${OY - 24})` }, eng);
    mk('use', { href: '#agex-logo', width: 1841, height: 254, class: 'he-mark', transform: `translate(-38 -5.2) scale(${76 / 1841})` }, markG);

    if (ctx.reduce) return;

    // ---- intro
    const outlineDraw = asvg.createDrawable(outlines);
    const linkDraw = asvg.createDrawable(links);
    const roadDraw = asvg.createDrawable(roads);
    const cards = $$('.he-card', root);
    const vehEls = vehicles.map(v => v.el);
    ctx.set(outlineDraw, { draw: '0 0' }); ctx.set(linkDraw, { draw: '0 0' }); ctx.set(roadDraw, { draw: '0 0' });
    ctx.set(buildings, { scaleY: 0 }); ctx.set([glow, markG, ...vehEls], { opacity: 0 }); ctx.set(cards, { opacity: 0, translateY: 10 });
    ctx.set($$('.he-plate .pl-t, .he-plate .pl-l, .he-plate .pl-r, .he-eng .pl-t, .he-eng .pl-l, .he-eng .pl-r', s), { fillOpacity: 0 });
    ctx.set($$('.he-pin', s), { opacity: 0 });

    const loops: any[] = [];
    const startLoops = () => {
      vehicles.forEach(v => {
        const mp = asvg.createMotionPath(v.path);
        const a = ctx.animate(v.el, { ...mp, duration: v.dur, ease: 'linear', loop: true });
        a.seek(((-v.delay) % v.dur + v.dur) % v.dur);
        loops.push(a);
      });
      // light pulses travelling out from the engine and back
      links.forEach((l, i) => {
        for (let k = 0; k < 2; k++) {
          const p = mk('circle', { class: 'he-pulse', r: 3 }, linkG);
          const mp = asvg.createMotionPath(l);
          loops.push(ctx.animate(p, { ...mp, opacity: [0, 1, 1, 0], duration: 2400, delay: i * 500 + k * 1200, loop: true, ease: 'inOutSine', ...(k ? { reversed: true } : {}) }));
        }
      });
      loops.push(ctx.animate(glow, { opacity: [0.35, 1, 0.35], duration: 3200, loop: true, ease: 'inOutSine' }));
      loops.push(ctx.animate($$('.he-pin', s), { translateY: [0, -4, 0], duration: 2600, delay: stagger(500), loop: true, ease: 'inOutSine' }));
    };

    ctx.timeline({ defaults: { ease: 'outExpo' } })
      .add(outlineDraw, { draw: ['0 0', '0 1'], duration: 1400, delay: stagger(25), ease: 'inOutQuad' }, 200)
      .add($$('.pl-t, .pl-l, .pl-r', s), { fillOpacity: [0, 1], duration: 800, delay: stagger(12) }, 700)
      .add(roadDraw, { draw: ['0 0', '0 1'], duration: 1000, delay: stagger(150), ease: 'inOutQuad' }, 900)
      .add(buildings, { scaleY: [0, 1], duration: 900, delay: stagger(30) }, 1000)
      .add(linkDraw, { draw: ['0 0', '0 1'], duration: 700, delay: stagger(120), ease: 'inOutQuad' }, 1400)
      .add([glow, markG], { opacity: [0, 1], duration: 800 }, 1600)
      .add($$('.he-pin', s), { opacity: [0, 1], duration: 500, delay: stagger(100) }, 1800)
      .add(vehEls, { opacity: [0, 1], duration: 500 }, 1900)
      .add(cards, { opacity: [0, 1], translateY: [10, 0], duration: 800, delay: stagger(140) }, 1700)
      .call(startLoops, 1900);

    ctx.whenVisible(root, () => loops.forEach(a => a.play()), () => loops.forEach(a => a.pause()), '0px');
  });

  return (
    <div ref={rootRef} className="he">
      <svg ref={svgRef} className="he-svg" viewBox="10 -6 800 566" aria-hidden="true" />
      {ENVS.map(e => (
        <div key={e.key} className={`he-card he-card-${e.key}`} style={CARD_POS[e.key]}>
          <span className="he-ico"><Icon name={e.icon} size={20} /></span>
          <span><b>{e.label}</b><span>{e.text}</span></span>
        </div>
      ))}
    </div>
  );
}
