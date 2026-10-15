'use client';

import { useEffect, useRef } from 'react';
import { $$, subscribeScroll } from '@/lib/motion';

const TICKS = 41;

/** anime.js-style scroll progress ruler, fixed bottom-right. */
export default function ScrollRuler() {
  const root = useRef<HTMLDivElement>(null);
  const ticks = useRef<HTMLSpanElement>(null);
  const mark = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current, tk = ticks.current, mk = mark.current, lb = label.current;
    if (!el || !tk || !mk || !lb) return;
    const tickEls = Array.from(tk.children) as HTMLElement[];
    const themed = $$('main > section[data-theme], .site-footer');
    return subscribeScroll(() => {
      const vh = window.innerHeight, y = window.scrollY;
      const max = document.documentElement.scrollHeight - vh;
      const p = max > 0 ? y / max : 0;
      el.classList.toggle('is-visible', y > vh * 0.4);
      mk.style.transform = `translateX(${(p * (tk.offsetWidth - 2)).toFixed(1)}px)`;
      const hot = Math.round(p * (TICKS - 1));
      tickEls.forEach((t, i) => t.classList.toggle('hot', Math.abs(i - hot) <= 1));
      const hh = 36;
      const cur = themed.find(s => { const r = s.getBoundingClientRect(); return r.top <= hh && r.bottom > hh; });
      const text = cur?.dataset.label || '09 / Contact';
      if (lb.textContent !== text) lb.textContent = text;
    });
  }, []);

  return (
    <div ref={root} className="ruler" aria-hidden="true">
      <span ref={label} className="ruler-label mono">01 / Hero</span>
      <span className="ruler-track">
        <span ref={ticks} className="ruler-ticks">
          {Array.from({ length: TICKS }, (_, i) => <i key={i} className={i % 5 === 0 ? 'major' : undefined} />)}
        </span>
        <span ref={mark} className="ruler-mark" />
      </span>
    </div>
  );
}
