'use client';

import { stagger, svg } from 'animejs';
import { $$, useAnime } from '@/lib/motion';

/** Scroll reveals shared by all home sections: word rises, fades, card groups, icon line-draws, counters. */
export default function Reveals() {
  useAnime(ctx => {
    const counters = $$('[data-count]');
    const countUp = (el: Element) => {
      const target = Number((el as HTMLElement).dataset.count);
      if (ctx.reduce) { el.textContent = target.toLocaleString('en-US'); return; }
      const o = { v: 0 };
      ctx.animate(o, { v: target, duration: 2200, ease: 'outExpo', onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('en-US'); } });
    };
    if (ctx.reduce) { counters.forEach(countUp); return; }

    $$('main [data-split]').forEach(h => {
      if (h.closest('.hero')) return; // hero runs its own intro
      ctx.onEnter(h, () => ctx.animate($$('.w > span', h), { translateY: ['108%', '0%'], duration: 1000, delay: stagger(55), ease: 'outExpo' }), 0.3);
    });
    $$('main .reveal').forEach(e => ctx.onEnter(e, () => ctx.animate(e, { opacity: [0, 1], translateY: [24, 0], duration: 900, ease: 'outExpo' })));
    $$('main .reveal-stagger').forEach(e => ctx.onEnter(e, () => ctx.animate(e.children, { opacity: [0, 1], translateY: [14, 0], duration: 700, delay: stagger(90), ease: 'outExpo' })));

    const iconStrokes = $$('.sol-icon .draw:not(.dash)');
    if (iconStrokes.length) ctx.set(svg.createDrawable(iconStrokes), { draw: '0 0' });
    const parents = new Set($$('main .reveal-card').map(c => c.parentElement!));
    parents.forEach(p => ctx.onEnter(p, () => {
      ctx.animate($$(':scope > .reveal-card', p), { opacity: [0, 1], translateY: [24, 0], duration: 900, delay: stagger(110), ease: 'outExpo' });
      const icons = $$('.sol-icon .draw:not(.dash)', p);
      if (icons.length) {
        ctx.animate(svg.createDrawable(icons), { draw: ['0 0', '0 1'], duration: 1400, delay: stagger(40, { start: 200 }), ease: 'inOutQuad' });
        ctx.animate($$('.sol-icon .dash', p), { opacity: [0, 0.55], duration: 800, delay: 900 });
      }
    }, 0.12));

    counters.forEach(e => ctx.onEnter(e, countUp, 0.5));
  });
  return null;
}
