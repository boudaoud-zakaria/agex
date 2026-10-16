'use client';

import { useRef } from 'react';
import { stagger, svg } from 'animejs';
import SplitHeading from '@/components/SplitHeading';
import { mk, useAnime } from '@/lib/motion';

const TRADITIONAL = [
  ['Longer time', 'Months to years before launch.'],
  ['Higher capital', 'Large upfront and ongoing investment.'],
  ['Higher risk', 'Technology reliability, integration and execution risks.'],
  ['Operational complexity', 'Continuous maintenance, upgrades and learning.'],
];
const ADVANTAGE = [
  ['Proven engine', 'Proven technology, continuously maintained and upgraded.'],
  ['Faster to market', 'Accelerated deployment with a ready-to-use engine.'],
  ['Capital efficient', 'Invest in market and brand, not in re-inventing the engine.'],
  ['Flexible by design', 'Your brand. Ride-hailing, fleet or delivery. Multiple markets.'],
];
const SIGNALS = ['Technology ownership', 'Multi-tenant architecture', 'Reusable core', 'Real deployments', 'Operator-first'];

export default function Company() {
  const treeRef = useRef<SVGSVGElement>(null);

  useAnime(ctx => {
    const s = treeRef.current;
    if (!s) return;
    const title = s.querySelector('title');
    s.innerHTML = '';
    if (title) s.appendChild(title);
    ctx.onCleanup(() => { s.innerHTML = ''; if (title) s.appendChild(title); });

    const lines: SVGPathElement[] = [], boxes: SVGGElement[] = [];
    type Opts = { ink?: boolean; big?: boolean; dashed?: boolean };
    const box = (x: number, y: number, w: number, h: number, title: string, sub: string, o: Opts = {}) => {
      const g = mk('g', { style: 'transform-box:fill-box;transform-origin:center' }, s);
      mk('rect', { class: o.ink ? 'box-ink' : 'box', x, y, width: w, height: h, rx: 8, ...(o.dashed ? { 'stroke-dasharray': '4 5' } : {}) }, g);
      if (title) mk('text', { class: `t ${o.ink ? 't-inv' : ''} ${o.big ? 't-big' : ''}`, x: x + 14, y: y + (sub ? 24 : h / 2 + 4) }, g).textContent = title;
      if (sub) mk('text', { class: `t ${o.ink ? 't-inv' : 't-f'}`, x: x + 14, y: y + h - 16, opacity: o.ink ? 0.6 : 1 }, g).textContent = sub;
      boxes.push(g);
      return g;
    };
    const line = (d: string) => { lines.push(mk('path', { class: 'br', d }, s)); };
    line('M320 86 V128 M320 128 H150 V168 M320 128 H490 V168');
    line('M150 238 V298');
    line('M400 238 V472 M400 328 H420 M400 400 H420 M400 472 H420');
    const eng = box(210, 22, 220, 64, '', '', { ink: true });
    mk('use', { href: '#agex-logo', width: 1841, height: 254, fill: '#f2f0eb', transform: `translate(232 46) scale(${96 / 1841})` }, eng);
    mk('text', { class: 't t-inv', x: 408, y: 59, 'text-anchor': 'end', opacity: 0.7 }, eng).textContent = 'Engine';
    box(40, 168, 220, 70, 'Owned operations', 'AGEX-controlled brands');
    box(380, 168, 220, 70, 'Engine-as-a-service', 'Independent operators');
    box(60, 298, 180, 60, 'YAY', 'UAE · Live', { big: true });
    box(420, 300, 180, 56, 'WahGo', 'Algeria · Live', { big: true });
    box(420, 372, 180, 56, 'Your brand', 'Your market', { big: true, dashed: true });
    box(420, 444, 180, 56, 'Future operators', 'Africa · GCC · Europe', { dashed: true });
    const cap = mk('g', {}, s);
    mk('text', { class: 't t-big', x: 60, y: 404 }, cap).textContent = 'We prove it in our markets.';
    mk('text', { class: 't t-big', x: 60, y: 428 }, cap).textContent = 'We scale it through operators.';
    if (ctx.reduce) return;

    const draws = svg.createDrawable(lines);
    ctx.set(draws, { draw: '0 0' }); ctx.set(boxes, { opacity: 0 }); ctx.set(cap, { opacity: 0 });
    ctx.onEnter(s, () => {
      ctx.timeline()
        .add(boxes[0], { opacity: [0, 1], scale: [0.85, 1], duration: 600, ease: 'outBack' }, 0)
        .add(draws, { draw: ['0 0', '0 1'], duration: 900, delay: stagger(250), ease: 'inOutQuad' }, 300)
        .add(boxes.slice(1, 3), { opacity: [0, 1], translateY: [10, 0], duration: 500, delay: stagger(120), ease: 'outExpo' }, 700)
        .add(boxes.slice(3), { opacity: [0, 1], translateY: [10, 0], duration: 500, delay: stagger(110), ease: 'outExpo' }, 1200)
        .add(cap, { opacity: [0, 1], duration: 600 }, 1600);
    }, 0.25);
  });

  return (
    <section className="company section-light" id="about" data-theme="light" data-label="About">
      <div className="wrap">
        <div className="company-grid">
          <div className="company-copy">
            <p className="eyebrow label reveal">Company</p>
            <SplitHeading className="display" text="Global technology. Local mobility leaders." />
            <p className="lede reveal">
              AGEX TECH develops reusable mobility technology for independent operators and selected AGEX-powered brands. Our model is designed to scale across markets without rebuilding the engine for each launch.
            </p>
          </div>
          <div className="tree-wrap">
            <svg ref={treeRef} className="tree" viewBox="0 0 640 520" role="img" aria-labelledby="tree-title">
              <title id="tree-title">One AGEX engine powering two paths to scale: owned operations, and engine-as-a-service for independent operators.</title>
            </svg>
          </div>
        </div>

        <div className="compare">
          <div className="compare-col">
            <p className="label compare-h">The traditional path</p>
            <p className="compare-sub">Build a mobility business from scratch.</p>
            <ul>{TRADITIONAL.map(([b, t]) => <li key={b}><b>{b}</b>{t}</li>)}</ul>
          </div>
          <div className="compare-col is-agex">
            <p className="label compare-h">The AGEX advantage</p>
            <p className="compare-sub">Plug in, launch and scale with confidence.</p>
            <ul>{ADVANTAGE.map(([b, t]) => <li key={b}><b>{b}</b>{t}</li>)}</ul>
          </div>
        </div>
        <p className="compare-tag reveal">You build the market. The AGEX engine powers everything underneath.</p>

        <ul className="signals label reveal-stagger" aria-label="What AGEX owns">
          {SIGNALS.map(s => <li key={s}>{s}</li>)}
        </ul>
      </div>
    </section>
  );
}
