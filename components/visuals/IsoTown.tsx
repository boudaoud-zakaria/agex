'use client';

import { useRef } from 'react';
import { stagger, svg as asvg } from 'animejs';
import { box, iso, loop, pin, road } from '@/lib/iso';
import { mk, seeded, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Preset = 'ride' | 'delivery' | 'fleet';
const W = 1100, H = 900, OX = 560, OY = 440;

/** Light isometric town for solution heroes: roads, buildings, moving vehicles, a pulsing destination. */
export default function IsoTown({ preset = 'ride' }: { preset?: Preset }) {
  const ref = useRef<SVGSVGElement>(null);

  useAnime(ctx => {
    const s = ref.current;
    if (!s) return;
    s.innerHTML = '';
    ctx.onCleanup(() => { s.innerHTML = ''; });
    const rnd = seeded(preset === 'ride' ? 3 : preset === 'delivery' ? 9 : 21);
    const P = iso(OX, OY);

    // ground grid
    const grid = mk('g', { class: 'it-grid' }, s);
    for (let i = -8; i <= 8; i++) {
      const k = i * 40, a = P(k, -330), b = P(k, 330), c = P(-330, k), d = P(330, k);
      mk('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, grid);
      mk('line', { x1: c[0], y1: c[1], x2: d[0], y2: d[1] }, grid);
    }

    // roads
    const roadG = mk('g', {}, s);
    const routes: SVGPathElement[] = [];
    const addRoad = (d: string, hot = false) => {
      mk('path', { class: 'it-road', d }, roadG);
      const r = mk('path', { class: hot ? 'it-lane it-hot' : 'it-lane', d }, roadG);
      routes.push(r);
      return r;
    };
    const main = addRoad(road(P, [[-330, 40], [-60, 40], [-60, -330]], 30), true);
    addRoad(road(P, [[330, -40], [40, -40], [40, 330]], 30));
    const ring = addRoad(loop(P, -200, -200, 200, 200, 60));
    addRoad(road(P, [[-330, 200], [330, 200]], 0));

    // buildings
    const bG = mk('g', {}, s);
    const blds: Element[] = [];
    const spots: number[][] = [];
    for (let u = -280; u <= 280; u += 56) for (let v = -280; v <= 280; v += 56) {
      const nearRoad = Math.abs(v - 40) < 40 || Math.abs(u + 60) < 40 || Math.abs(v + 40) < 40 || Math.abs(u - 40) < 40 || Math.abs(v - 200) < 34
        || (Math.abs(Math.max(Math.abs(u), Math.abs(v)) - 200) < 34);
      if (nearRoad || rnd() < 0.32) continue;
      spots.push([u, v]);
    }
    spots.sort((a, b) => a[0] + a[1] - (b[0] + b[1])).forEach(([u, v]) => {
      const tall = preset === 'ride' ? 30 + rnd() * 80 : preset === 'delivery' ? 14 + rnd() * 34 : 12 + rnd() * 22;
      const w = preset === 'fleet' && rnd() < 0.3 ? 46 : 22 + rnd() * 14;
      blds.push(box(bG, P, u, v, w, 22 + rnd() * 10, tall, 'bx it-bx'));
    });
    if (preset === 'fleet') {
      // parked fleet rows
      for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) blds.push(box(bG, P, 100 + c * 18, -150 + r * 12, 13, 7, 6, 'bx it-car'));
    }

    // destination pin(s)
    const pins = [pin(s, P, -60, 40, 26, 'pin it-pin')];
    if (preset === 'delivery') pins.push(pin(s, P, 40, -200, 26, 'pin it-pin'), pin(s, P, 200, 120, 26, 'pin it-pin'));
    const pulse = mk('ellipse', { class: 'it-pulse', cx: P(-60, 40)[0], cy: P(-60, 40)[1], rx: 26, ry: 13, style: 'transform-box:fill-box;transform-origin:center' }, s);

    // vehicles
    const vehG = mk('g', {}, s);
    const vehicles: Array<{ el: Element; path: SVGPathElement; dur: number; at: number }> = [];
    const n = preset === 'ride' ? 7 : 6;
    for (let i = 0; i < n; i++) {
      const v = mk('g', { class: 'it-veh' }, vehG);
      const big = preset !== 'ride' && i % 3 === 0;
      mk('rect', { x: big ? -8 : -6, y: big ? -4 : -3, width: big ? 16 : 12, height: big ? 8 : 6, rx: 2, class: 'it-veh-body' }, v);
      const path = i % 3 === 0 ? ring : routes[i % routes.length];
      vehicles.push({ el: v, path, dur: 11000 + rnd() * 7000, at: rnd() });
    }
    if (ctx.reduce) return;

    const roadDraw = asvg.createDrawable(Array.from(roadG.children));
    ctx.set(roadDraw, { draw: '0 0' }); ctx.set(blds, { scaleY: 0 }); ctx.set([...pins, pulse, vehG], { opacity: 0 });
    const loops: any[] = [];
    ctx.onEnter(s, () => {
      ctx.timeline({ defaults: { ease: 'outExpo' } })
        .add(roadDraw, { draw: ['0 0', '0 1'], duration: 1600, delay: stagger(60), ease: 'inOutQuad' }, 0)
        .add(blds, { scaleY: [0, 1], duration: 1000, delay: stagger(14) }, 300)
        .add([...pins, vehG], { opacity: [0, 1], duration: 600 }, 1200)
        .add(pulse, { opacity: [0, 1], duration: 300 }, 1300)
        .call(() => loops.forEach(a => a.play()), 1300);
    }, 0.15);
    vehicles.forEach(v => {
      const a = ctx.animate(v.el, { ...asvg.createMotionPath(v.path), duration: v.dur, ease: 'linear', loop: true, autoplay: false });
      a.seek(v.at * v.dur);
      loops.push(a);
    });
    loops.push(ctx.animate(pulse, { scale: [0.6, 2.2], opacity: [0.8, 0], duration: 2200, loop: true, ease: 'outQuad', autoplay: false }));
    loops.push(ctx.animate(pins, { translateY: [0, -4, 0], duration: 2400, delay: stagger(400), loop: true, ease: 'inOutSine', autoplay: false }));
    ctx.whenVisible(s, () => { if (s.dataset.started) loops.forEach(a => a.play()); }, () => loops.forEach(a => a.pause()));
    ctx.onEnter(s, () => { s.dataset.started = '1'; }, 0.15);
  });

  return <svg ref={ref} className={`it it-${preset}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true" />;
}
