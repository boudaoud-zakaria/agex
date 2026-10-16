'use client';

import { useId, useRef } from 'react';
import { stagger, svg as asvg } from 'animejs';
import { $$, mk, useAnime } from '@/lib/motion';

type Variant = 'band' | 'corner' | 'wide' | 'highway';

// Lane geometry per variant (viewBox 800×400)
const LANES: Record<Variant, (i: number) => string> = {
  band: i => `M${140 + i * 26} 420 C ${360 + i * 10} ${250 - i * 6}, ${520 + i * 6} ${110 + i * 8}, 860 ${70 + i * 18}`,
  corner: i => `M-40 ${330 - i * 16} C 160 ${300 - i * 12}, 380 ${300 + i * 10}, ${560 + i * 22} 430`,
  wide: i => `M-40 ${360 - i * 10} C 220 ${330 - i * 14}, 520 ${150 + i * 10}, 860 ${110 + i * 16}`,
  highway: i => `M-60 ${420 - i * 9} C 160 ${360 - i * 10}, 420 ${250 - i * 6}, 860 ${150 + i * 7}`,
};

/** Curved lanes with travelling lights — the monochrome take on the reference's light-streak roads. */
export default function LightRoads({ variant = 'band', lanes = 6, className = '' }: { variant?: Variant; lanes?: number; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const fid = `lr-glow-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  useAnime(ctx => {
    const s = ref.current;
    if (!s) return;
    const base = $$<SVGPathElement>('.lr-base', s), lights = $$('.lr-light', s);
    // reflector dots along the outer lanes
    const dotG = s.querySelector('.lr-dots')!;
    [base[0], base[base.length - 1]].forEach(path => {
      const L = path.getTotalLength();
      for (let k = 1; k < 10; k++) {
        const pt = path.getPointAtLength((k / 10) * L);
        mk('circle', { class: 'lr-dot', r: 1.6, cx: pt.x.toFixed(1), cy: pt.y.toFixed(1) }, dotG);
      }
    });
    ctx.onCleanup(() => { dotG.innerHTML = ''; });
    const dots = $$('.lr-dot', s);
    if (ctx.reduce) return;
    const draw = asvg.createDrawable(base);
    ctx.set(draw, { draw: '0 0' }); ctx.set(lights, { opacity: 0 });
    const loops = lights.map((l, i) =>
      ctx.animate(l, { strokeDashoffset: [1000, 0], duration: 5200 + (i % 3) * 1700, ease: 'linear', loop: true, autoplay: false }));
    const twinkle = ctx.animate(dots, { opacity: [0.15, 0.8, 0.15], duration: 2400, delay: stagger(180), loop: true, ease: 'inOutSine', autoplay: false });
    ctx.onEnter(s, () => {
      ctx.animate(draw, { draw: ['0 0', '0 1'], duration: 1800, delay: stagger(90), ease: 'inOutQuad' });
      ctx.animate(lights, { opacity: [0, 1], duration: 800, delay: stagger(90, { start: 800 }) });
    }, 0.1);
    ctx.whenVisible(s, () => { loops.forEach(a => a.play()); twinkle.play(); }, () => { loops.forEach(a => a.pause()); twinkle.pause(); });
  });

  const d = Array.from({ length: lanes }, (_, i) => LANES[variant](i));
  return (
    <svg ref={ref} className={`lr lr-${variant} ${className}`} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {d.map((p, i) => <path key={`b${i}`} className="lr-base" d={p} pathLength={1000} />)}
      {variant === 'highway' && <path className="lr-edge" d={d[0]} />}
      {variant === 'highway' && <path className="lr-center" d={d[Math.floor(lanes / 2)]} />}
      <g filter={`url(#${fid})`}>
        {d.map((p, i) => (
          <path key={`l${i}`} className="lr-light" d={p} pathLength={1000}
            strokeDasharray={i % 2 ? '60 940' : '24 300'} strokeDashoffset={1000} />
        ))}
      </g>
      <g className="lr-dots" />
    </svg>
  );
}

