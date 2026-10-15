'use client';

import { useRef } from 'react';
import { createDraggable, spring } from 'animejs';
import SplitHeading from '@/components/SplitHeading';
import { useAnime } from '@/lib/motion';

const PHASES = [
  { n: '01 · 2023–2025', t: 'Prove the engine', d: 'YAY deployed in the UAE. Technology validated in live operations.', s: 'Completed', cls: 's-done' },
  { n: '02 · 2026–2027', t: 'Engine-as-a-service', d: 'Productizing the platform and onboarding mobility operators.', s: 'In progress', cls: 's-prog' },
  { n: '03 · 2027 onwards', t: 'Scale globally', d: 'Expanding across Africa, the GCC and Europe through local operators.', s: 'Expansion underway', cls: '' },
  { n: '04 · 2026–2030', t: 'Agentic AI for mobility', d: 'Native agentic execution toward autonomous mobility operations.', s: 'Development underway', cls: '' },
];

export default function NextLayer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useAnime(ctx => {
    const wrap = wrapRef.current, host = fieldRef.current, orb = orbRef.current;
    if (!wrap || !host || !orb) return;
    let dots: HTMLElement[] = [], pos: Array<[number, number]> = [];
    const build = () => {
      const b = wrap.getBoundingClientRect();
      const gap = b.width < 520 ? 22 : 30;
      const cols = Math.max(8, Math.floor(b.width / gap)), rows = Math.max(6, Math.floor(b.height / gap));
      host.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      host.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      host.innerHTML = '';
      dots = []; pos = [];
      for (let i = 0; i < cols * rows; i++) { const d = document.createElement('i'); host.appendChild(d); dots.push(d); }
      const cw = b.width / cols, chh = b.height / rows;
      for (let i = 0; i < dots.length; i++) pos.push([((i % cols) + 0.5) * cw, (Math.floor(i / cols) + 0.5) * chh]);
    };
    build();
    ctx.onCleanup(() => { host.innerHTML = ''; });

    const t0 = performance.now();
    let raf = 0, running = false;
    const frame = (now: number) => {
      const wb = wrap.getBoundingClientRect(), ob = orb.getBoundingClientRect();
      const ox = ob.left + ob.width / 2 - wb.left, oy = ob.top + ob.height / 2 - wb.top;
      const ring = (((now - t0) / 1000) * 160) % 520;
      for (let i = 0; i < dots.length; i++) {
        const dx = pos[i][0] - ox, dy = pos[i][1] - oy, d = Math.sqrt(dx * dx + dy * dy);
        const near = Math.exp(-(d * d) / (2 * 80 * 80));
        const r = ctx.reduce ? 0 : Math.max(0, 1 - Math.abs(d - ring) / 34) * (1 - ring / 520);
        dots[i].style.transform = `scale(${(1 + near * 1.6 + r * 1.1).toFixed(3)})`;
        dots[i].style.opacity = (0.18 + near * 0.7 + r * 0.5).toFixed(3);
      }
      if (running) raf = requestAnimationFrame(frame);
    };
    const play = () => { if (ctx.reduce) { frame(performance.now()); return; } if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const pause = () => { running = false; cancelAnimationFrame(raf); };
    ctx.onCleanup(pause);

    if (!ctx.reduce) {
      const drag = createDraggable(orb, { container: wrap, releaseEase: spring({ stiffness: 90, damping: 9 }) });
      ctx.onCleanup(() => drag.revert());
    }
    const onResize = () => { build(); if (!running) frame(performance.now()); };
    window.addEventListener('resize', onResize);
    ctx.onCleanup(() => window.removeEventListener('resize', onResize));
    ctx.whenVisible(wrap, play, pause);
  });

  return (
    <section className="next section-dark deep" id="next" data-theme="dark" data-label="07 / Next layer">
      <div className="wrap next-grid">
        <div className="next-copy">
          <p className="eyebrow mono reveal">07 <span className="sep">/</span> The next layer <span className="tag tag-outline-dark">Roadmap</span></p>
          <SplitHeading className="display" text="Intelligence built into mobility." />
          <p className="lede reveal">We are advancing toward agentic operations across support, coordination and optimization.</p>
          <ul className="arrow-list mono reveal-stagger"><li>Support</li><li>Coordination</li><li>Optimization</li></ul>
          <p className="footnote mono reveal">Roadmap capability. Not live commercial functionality.</p>
        </div>
        <div ref={wrapRef} className="field-wrap">
          <div ref={fieldRef} className="field" aria-hidden="true" />
          <div ref={orbRef} className="orb" aria-hidden="true"><span /></div>
          <p className="field-hint mono" aria-hidden="true">Drag the agent ↗</p>
        </div>
      </div>
      <div className="wrap">
        <ol className="phases">
          {PHASES.map(p => (
            <li key={p.t} className="phase reveal-card">
              <span className="mono phase-n">{p.n}</span>
              <h3>{p.t}</h3>
              <p>{p.d}</p>
              <span className={`status mono ${p.cls}`}>{p.s}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
