'use client';

import { useRef } from 'react';
import { stagger, svg as asvg } from 'animejs';
import Icon from '@/components/Icon';
import SplitHeading from '@/components/SplitHeading';
import { $$, mk, pinProgress, subscribeScroll, useAnime } from '@/lib/motion';

/* eslint-disable @typescript-eslint/no-explicit-any */
const SOLUTIONS = [
  { icon: 'car', t: 'Ride-hailing', d: 'On-demand rides and scheduled rides.' },
  { icon: 'box', t: 'Delivery', d: 'On-demand and scheduled delivery.' },
  { icon: 'truck', t: 'Fleet', d: 'Corporate, government and private fleets.' },
];
const LAYERS = [
  {
    key: 'apps', label: 'Applications', sub: 'Branded apps and operator tools.',
    items: [
      { icon: 'phone', t: 'Customer App', d: 'Book, pay and manage mobility services.' },
      { icon: 'phone', t: 'Driver App', d: 'Earn, navigate and manage trips.' },
      { icon: 'laptop', t: 'Operator Platform', d: 'Monitor, manage and grow your business.' },
    ],
  },
  {
    key: 'core', label: 'Mobility core', sub: 'Core systems to run your business.',
    items: [
      { icon: 'dispatch', t: 'Dispatch & Matching' }, { icon: 'coins', t: 'Pricing' }, { icon: 'card', t: 'Payments' },
      { icon: 'car', t: 'Fleet Management' }, { icon: 'shield', t: 'Identity & KYC' }, { icon: 'headset', t: 'Support & Safety' },
      { icon: 'bars', t: 'Insights & Reporting' },
    ],
  },
  {
    key: 'intel', label: 'Intelligence & infrastructure', sub: 'Automation, data and scalable infrastructure.',
    items: [{ icon: 'gear', t: 'Automation' }, { icon: 'link', t: 'Integrations' }, { icon: 'database', t: 'Data & Analytics' }, { icon: 'cloud', t: 'Cloud Infrastructure' }],
  },
] as const;

// Isometric "plate" pose the layers start from (the original exploded-stack look)
const ISO = { rotateX: 58, rotateZ: -38, scale: 0.62 };
// collapsed stack offsets (px) before the layers separate
const COLLAPSED = [128, 30, -78];

/** Layout box of `el` relative to `root`, ignoring CSS transforms (so wires match the final, flat state). */
function layoutBox(el: HTMLElement, root: HTMLElement) {
  let x = 0, y = 0, n: HTMLElement | null = el;
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return { l: x, t: y, w: el.offsetWidth, h: el.offsetHeight, r: x + el.offsetWidth, b: y + el.offsetHeight };
}

