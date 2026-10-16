'use client';

import { useRef } from 'react';
import { stagger, svg as asvg } from 'animejs';
import { $$, mk, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
const CX = 380, CY = 640, R = 470;
const CITIES = [[150, 380], [330, 300], [470, 330], [610, 390], [260, 420], [520, 450], [700, 470]];
const ARCS: Array<[number, number]> = [[0, 1], [1, 2], [2, 3], [1, 5], [4, 2], [3, 6], [0, 4]];

/** Wireframe horizon globe with connection arcs (investor / partner contact). */
export default function GlobeArcs() {
  const ref = useRef<SVGSVGElement>(null);

  useAnime(ctx => {
    const s = ref.current;
    if (!s) return;
    const dyn = s.querySelector('.ga-dyn')!;
    ctx.onCleanup(() => { dyn.innerHTML = ''; });
    if (ctx.reduce) return;
    const arcs = $$<SVGPathElement>('.ga-arc', s);
    const draw = asvg.createDrawable(arcs);
    ctx.set(draw, { draw: '0 0' });
    const loops: any[] = [];
    arcs.forEach((a, i) => {
      const p = mk('circle', { class: 'ga-pulse', r: 2.6 }, dyn);
      loops.push(ctx.animate(p, { ...asvg.createMotionPath(a), opacity: [0, 1, 1, 0], duration: 3000, delay: i * 420, loop: true, ease: 'inOutSine', autoplay: false }));
    });
    loops.push(ctx.animate($$('.ga-city-glow', s), { scale: [1, 2.4], opacity: [0.7, 0], duration: 2400, delay: stagger(300), loop: true, ease: 'outQuad', autoplay: false }));
    ctx.onEnter(s, () => ctx.animate(draw, { draw: ['0 0', '0 1'], duration: 1600, delay: stagger(140, { start: 400 }), ease: 'inOutQuad' }), 0.05);
    ctx.whenVisible(s, () => loops.forEach(a => a.play()), () => loops.forEach(a => a.pause()));
  });

  const arcD = ([a, b]: [number, number]) => {
    const [x1, y1] = CITIES[a], [x2, y2] = CITIES[b];
    const mx = (x1 + x2) / 2, lift = Math.hypot(x2 - x1, y2 - y1) * 0.45;
    return `M${x1} ${y1} Q${mx} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;
  };

  return (
    <svg ref={ref} className="ga" viewBox="0 0 760 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <clipPath id="ga-clip"><circle cx={CX} cy={CY} r={R} /></clipPath>
        <radialGradient id="ga-fade" cx="50%" cy="0%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity=".09" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r={R} fill="url(#ga-fade)" className="ga-body" />
      <g clipPath="url(#ga-clip)" className="ga-wire">
        {[-80, -40, 0, 40, 80, 130, 190].map(dx => <ellipse key={`m${dx}`} cx={CX + dx * 0.2} cy={CY} rx={Math.abs(R * Math.sin((dx / 200) * Math.PI / 2)) || 1} ry={R} />)}
        {[0.12, 0.28, 0.46, 0.66].map(k => <ellipse key={`p${k}`} cx={CX} cy={CY - R * (1 - k)} rx={R * Math.sqrt(1 - (1 - k) ** 2) * 1.02} ry={14 + k * 20} />)}
      </g>
      <circle cx={CX} cy={CY} r={R} className="ga-rim" />
      {ARCS.map((a, i) => <path key={i} className="ga-arc" d={arcD(a)} />)}
      <g className="ga-dyn" />
      {CITIES.map(([x, y], i) => (
        <g key={i}>
          <circle className="ga-city-glow" cx={x} cy={y} r={6} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
          <circle className="ga-city" cx={x} cy={y} r={2.6} />
        </g>
      ))}
    </svg>
  );
}
