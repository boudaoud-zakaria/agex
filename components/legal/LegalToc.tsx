'use client';

import { useEffect, useRef, useState } from 'react';
import { subscribeScroll } from '@/lib/motion';

type Item = { id: string; n: string; title: string };

/** Sticky contents: highlights the clause in view and fills a gold reading-progress rail. Collapsible on small screens. */
export default function LegalToc({ items }: { items: Item[] }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(items[0]?.id);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nav = ref.current;
    const article = nav?.parentElement?.querySelector<HTMLElement>('.lg-article');
    const secs = items.map(i => document.getElementById(i.id)).filter((s): s is HTMLElement => !!s);
    if (!nav || !article || !secs.length) return;
    return subscribeScroll(() => {
      const line = window.innerHeight * 0.3;
      let cur = secs[0];
      for (const s of secs) if (s.getBoundingClientRect().top <= line) cur = s;
      setActive(cur.id);
      const r = article.getBoundingClientRect();
      nav.style.setProperty('--read', Math.min(1, Math.max(0, (line - r.top) / r.height)).toFixed(4));
    });
  }, [items]);

  // Scroll without adding history entries, so the page's Back button still leaves the page
  const go = (e: React.MouseEvent, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setOpen(false);
    target.scrollIntoView();
    target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
  };

  return (
    <aside ref={ref} className={`lg-toc${open ? ' open' : ''}`} aria-label="Contents">
      <button type="button" className="lg-toc-toggle" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        Contents <span className="chev" aria-hidden="true" />
      </button>
      <p className="label lg-toc-label">Contents</p>
      <div className="lg-toc-list">
        <i className="lg-rail" aria-hidden="true" />
        <ol className="reveal-stagger">
          {items.map(i => (
            <li key={i.id}>
              <a href={`#${i.id}`} aria-current={active === i.id ? 'location' : undefined} onClick={e => go(e, i.id)}>
                <span>{i.n}</span>{i.title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
