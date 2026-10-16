'use client';

import { useRef } from 'react';
import { stagger, svg as asvg } from 'animejs';
import { iconPaths } from '@/components/Icon';
import { iso, plate } from '@/lib/iso';
import { $$, mk, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
const EX = 400, EY = 268;
const NODES = [
  { key: 'ride', label: 'Ride-hailing', icon: 'car', x: 212, y: 168 },
  { key: 'delivery', label: 'Delivery', icon: 'truck', x: 640, y: 140 },
  { key: 'fleet', label: 'Fleet', icon: 'bus', x: 210, y: 392 },
  { key: 'transit', label: 'On-demand transit', icon: 'users', x: 628, y: 392 },
] as const;

const curve = (x1: number, y1: number, x2: number, y2: number, k: number) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return `M${x1} ${y1} C ${mx} ${y1 + k}, ${mx} ${y2 - k}, ${x2} ${y2}`;
};

/** About hero: the AGEX engine powering four kinds of mobility business. */
export default function AboutEngine() {
  const ref = useRef<SVGSVGElement>(null);

  useAnime(ctx => {
    const s = ref.current;
    if (!s) return;
    s.innerHTML = '';
    ctx.onCleanup(() => { s.innerHTML = ''; });

    // orbits + scattered gold points
    const orbit = mk('g', { class: 'ae-orbits' }, s);
    mk('ellipse', { cx: EX, cy: EY + 10, rx: 350, ry: 210 }, orbit);
    mk('ellipse', { cx: EX, cy: EY + 10, rx: 255, ry: 150 }, orbit);
    const sparks: Element[] = [];
    [[96, 210], [180, 470], [330, 40], [560, 60], [700, 260], [612, 480], [470, 520], [742, 120], [60, 330], [520, 200], [290, 330], [480, 345]]
      .forEach(([x, y], i) => sparks.push(mk('circle', { class: i % 3 ? 'ae-spark' : 'ae-spark is-big', cx: x, cy: y, r: i % 3 ? 2.2 : 3.6 }, s)));

    // gold paths
    const paths = NODES.map((n, i) => mk('path', { class: 'ae-path', d: curve(EX + (n.x < EX ? -70 : 70), EY + (n.y < EY ? -12 : 22), n.x + (n.x < EX ? 40 : -40), n.y + 14, i % 2 ? -40 : 40) }, s));

    // nodes (light iso tiles with upright icons)
    const nodes: Element[] = [];
    NODES.forEach(n => {
      const g = mk('g', { class: 'ae-node', style: 'transform-box:fill-box;transform-origin:center' }, s);
      const P = iso(n.x, n.y);
      plate(g, P, 36, 12, 'pl ae-tile');
      const ic = mk('g', { class: 'ae-ico', transform: `translate(${n.x - 16} ${n.y - 22}) scale(1.35)` }, g);
      ic.innerHTML = '';
      nodes.push(g);
      (g as any)._icon = ic;
      mk('text', { class: 'ae-label', x: n.x, y: n.y + 62, 'text-anchor': 'middle' }, g).textContent = n.label.toUpperCase();
    });
    // icons are React nodes: render from the hidden <symbol> sprite below
    NODES.forEach((n, i) => mk('use', { href: `#ae-ico-${n.icon}`, width: 24, height: 24 }, (nodes[i] as any)._icon));

    // the engine: glowing gold layers under a black top plate
    const eng = mk('g', { class: 'ae-engine' }, s);
    const layers = [0, 14, 28].map((z, i) => plate(eng, iso(EX, EY - z), 74 - i * 4, 10, `pl ae-eng ae-eng-${i}`));
    const glows = layers.slice(0, 2).map(l => mk('polygon', { class: 'ae-glow', points: l.top.getAttribute('points')! }, eng));
    const markG = mk('g', { transform: `matrix(1 .5 -1 .5 ${EX} ${EY - 28})` }, eng);
    mk('use', { href: '#agex-logo', width: 1841, height: 254, class: 'ae-mark', transform: `translate(-46 -6.4) scale(${92 / 1841})` }, markG);

    if (ctx.reduce) return;
    const draw = asvg.createDrawable(paths);
    ctx.set(draw, { draw: '0 0' }); ctx.set([...nodes, eng], { opacity: 0 }); ctx.set(sparks, { opacity: 0 });
    const loops: any[] = [];
    paths.forEach((p, i) => {
      for (let k = 0; k < 2; k++) {
        const c = mk('circle', { class: 'ae-pulse', r: 3.2 }, s);
        loops.push(ctx.animate(c, { ...asvg.createMotionPath(p), opacity: [0, 1, 1, 0], duration: 2600, delay: i * 350 + k * 1300, loop: true, ease: 'inOutSine', autoplay: false }));
      }
    });
    loops.push(ctx.animate(glows, { opacity: [0.45, 1, 0.45], duration: 3200, delay: stagger(400), loop: true, ease: 'inOutSine', autoplay: false }));
    loops.push(ctx.animate(nodes, { translateY: [0, -5], duration: 2600, delay: stagger(350), loop: true, alternate: true, ease: 'inOutSine', autoplay: false }));
    loops.push(ctx.animate(sparks, { opacity: [0.25, 1, 0.25], duration: 2400, delay: stagger(220), loop: true, ease: 'inOutSine', autoplay: false }));
    loops.push(ctx.animate($$('.ae-orbits ellipse', s), { strokeDashoffset: [0, -140], duration: 16000, loop: true, ease: 'linear', autoplay: false }));
    ctx.onEnter(s, () => {
      ctx.timeline({ defaults: { ease: 'outExpo' } })
        .add(eng, { opacity: [0, 1], translateY: [16, 0], duration: 900 }, 0)
        .add(nodes, { opacity: [0, 1], scale: [0.85, 1], duration: 700, delay: stagger(120) }, 300)
        .add(draw, { draw: ['0 0', '0 1'], duration: 1200, delay: stagger(140), ease: 'inOutQuad' }, 500)
        .add(sparks, { opacity: [0, 0.6], duration: 600, delay: stagger(40) }, 900)
        .call(() => loops.forEach(a => a.play()), 1500);
    }, 0.15);
    ctx.whenVisible(s, () => { if (s.dataset.on) loops.forEach(a => a.play()); }, () => loops.forEach(a => a.pause()));
    ctx.onEnter(s, () => { s.dataset.on = '1'; }, 0.15);
  });

  return (
    <div className="ae">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        {NODES.map(n => <symbol key={n.icon} id={`ae-ico-${n.icon}`} viewBox="0 0 24 24">{iconPaths(n.icon)}</symbol>)}
      </svg>
      <svg ref={ref} className="ae-svg" viewBox="0 0 800 560" role="img" aria-label="The AGEX engine powering ride-hailing, delivery, fleet and on-demand transit businesses." />
    </div>
  );
}
