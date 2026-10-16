'use client';

import { useRef } from 'react';
import { stagger, svg as asvg } from 'animejs';
import { iconPaths } from '@/components/Icon';
import { $$, mk, seeded, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Node = { x: number; y: number; icon?: string; hot?: boolean };
type Preset = { nodes: Node[]; edges: Array<[number, number, number?]>; route?: number[]; parked?: boolean };

const PRESETS: Record<'ride' | 'delivery' | 'fleet', Preset> = {
  ride: {
    nodes: [
      { x: 90, y: 300 }, { x: 210, y: 210, hot: true }, { x: 320, y: 90, hot: true }, { x: 420, y: 230, hot: true }, { x: 560, y: 120 },
      { x: 520, y: 330, hot: true }, { x: 300, y: 350 }, { x: 650, y: 260 }, { x: 160, y: 80 }, { x: 700, y: 60 },
    ],
    edges: [[0, 1, 30], [1, 2, -40], [1, 3, 20], [2, 4, 30], [3, 4, -30], [3, 5, 25], [1, 6, -20], [6, 5, 30], [5, 7, -25], [4, 9, 20], [8, 2, -20], [4, 7, 30], [0, 6, 25]],
    route: [0, 1, 3, 5, 7],
  },
  delivery: {
    nodes: [
      { x: 120, y: 290, icon: 'box' }, { x: 260, y: 90, icon: 'utensils' }, { x: 560, y: 110, icon: 'bag' }, { x: 670, y: 300, icon: 'home' },
      { x: 300, y: 250 }, { x: 430, y: 190 }, { x: 500, y: 320 }, { x: 390, y: 70 },
    ],
    edges: [[0, 4, 30], [1, 4, -30], [4, 5, 20], [5, 2, -25], [5, 6, 25], [6, 3, -20], [2, 3, 30], [1, 7, 20], [7, 2, -20], [0, 6, 40]],
    route: [1, 4, 5, 6, 3],
  },
  fleet: {
    nodes: [{ x: 150, y: 120, hot: true }, { x: 330, y: 200, hot: true }, { x: 470, y: 150, hot: true }, { x: 640, y: 280, hot: true }],
    edges: [[0, 1, 0], [1, 2, 0], [2, 3, 0]],
    route: [0, 1, 2, 3],
    parked: true,
  },
};

const curve = (a: Node, b: Node, k = 0) => {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
  return `M${a.x} ${a.y} Q${(mx - (dy / L) * k).toFixed(1)} ${(my + (dx / L) * k).toFixed(1)} ${b.x} ${b.y}`;
};

/** Dark "opportunity" visual: a local network lighting up, with vehicles moving along it. */
export default function NetworkGraph({ preset = 'ride' }: { preset?: keyof typeof PRESETS }) {
  const ref = useRef<SVGSVGElement>(null);
  const cfg = PRESETS[preset];

  useAnime(ctx => {
    const s = ref.current;
    if (!s) return;
    const rnd = seeded(5);
    const dyn = s.querySelector('.ng-dyn')!;
    ctx.onCleanup(() => { dyn.innerHTML = ''; });
    // parked fleet grid (fleet preset)
    if (cfg.parked) {
      for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) {
        const x = 70 + c * 78 + (r % 2) * 20, y = 40 + r * 78;
        if (rnd() < 0.18) continue;
        mk('rect', { class: 'ng-parked', x, y, width: 34, height: 18, rx: 4, transform: `rotate(-28 ${x + 17} ${y + 9})` }, dyn);
      }
    }
    if (ctx.reduce) return;
    const edges = $$<SVGPathElement>('.ng-edge', s);
    const hot = $$('.ng-hot', s);
    const draw = asvg.createDrawable(edges);
    ctx.set(draw, { draw: '0 0' });
    const loops: any[] = [];
    // pulses on every edge, vehicles on the highlighted route
    edges.forEach((e, i) => {
      const p = mk('circle', { class: 'ng-pulse', r: 2.6 }, dyn);
      loops.push(ctx.animate(p, { ...asvg.createMotionPath(e), opacity: [0, 1, 1, 0], duration: 2600 + (i % 4) * 500, delay: i * 260, loop: true, ease: 'inOutSine', autoplay: false }));
    });
    const routeEl = s.querySelector<SVGPathElement>('.ng-route');
    if (routeEl) {
      const rd = asvg.createDrawable(routeEl);
      ctx.set(rd, { draw: '0 0' });
      ctx.onEnter(s, () => ctx.animate(rd, { draw: ['0 0', '0 1'], duration: 1800, delay: 900, ease: 'inOutQuad' }), 0.2);
      for (let k = 0; k < 2; k++) {
        const v = mk('g', { class: 'ng-veh' }, dyn);
        mk('circle', { r: 9, class: 'ng-veh-glow' }, v);
        mk('rect', { x: -6, y: -3.5, width: 12, height: 7, rx: 2.2, class: 'ng-veh-body' }, v);
        const a = ctx.animate(v, { ...asvg.createMotionPath(routeEl), duration: 7000, ease: 'inOutSine', loop: true, alternate: true, autoplay: false });
        a.seek(k * 3500);
        loops.push(a);
      }
    }
    loops.push(ctx.animate(hot, { scale: [1, 1.9], opacity: [0.7, 0], duration: 2200, delay: stagger(400), loop: true, ease: 'outQuad', autoplay: false }));
    ctx.onEnter(s, () => ctx.animate(draw, { draw: ['0 0', '0 1'], duration: 1400, delay: stagger(70), ease: 'inOutQuad' }), 0.2);
    ctx.whenVisible(s, () => loops.forEach(a => a.play()), () => loops.forEach(a => a.pause()));
  });

  const routeD = cfg.route
    ? cfg.route.slice(1).reduce((d, n, i) => {
        const a = cfg.nodes[cfg.route![i]], b = cfg.nodes[n];
        return d + ' ' + curve(a, b, cfg.parked ? 0 : 18).replace(/^M[^Q]+/, '');
      }, `M${cfg.nodes[cfg.route[0]].x} ${cfg.nodes[cfg.route[0]].y}`)
    : '';

  return (
    <svg ref={ref} className={`ng ng-${preset}`} viewBox="0 0 760 400" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g className="ng-dyn" />
      {cfg.edges.map(([a, b, k], i) => <path key={i} className="ng-edge" d={curve(cfg.nodes[a], cfg.nodes[b], k ?? 0)} />)}
      {routeD && <path className="ng-route" d={routeD} />}
      {cfg.nodes.map((n, i) => (
        <g key={i}>
          {n.icon ? (
            <>
              <circle className="ng-ring" cx={n.x} cy={n.y} r={24} />
              <circle className="ng-hot" cx={n.x} cy={n.y} r={24} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
              <g transform={`translate(${n.x - 12} ${n.y - 12})`} className="ng-icon">{iconPaths(n.icon)}</g>
            </>
          ) : (
            <>
              {n.hot && <circle className="ng-hot" cx={n.x} cy={n.y} r={9} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />}
              <circle className={n.hot ? 'ng-node is-hot' : 'ng-node'} cx={n.x} cy={n.y} r={n.hot ? 6 : 3.5} />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}
