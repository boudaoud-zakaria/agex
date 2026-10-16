'use client';

import { stagger } from 'animejs';
import { $$, useAnime } from '@/lib/motion';

/** Load sequence for the contact pages: intro copy, steps, then the form card and its fields. */
export default function ContactMotion() {
  useAnime(ctx => {
    if (ctx.reduce) return;
    const text = $$('[data-c="text"]'), steps = $$('[data-c="step"]'), icos = $$('[data-c="ico"]');
    const form = $$('[data-c="form"]'), art = $$('[data-c="art"]');
    const fields = $$('[data-c="form"] .form > *');
    ctx.set(fields, { opacity: 0, translateY: 14 });
    const run = () => ctx.timeline({ defaults: { ease: 'outExpo' } })
      .add(text[0], { opacity: [0, 1], translateY: [16, 0], duration: 900 }, 350)
      .add(steps, { opacity: [0, 1], translateX: [-18, 0], duration: 800, delay: stagger(110) }, 500)
      .add(icos, { scale: [0.6, 1], duration: 700, delay: stagger(110), ease: 'outBack' }, 520)
      .add(text.slice(1), { opacity: [0, 1], duration: 700 }, 900)
      .add(art, { opacity: [0, 1], duration: 1400, ease: 'outQuad' }, 600)
      .add(form, { opacity: [0, 1], translateX: [40, 0], duration: 1000 }, 250)
      .add(fields, { opacity: [0, 1], translateY: [14, 0], duration: 700, delay: stagger(45) }, 500);
    if (document.fonts?.ready) document.fonts.ready.then(run); else run();
  });
  return null;
}
