'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { stagger, svg } from 'animejs';
import SplitHeading from '@/components/SplitHeading';
import { $, $$, buildDial, C, fb, gp, LOGO_PATHS, mk, roundedPath, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Hero() {
  const dialRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useAnime(ctx => {
    const host = dialRef.current, section = sectionRef.current;
    if (!host || !section) return;
    const dial = buildDial(host, ctx);
    const st = dial.stage;

    // Route → network → AGEX mark, ~7.3s loop
    const routePts = ([[3, 9], [3, 7], [5, 7], [5, 5], [8, 5], [8, 3], [10, 3]] as const).map(p => gp(p[0], p[1]));
    const nets = [
      [[1, 6], [4, 6], [4, 2]], [[6, 11], [6, 8], [10, 8]], [[2, 4], [7, 4], [7, 1]],
      [[9, 10], [9, 7], [11, 7]], [[4, 10], [4, 8], [1, 8]],
    ];
    const netG = mk('g', {}, st);
    const netPaths = nets.map(n => mk('path', { class: 'route-bg', d: roundedPath(n.map(p => gp(p[0], p[1])), 10), style: 'opacity:.5' }, netG));
    const netNodes = nets.flatMap(n => [n[0], n[n.length - 1]]).map(p => { const [x, y] = gp(p[0], p[1]); return mk('circle', { class: 'node', cx: x, cy: y, r: 3.2, opacity: 0 }, netG); });
    const route = mk('path', { class: 'route', d: roundedPath(routePts, 12) }, st);
    const s0 = routePts[0], s1 = routePts[routePts.length - 1];
    const startRing = mk('circle', { class: 'pin-ring', cx: s0[0], cy: s0[1], r: 7, ...fb }, st);
    const endRing = mk('circle', { class: 'pin-ring', cx: s1[0], cy: s1[1], r: 7, ...fb }, st);
    const startNode = mk('circle', { class: 'node', cx: s0[0], cy: s0[1], r: 6, ...fb }, st);
    const endNode = mk('circle', { class: 'veh', cx: s1[0], cy: s1[1], r: 6, ...fb }, st);
    const veh = mk('g', {}, st);
    mk('circle', { r: 13, fill: '#fff', opacity: 0.12 }, veh);
    mk('rect', { class: 'veh', x: -9, y: -4.5, width: 18, height: 9, rx: 3.5 }, veh);
    const mark = mk('g', { transform: `translate(${C - (1841 * 0.17) / 2} ${C - (254 * 0.17) / 2}) scale(.17)` }, st);
    const markFill = mk('g', { fill: '#fff' }, mark);
    const markStroke = mk('g', {}, mark);
    LOGO_PATHS.forEach(d => { mk('path', { d }, markFill); mk('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': 7 }, markStroke); });

    const dotDelay = (t: any) => Math.hypot(+t.getAttribute('cx') - s0[0], +t.getAttribute('cy') - s0[1]) * 2.4;
    const routeDraw = svg.createDrawable(route);
    const netDraw = svg.createDrawable(netPaths);
    const markDraw = svg.createDrawable($$('path', markStroke));
    const motion = svg.createMotionPath(route);

    const loop = ctx.timeline({ autoplay: false, loop: true, defaults: { ease: 'outQuad' } })
      .add(dial.dots, { opacity: [0.28, 0.95, 0.28], scale: [1, 2, 1], duration: 900, delay: dotDelay }, 0)
      .add(startNode, { scale: [0, 1], duration: 500, ease: 'outBack' }, 120)
      .add(startRing, { scale: [1, 3.6], opacity: [0.9, 0], duration: 1100 }, 200)
      .add(veh, { opacity: [0, 1], duration: 250 }, 450)
      .add(routeDraw, { draw: ['0 0', '0 1'], duration: 2200, ease: 'inOutSine' }, 500)
      .add(veh, { ...motion, duration: 2200, ease: 'inOutSine' }, 500)
      .add(endNode, { scale: [0, 1], duration: 500, ease: 'outBack' }, 2550)
      .add(endRing, { scale: [1, 3.6], opacity: [0.9, 0], duration: 1100 }, 2600)
      .add(netDraw, { draw: ['0 0', '0 1'], duration: 800, delay: stagger(110), ease: 'inOutQuad' }, 2750)
      .add(netNodes, { opacity: [0, 1], duration: 300, delay: stagger(60) }, 3000)
      .add([route, veh, startNode, endNode, netG], { opacity: 0, duration: 500, ease: 'inQuad' }, 3800)
      .add(dial.dots, { opacity: 0.1, duration: 500 }, 3800)
      .add(markDraw, { draw: ['0 0', '0 1'], duration: 1100, delay: stagger(90), ease: 'inOutQuad' }, 4000)
      .add(markFill, { opacity: [0, 1], duration: 600 }, 4900)
      .add(markStroke, { opacity: [1, 0], duration: 500 }, 5300)
      .add(mark, { opacity: [1, 0], duration: 600, ease: 'inQuad' }, 6700)
      .add(dial.dots, { opacity: 0.28, duration: 600 }, 6700)
      .add({ v: 0 }, { v: 1, duration: 300 }, 7300);
    ctx.set(markFill, { opacity: 0 });

    // Intro
    const header = $('.site-header');
    const introEls = $$('[data-intro]', section);
    const tickG = dial.ticks[0].parentNode as Element, dotG = dial.dots[0].parentNode as Element;
    const arcDraw = svg.createDrawable($$('.arc', dial.arcs));
    const words = $$('[data-split] .w > span', section);

    const startLoops = () => {
      loop.play();
      dial.idle.forEach(a => a.play());
      ctx.whenVisible(section,
        () => { loop.play(); dial.idle.forEach(a => a.play()); },
        () => { loop.pause(); dial.idle.forEach(a => a.pause()); }, '0px');
    };

    if (ctx.reduce) { loop.seek(5600); return; }
    ctx.set([tickG, dotG], { opacity: 0 });
    ctx.set(arcDraw, { draw: '0 0' });
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      ctx.timeline({ defaults: { ease: 'outExpo' } })
        .add(header, { opacity: [0, 1], translateY: [-20, 0], duration: 900 }, 0)
        .add(words, { translateY: ['108%', '0%'], duration: 1200, delay: stagger(70) }, 150)
        .add(introEls, { opacity: [0, 1], translateY: [18, 0], duration: 1000, delay: stagger(90) }, 450)
        .add(tickG, { opacity: [0, 1], duration: 900, ease: 'outQuad' }, 200)
        .add(arcDraw, { draw: ['0 0', '0 1'], duration: 1400, delay: stagger(80), ease: 'inOutQuart' }, 300)
        .add(dotG, { opacity: [0, 1], duration: 900, ease: 'outQuad' }, 500)
        .call(startLoops, 1300);
    };
    if (document.fonts?.ready) document.fonts.ready.then(run); else run();
    return () => {
      cancelled = true;
      // leave the header visible if we unmount mid-intro
      if (header) { header.style.opacity = ''; header.style.transform = ''; }
    };
  });

  return (
    <section ref={sectionRef} className="hero section-dark" id="top" data-theme="dark" data-label="01 / Hero">
      <div className="hero-grid wrap">
        <div className="hero-copy">
          <p className="eyebrow mono" data-intro>AGEX TECH <span className="sep">/</span> Intelligent mobility engine</p>
          <SplitHeading as="h1" className="hero-title" text="The engine behind modern mobility." />
          <p className="hero-support" data-intro>
            Launch and operate mobility businesses under your own brand. One technology foundation for ride-hailing, delivery and fleets.
          </p>
          <div className="hero-actions" data-intro>
            <Link className="btn btn-solid" href="/contact">Start your mobility business <span aria-hidden="true">→</span></Link>
            <a className="btn btn-ghost mono" href="#engine">Explore the engine <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-visual">
          <div
            ref={dialRef}
            className="dial"
            role="img"
            aria-label="Animated diagram: a route draws across a city grid, a vehicle travels it, the network lights up and resolves into the AGEX mark."
          />
        </div>
      </div>
      <div className="hero-foot wrap">
        <ul className="hero-tags mono" data-intro>
          <li>Ride-hailing</li><li>Delivery</li><li>Fleet</li>
        </ul>
        <p className="hero-scroll mono" data-intro><span className="scroll-line" aria-hidden="true" />Scroll</p>
      </div>
    </section>
  );
}
