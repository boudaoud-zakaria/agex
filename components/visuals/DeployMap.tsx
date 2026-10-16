'use client';

import { useRef } from 'react';
import { stagger } from 'animejs';
import { MAP } from '@/lib/map-data';
import { MARKERS } from '@/lib/markets';
import { $$, clamp01, useAnime } from '@/lib/motion';

/** Dot-matrix deployments map (canvas) with market markers and legend. */
export default function DeployMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnime(ctx => {
    const host = mapRef.current, cv = canvasRef.current;
    const g = cv?.getContext('2d');
    if (!host || !cv || !g) return;
    const origin = MAP.markers.uae;
    const dots: Array<{ c: number; r: number; t: number; d: number }> = [];
    for (let i = 0; i < MAP.dots.length; i += 3) {
      const c = MAP.dots[i], r = MAP.dots[i + 1], t = MAP.dots[i + 2];
      dots.push({ c, r, t, d: Math.hypot(c - origin[0], (r - origin[1]) * 1.1) });
    }
    const maxD = Math.max(...dots.map(d => d.d));
    const markerEls = $$('.mk', host);
    let W = 0, H = 0;
    const size = () => {
      const b = host.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      W = b.width; H = b.height; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const state = { reveal: ctx.reduce ? 1 : 0, wave: 0 };
    const draw = () => {
      if (!W) size();
      g.clearRect(0, 0, W, H);
      const cw = W / MAP.cols, ch = H / MAP.rows, base = Math.min(cw, ch);
      const waveR = state.wave * maxD * 1.25;
      for (const p of dots) {
        const k = clamp01((state.reveal * 1.25 - p.d / maxD) * 5);
        if (k <= 0) continue;
        const w = ctx.reduce ? 0 : Math.max(0, 1 - Math.abs(p.d - waveR) / 3.2);
        const a = (p.t === 2 ? 0.62 : 0.17) * k + w * (p.t === 2 ? 0.35 : 0.22);
        const rad = base * (p.t === 2 ? 0.34 : 0.26) * (0.4 + 0.6 * k) * (1 + w * 0.35);
        g.fillStyle = `rgba(245,244,241,${a.toFixed(3)})`;
        g.beginPath(); g.arc((p.c + 0.5) * cw, (p.r + 0.5) * ch, rad, 0, Math.PI * 2); g.fill();
        if (w > 0.05) { // gold light as the wave passes
          g.fillStyle = `rgba(240,196,110,${(w * (p.t === 2 ? 0.75 : 0.45)).toFixed(3)})`;
          g.beginPath(); g.arc((p.c + 0.5) * cw, (p.r + 0.5) * ch, rad, 0, Math.PI * 2); g.fill();
        }
      }
    };
    const onResize = () => { size(); draw(); };
    window.addEventListener('resize', onResize);
    ctx.onCleanup(() => window.removeEventListener('resize', onResize));

    if (ctx.reduce) { size(); draw(); return; }
    ctx.set(markerEls, { opacity: 0 });
    let wave: any = null, pulses: any = null, revealed = false;
    ctx.whenVisible(host, () => {
      if (!revealed) {
        revealed = true; size();
        ctx.animate(state, { reveal: [0, 1], duration: 2200, ease: 'outQuad', onUpdate: draw });
        ctx.animate(markerEls, { opacity: [0, 1], scale: [0.6, 1], duration: 600, delay: stagger(140, { start: 900 }), ease: 'outBack' });
        pulses = ctx.animate($$('.pulse', host), { scale: [1, 3.6], opacity: [0.9, 0], duration: 2000, loop: true, delay: stagger(600), ease: 'outQuad' });
        wave = ctx.animate(state, { wave: [0, 1], duration: 5200, loop: true, ease: 'linear', delay: 2200, onUpdate: draw });
      } else { wave?.play(); pulses?.play(); }
    }, () => { wave?.pause(); pulses?.pause(); }, '0px');
  });

  return (
  <div className="map-block">
    <div ref={mapRef} className="map">
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="map-markers">
        {MARKERS.map(m => {
          const [c, r] = MAP.markers[m.k];
          return (
            <div key={m.k} className={`mk ${m.cls} ${m.dir}`} style={{ left: `${((c + 0.5) / MAP.cols) * 100}%`, top: `${((r + 0.5) / MAP.rows) * 100}%` }}>
              {m.cls === 'live' && <span className="pulse" />}
              <span className="core" />
              <span className="lab">{m.name}<small>{m.sub}</small></span>
            </div>
          );
        })}
      </div>
    </div>
    <ul className="legend label" aria-label="Map legend">
      <li><span className="lg lg-live" />Live</li>
      <li><span className="lg lg-dev" />Developing</li>
      <li><span className="lg lg-plan" />In discussion</li>
    </ul>
  </div>
  );
}
