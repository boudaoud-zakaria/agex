'use client';

import { useRef } from 'react';
import { stagger } from 'animejs';
import { $$, useAnime } from '@/lib/motion';

export default function MiniDial() {
  const ref = useRef<SVGSVGElement>(null);

  useAnime(ctx => {
    const s = ref.current;
    if (!s) return;
    const intro = $$('.contact-intro > *');
    if (!ctx.reduce) {
      ctx.animate(intro, { opacity: [0, 1], translateY: [20, 0], duration: 900, delay: stagger(80), ease: 'outExpo' });
      ctx.animate('.form-wrap', { opacity: [0, 1], translateY: [30, 0], duration: 1000, delay: 250, ease: 'outExpo' });
      ctx.animate($$('line', s), { opacity: [0.2, 0.9, 0.2], duration: 1200, delay: stagger(18), loop: true, ease: 'inOutSine' });
      ctx.animate($$('circle', s), { scale: [1, 1.6, 1], duration: 1600, loop: true, ease: 'inOutSine' });
    }
  });

  return (
    <div className="contact-dial" aria-hidden="true">
      <svg ref={ref} viewBox="0 0 200 200">
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i / 72) * Math.PI * 2, r0 = i % 6 === 0 ? 84 : 88;
          return (
            <line key={i} x1={100 + Math.cos(a) * r0} y1={100 + Math.sin(a) * r0} x2={100 + Math.cos(a) * 94} y2={100 + Math.sin(a) * 94} stroke="#f5f4f1" opacity={0.25} />
          );
        })}
        <circle cx="100" cy="100" r="6" fill="#fff" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      </svg>
    </div>
  );
}
