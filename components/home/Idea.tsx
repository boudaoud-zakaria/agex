'use client';

import { useRef } from 'react';
import { stagger, svg } from 'animejs';
import SplitHeading from '@/components/SplitHeading';
import { fb, mk, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
const LABELS = [
  { p: [290, 175], e: [150, 95], end: [36, 95], t: 'Your brand', d: ['Own and grow', 'your local brand.'], anchor: 'start' },
  { p: [432, 282], e: [592, 205], end: [694, 205], t: 'Your market', d: ['Launch in your city,', 'country or region.'], anchor: 'end' },
  { p: [300, 402], e: [178, 520], end: [36, 520], t: 'Your operations', d: ['Run your business and', 'serve your customers.'], anchor: 'start' },
];

export default function Idea() {
  const globeRef = useRef<SVGSVGElement>(null);

  useAnime(ctx => {
    const s = globeRef.current;
    if (!s) return;
    s.innerHTML = '';
    ctx.onCleanup(() => { s.innerHTML = ''; });
    const gx = 340, gy = 300, R = 190;
    const outline = mk('circle', { class: 'g-strong', cx: gx, cy: gy, r: R }, s);
    const parallels = [-60, -30, 0, 30, 60].map(lat => {
      const y = gy - R * Math.sin((lat * Math.PI) / 180), rx = R * Math.cos((lat * Math.PI) / 180);
      return mk('ellipse', { class: 'g', cx: gx, cy: y, rx, ry: rx * 0.16 }, s);
    });
    const N = 7;
    const meridians = Array.from({ length: N }, () => mk('ellipse', { class: 'g', cx: gx, cy: gy, rx: R, ry: R }, s));
    const setMer = (t: number) => meridians.forEach((m, i) => m.setAttribute('rx', (R * Math.abs(Math.sin((i / N) * Math.PI + t))).toFixed(2)));
    setMer(0.35);
    const leaders: SVGPathElement[] = [], texts: SVGGElement[] = [], pts: SVGCircleElement[] = [];
    LABELS.forEach(l => {
      leaders.push(mk('path', { class: 'leader', d: `M${l.p[0]} ${l.p[1]} L${l.e[0]} ${l.e[1]} L${l.end[0]} ${l.end[1]}` }, s));
      pts.push(mk('circle', { class: 'pt-ring', cx: l.p[0], cy: l.p[1], r: 9, ...fb }, s));
      pts.push(mk('circle', { class: 'pt', cx: l.p[0], cy: l.p[1], r: 4, ...fb }, s));
      const g = mk('g', {}, s);
      mk('text', { class: 'lbl', x: l.end[0], y: l.end[1] - 12, 'text-anchor': l.anchor }, g).textContent = l.t;
      l.d.forEach((line, k) => { mk('text', { class: 'lbl-sub', x: l.end[0], y: l.end[1] + 22 + k * 18, 'text-anchor': l.anchor }, g).textContent = line; });
      texts.push(g);
    });
    if (ctx.reduce) return;

    const draws = svg.createDrawable([outline, ...parallels, ...meridians]);
    const leaderDraws = svg.createDrawable(leaders);
    const spin = { t: 0.35 };
    const spinAnim = ctx.animate(spin, { t: 0.35 + Math.PI, duration: 70000, loop: true, ease: 'linear', autoplay: false, onUpdate: () => setMer(spin.t) });
    const ringPulse = ctx.animate(pts.filter((_, i) => i % 2 === 0), { scale: [1, 2.6], opacity: [0.9, 0], duration: 2200, delay: stagger(500), loop: true, ease: 'outQuad', autoplay: false });
    ctx.set(draws, { draw: '0 0' }); ctx.set(leaderDraws, { draw: '0 0' });
    ctx.set(texts, { opacity: 0 }); ctx.set(pts, { scale: 0 });

    ctx.onEnter(s, () => {
      ctx.timeline()
        .add(draws, { draw: ['0 0', '0 1'], duration: 1600, delay: stagger(70), ease: 'inOutQuad' }, 0)
        .add(pts, { scale: [0, 1], duration: 500, delay: stagger(120), ease: 'outBack' }, 900)
        .add(leaderDraws, { draw: ['0 0', '0 1'], duration: 900, delay: stagger(180), ease: 'inOutQuad' }, 1100)
        .add(texts, { opacity: [0, 1], translateY: [8, 0], duration: 600, delay: stagger(180) }, 1500);
    }, 0.25);
    ctx.whenVisible(s, () => { spinAnim.play(); ringPulse.play(); }, () => { spinAnim.pause(); ringPulse.pause(); });
  });

  return (
    <section className="idea section-light" id="idea" data-theme="light" data-label="Global & local">
      <div className="wrap idea-grid">
        <div className="idea-copy">
          <p className="eyebrow reveal">Global technology. Local business.</p>
          <SplitHeading className="display" lines={[{ text: 'Mobility is global.', tone: 'muted' }, { text: 'Winning is local.' }]} />
          <div className="idea-support">
            <p className="statement reveal-stagger"><span>Your brand.</span> <span>Your market.</span> <span>Our engine.</span></p>
            <p className="lede reveal">
              AGEX provides the technology to launch and operate mobility businesses under your own brand. You focus on your market and customers. We power the rest.
            </p>
          </div>
        </div>
        <div className="idea-visual">
          <svg ref={globeRef} className="globe" viewBox="0 0 700 600" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