export default function Architecture() {
  const pinRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const wiresRef = useRef<SVGSVGElement>(null);

  useAnime(ctx => {
    const pin = pinRef.current, root = diagramRef.current, wires = wiresRef.current;
    if (!pin || !root || !wires) return;
    const desktop = window.innerWidth > 1080;
    const cards = $$('.arch-card', root);
    const rows = $$('.arch-row', root);
    const slabs = $$('.arch-slab', root);
    const labels = $$('.arch-label', root);
    const lightIcons = $$('.slab-apps .ai-ico, .slab-core .ai-ico', root);
    const darkIcons = $$('.slab-intel .ai-ico', root);
    let wirePaths: SVGPathElement[] = [], leaderPaths: SVGPathElement[] = [], pulseAnims: any[] = [];

    // ---- connectors & leader lines (measured from the untransformed layout)
    const buildWires = () => {
      pulseAnims.forEach(a => a.revert()); pulseAnims = [];
      wires.innerHTML = '';
      wirePaths = []; leaderPaths = [];
      if (!desktop) return;
      wires.setAttribute('viewBox', `0 0 ${root.offsetWidth} ${root.offsetHeight}`);
      const apps = layoutBox(slabs[0], root);
      const rr = 14;
      wirePaths = cards.map((c, i) => {
        const cr = layoutBox(c, root);
        const sx = cr.l + cr.w / 2, sy = cr.b;
        const ex = apps.l + apps.w / 2 + (i - 1) * apps.w * 0.17, ey = apps.t + 14;
        const my = sy + (apps.t - sy) * 0.5;
        const d = Math.abs(ex - sx) < 2
          ? `M${sx} ${sy} V${ey}`
          : `M${sx} ${sy} V${my - rr} Q${sx} ${my} ${sx + Math.sign(ex - sx) * rr} ${my} H${ex - Math.sign(ex - sx) * rr} Q${ex} ${my} ${ex} ${my + rr} V${ey}`;
        mk('circle', { class: 'aw-dot aw-end', cx: sx, cy: sy, r: 3.2 }, wires);
        mk('circle', { class: 'aw-dot aw-end', cx: ex, cy: apps.t - 2, r: 3.2 }, wires);
        return mk('path', { class: 'aw-wire', d }, wires);
      });
      leaderPaths = labels.map((l, i) => {
        const t = layoutBox(l.querySelector('b') as HTMLElement, root);
        const s = layoutBox(slabs[i], root);
        const x0 = t.r + 12, y0 = t.t + t.h / 2, x1 = s.l + 10, y1 = s.t + Math.min(s.h / 2, 46);
        mk('circle', { class: 'aw-dot aw-lead', cx: x0, cy: y0, r: 3 }, wires);
        return mk('path', { class: 'aw-leader', d: `M${x0} ${y0} H${x0 + 26} L${x1} ${y1}` }, wires);
      });
    };
    const startPulses = () => {
      if (pulseAnims.length || !wirePaths.length) return;
      wirePaths.forEach((p, i) => {
        for (let k = 0; k < 2; k++) {
          const c = mk('circle', { class: 'aw-pulse', r: 3.4 }, wires);
          pulseAnims.push(ctx.animate(c, { ...asvg.createMotionPath(p), opacity: [0, 1, 1, 0], duration: 2200, delay: i * 380 + k * 1100, loop: true, ease: 'inOutSine' }));
        }
      });
    };
    const stopPulses = () => { pulseAnims.forEach(a => a.revert()); pulseAnims = []; $$('.aw-pulse', wires).forEach(n => n.remove()); };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    ctx.onCleanup(() => { stopPulses(); wires.innerHTML = ''; });
    if (ctx.reduce) { fontsReady.then(buildWires); return; }

    // ---- idle motion once assembled: floating layers + gold highlight sweep
    const floats = slabs.map((sl, i) => ctx.animate(sl, { translateY: [0, -5 - (2 - i) * 1.5], duration: 2800, delay: i * 420, loop: true, alternate: true, ease: 'inOutSine', autoplay: false }));
    const sweep = ctx.timeline({ loop: true, autoplay: false })
      .add(lightIcons, { color: ['#0e0e0e', '#a87a2a', '#0e0e0e'], translateY: [0, -2, 0], duration: 1100, delay: stagger(150), ease: 'inOutSine' }, 0)
      .add(darkIcons, { color: ['#f5f4f1', '#f0c46e', '#f5f4f1'], translateY: [0, -2, 0], duration: 1100, delay: stagger(150), ease: 'inOutSine' }, lightIcons.length * 150)
      .add({ v: 0 }, { v: 1, duration: 1600 }, (lightIcons.length + darkIcons.length) * 150 + 1100);
    const idle = [...floats, sweep];
    let idling = false;
    const setIdle = (on: boolean) => {
      if (on === idling) return;
      idling = on;
      idle.forEach(a => (on ? a.play() : a.pause()));
      if (on) startPulses(); else stopPulses();
    };

    if (!desktop) {
      // small screens: simple staged reveal, no pin
      ctx.set([...cards, ...slabs, ...labels], { opacity: 0, translateY: 24 });
      ctx.onEnter(root, () => {
        ctx.animate([...cards, ...labels.flatMap((l, i) => [l, slabs[i]])], { opacity: [0, 1], translateY: [24, 0], duration: 800, delay: stagger(90), ease: 'outExpo', onComplete: () => setIdle(true) });
      }, 0.1);
      ctx.whenVisible(root, () => { if (idling) idle.forEach(a => a.play()); }, () => idle.forEach(a => a.pause()));
      return;
    }

    // ---- desktop: scroll-scrubbed assembly (isometric plates → separated → flat slabs → wires)
    let tl: any = null;
    const build = () => {
      tl?.revert(); tl = null;
      buildWires();
      const draw = asvg.createDrawable([...wirePaths, ...leaderPaths]);
      const wireDraw = draw.slice(0, wirePaths.length), leadDraw = draw.slice(wirePaths.length);
      const ends = $$('.aw-end', wires), leads = $$('.aw-lead', wires);
      ctx.set(slabs, { opacity: 0, ...ISO, scale: 0.5 });
      rows.forEach((r, i) => ctx.set(r, { translateY: COLLAPSED[i] }));
      ctx.set(cards, { opacity: 0, translateY: -28 });
      ctx.set(labels, { opacity: 0, translateX: -12 });
      ctx.set(draw, { draw: '0 0' });
      ctx.set([...ends, ...leads], { opacity: 0 });
      tl = ctx.timeline({ autoplay: false, defaults: { ease: 'linear' } })
        // plates appear, bottom layer first
        .add([...slabs].reverse(), { opacity: [0, 1], scale: [0.5, ISO.scale], duration: 200, delay: stagger(60), ease: 'outQuad' }, 0)
        // layers separate
        .add(rows[0], { translateY: [COLLAPSED[0], 0], duration: 300, ease: 'inOutQuad' }, 220)
        .add(rows[1], { translateY: [COLLAPSED[1], 0], duration: 300, ease: 'inOutQuad' }, 220)
        .add(rows[2], { translateY: [COLLAPSED[2], 0], duration: 300, ease: 'inOutQuad' }, 220)
        // plates turn flat into slabs
        .add(slabs, { rotateX: [ISO.rotateX, 0], rotateZ: [ISO.rotateZ, 0], scale: [ISO.scale, 1], duration: 300, delay: stagger(40, { from: 'last' }), ease: 'inOutQuad' }, 470)
        // labels + leader lines
        .add(labels, { opacity: [0, 1], translateX: [-12, 0], duration: 140, delay: stagger(30) }, 740)
        .add(leads, { opacity: [0, 1], duration: 60 }, 750)
        .add(leadDraw, { draw: ['0 0', '0 1'], duration: 150, delay: stagger(30) }, 760)
        // solution cards drop in, connectors draw down into the apps layer
        .add(cards, { opacity: [0, 1], translateY: [-28, 0], duration: 160, delay: stagger(40), ease: 'outQuad' }, 800)
        .add(ends, { opacity: [0, 1], duration: 60 }, 880)
        .add(wireDraw, { draw: ['0 0', '0 1'], duration: 140, delay: stagger(30) }, 890)
        .add({ v: 0 }, { v: 1, duration: 90 }, 1010);
      tl.seek(pinProgress(pin) * tl.duration);
    };
    fontsReady.then(() => {
      build();
      ctx.onCleanup(subscribeScroll(() => {
        if (!tl) return;
        const p = pinProgress(pin);
        tl.seek(p * tl.duration);
        setIdle(p > 0.97 && pin.getBoundingClientRect().bottom > 0);
      }));
    });
    let t: any = 0;
    const onResize = () => { clearTimeout(t); t = setTimeout(() => { setIdle(false); build(); }, 150); };
    window.addEventListener('resize', onResize);
    ctx.onCleanup(() => { window.removeEventListener('resize', onResize); clearTimeout(t); });
  });

  return (
    <section className="arch section-light" id="engine" data-theme="light" data-label="Architecture">
      <div ref={pinRef} className="arch-pin">
        <div className="arch-sticky">
          <div className="wrap arch-grid">
            <div className="arch-copy">
              <p className="eyebrow reveal">The AGEX engine</p>
              <SplitHeading className="display" lines={[{ text: 'One engine.' }, { text: 'End to end.' }]} />
              <p className="lede reveal">Everything you need to launch, operate and scale your mobility business. One integrated technology platform.</p>
            </div>

            <div ref={diagramRef} className="arch-diagram" role="img" aria-label="The AGEX engine: ride-hailing, delivery and fleet businesses run on branded applications, a shared mobility core, and an intelligence and infrastructure layer.">
              <svg ref={wiresRef} className="arch-wires" aria-hidden="true" />
              <div className="arch-cards">
                {SOLUTIONS.map(s => (
                  <div key={s.t} className="arch-card">
                    <span className="arch-card-ico"><Icon name={s.icon} size={24} /></span>
                    <span><b>{s.t}</b><span>{s.d}</span></span>
                  </div>
                ))}
              </div>
              <div className="arch-rows">
                {LAYERS.map(l => (
                  <div key={l.key} className={`arch-row row-${l.key}`}>
                    <div className="arch-label"><b>{l.label}</b><span>{l.sub}</span></div>
                    <div className={`arch-slab slab-${l.key}`}>
                      {l.items.map(it => (
                        <div key={it.t} className="arch-item">
                          <span className="ai-ico"><Icon name={it.icon} size={l.key === 'apps' ? 30 : 26} /></span>
                          {'d' in it ? <span className="ai-txt"><b>{it.t}</b><span>{it.d}</span></span> : <span className="ai-name">{it.t}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
