'use client';

import { useRef } from 'react';
import { stagger, svg } from 'animejs';
import SplitHeading from '@/components/SplitHeading';
import { mk, pinProgress, subscribeScroll, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
const PLATES = [
  { off: 26, exp: 205, name: 'Intelligence & operations', sub: 'Data, automation and integrations', tiles: ['Automation', 'Decisioning', 'Integrations', 'Extensions', 'Know-how', '#logo'] },
  { off: 0, exp: 0, name: 'Mobility core', sub: 'Matching, pricing, identity, support', tiles: ['Dispatch', 'Pricing', 'Payments', 'Fleet', 'Identity', 'Support'] },
  { off: -26, exp: -205, name: 'Experience layer', sub: 'Rider, captain and operator apps', tiles: ['Rider', 'Captain', 'Operator'] },
];

export default function EngineStack() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useAnime(ctx => {
    const s = svgRef.current, pin = pinRef.current;
    if (!s || !pin) return;
    // keep the <title>, rebuild the drawing
    const title = s.querySelector('title');
    s.innerHTML = '';
    if (title) s.appendChild(title);
    ctx.onCleanup(() => { s.innerHTML = ''; if (title) s.appendChild(title); });

    const W = 1020, cx = 380, cy = 440, H = 150, T = 18;
    const iso = (u: number, v: number): [number, number] => [cx + u - v, cy + 0.5 * u + 0.5 * v];
    const P = (pts: Array<[number, number]>) => pts.map(p => p.join(',')).join(' ');
    const axis = mk('line', { class: 'axis', x1: cx, y1: 120, x2: cx, y2: 820 }, s);
    const groups: Array<{ g: SVGGElement; exp: number }> = [];
    const outlines: SVGPolygonElement[] = [], faces: SVGPolygonElement[] = [], tiles: SVGGElement[] = [], leaders: SVGPathElement[] = [], labels: Element[] = [];

    PLATES.forEach(pl => {
      const g = mk('g', { transform: `translate(0 ${pl.off})` }, s);
      const inner = mk('g', {}, g);
      const top = iso(-H, -H), right = iso(H, -H), bottom = iso(H, H), left = iso(-H, H);
      const dn = (p: [number, number]): [number, number] => [p[0], p[1] + T];
      const fl = mk('polygon', { class: 'face-side', points: P([left, bottom, dn(bottom), dn(left)]) }, inner);
      const fr = mk('polygon', { class: 'face-side dark', points: P([bottom, right, dn(right), dn(bottom)]) }, inner);
      const ft = mk('polygon', { class: 'face-top', points: P([top, right, bottom, left]) }, inner);
      outlines.push(ft, fl, fr); faces.push(ft, fl, fr);
      const tg = mk('g', { transform: `matrix(1 .5 -1 .5 ${cx} ${cy})` }, inner);
      const cols = 3, rows = Math.ceil(pl.tiles.length / cols), tw = 84, th = rows === 1 ? 110 : 84, gap = 12;
      pl.tiles.forEach((label, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const x = (c - 1) * (tw + gap) - tw / 2;
        const y = rows === 1 ? -th / 2 : (r - 0.5) * (th + gap) - th / 2;
        const tile = mk('g', { style: 'transform-box:fill-box;transform-origin:center' }, tg);
        if (label === '#logo') {
          mk('rect', { class: 'tile-fill', x, y, width: tw, height: th, rx: 6 }, tile);
          mk('use', { href: '#agex-logo', width: 1841, height: 254, fill: '#f2f0eb', transform: `translate(${x + 12} ${y + th / 2 - 4.5}) scale(${(tw - 24) / 1841})` }, tile);
        } else {
          mk('rect', { class: 'tile', x, y, width: tw, height: th, rx: 6 }, tile);
          mk('text', { class: 'tile-txt', x: x + tw / 2, y: y + th / 2 + 4, 'text-anchor': 'middle', 'font-size': label.length > 10 ? 9 : 10.5 }, tile).textContent = label;
        }
        tiles.push(tile);
      });
      const [rx, ry] = right;
      const lg = mk('g', {}, inner);
      leaders.push(mk('path', { class: 'leader', d: `M${rx + 10} ${ry} H${rx + 40} L${rx + 60} ${ry - 22} H${rx + 70}` }, lg));
      const dot = mk('circle', { class: 'leader-dot', cx: rx + 6, cy: ry, r: 3 }, lg);
      const lt = mk('g', {}, lg);
      mk('text', { class: 'lbl', x: rx + 76, y: ry - 18 }, lt).textContent = pl.name;
      mk('text', { class: 'lbl-sub', x: rx + 76, y: ry + 4 }, lt).textContent = pl.sub;
      labels.push(lt, dot);
      groups.push({ g: inner, exp: pl.exp });
    });

    const outlineDraw = svg.createDrawable(outlines);
    const leaderDraw = svg.createDrawable(leaders);
    const fit = () => s.setAttribute('viewBox', window.innerWidth <= 860 ? '0 0 760 860' : `0 0 ${W} 860`);
    fit();
    window.addEventListener('resize', fit);
    ctx.onCleanup(() => window.removeEventListener('resize', fit));
    if (ctx.reduce) {
      groups.forEach(({ g, exp }) => ctx.set(g, { translateY: exp }));
      return;
    }
    // Explicit start states so scrubbing backwards always lands cleanly
    ctx.set(labels, { opacity: 0 }); ctx.set(leaderDraw, { draw: '0 0' });
    ctx.set(outlineDraw, { draw: '0 0' }); ctx.set(faces, { fillOpacity: 0 });
    ctx.set(tiles, { opacity: 0, scale: 0.6 }); ctx.set(axis, { opacity: 0 });

    const tl = ctx.timeline({ autoplay: false, defaults: { ease: 'linear' } })
      .add(axis, { opacity: [0, 0.45], duration: 120 }, 0)
      .add(outlineDraw, { draw: ['0 0', '0 1'], duration: 260, delay: stagger(18) }, 0)
      .add(faces, { fillOpacity: [0, 1], duration: 160, delay: stagger(14) }, 140)
      .add(tiles, { opacity: [0, 1], scale: [0.6, 1], duration: 140, delay: stagger(12), ease: 'outQuad' }, 220);
    groups.forEach(({ g, exp }) => tl.add(g, { translateY: [0, exp], duration: 420, ease: 'inOutQuad' }, 340));
    tl.add(leaderDraw, { draw: ['0 0', '0 1'], duration: 180, delay: stagger(40) }, 640)
      .add(labels, { opacity: [0, 1], duration: 140, delay: stagger(30) }, 700)
      .add({ v: 0 }, { v: 1, duration: 100 }, 900);
    tl.seek(0);
    ctx.onCleanup(subscribeScroll(() => tl.seek(pinProgress(pin) * tl.duration)));
  });

  return (
    <section className="engine section-light" id="engine" data-theme="light" data-label="03 / The engine">
      <div ref={pinRef} className="engine-pin">
        <div className="engine-sticky">
          <div className="wrap engine-head">
            <p className="eyebrow mono">03 <span className="sep">/</span> The engine</p>
            <SplitHeading className="display" text="One engine. End to end." />
            <p className="lede">Every essential layer of a mobility operation, working together.</p>
          </div>
          <div className="stack-wrap">
            <svg ref={svgRef} className="stack" viewBox="0 0 1020 860" role="img" aria-labelledby="stack-title">
              <title id="stack-title">The AGEX engine: an experience layer for riders, captains and operators, sitting on a shared mobility core, powered by an intelligence and operations layer.</title>
            </svg>
          </div>
          <ul className="stack-list wrap mono" aria-hidden="true">
            <li><b>Experience layer</b> Rider · Captain · Operator</li>
            <li><b>Mobility core</b> Matching · Pricing · Payments · Identity · Support</li>
            <li><b>Intelligence &amp; operations</b> Data · Automation · Integrations</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
