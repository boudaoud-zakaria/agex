'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { Logo } from '@/components/LogoSprite';
import { $$, prefersReducedMotion, subscribeScroll } from '@/lib/motion';

type Props = {
  /** Home page: header theme follows sections, nav highlights the current section, intro animation. */
  home?: boolean;
  theme?: 'dark' | 'light';
  current?: 'contact';
  ctaHref?: string;
};

const NAV = [
  { id: 'engine', label: 'Engine' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'deployments', label: 'Deployments' },
  { id: 'about', label: 'About' },
];
// Sections that map onto a nav item
const SECTION_NAV: Record<string, string> = { engine: 'engine', layers: 'engine', solutions: 'solutions', deployments: 'deployments', about: 'about' };

export default function SiteHeader({ home = false, theme = 'dark', current, ctaHref = '/contact' }: Props) {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const base = home ? '' : '/';

  // Theme + scrolled state + current nav item (home only)
  useEffect(() => {
    const header = headerRef.current;
    if (!home || !header) return;
    const themed = $$('main > section[data-theme], .site-footer');
    return subscribeScroll(() => {
      const hh = header.offsetHeight / 2;
      let cur = themed[0];
      for (const s of themed) { const r = s.getBoundingClientRect(); if (r.top <= hh && r.bottom > hh) { cur = s; break; } }
      if (!cur) return;
      header.dataset.theme = cur.dataset.theme || 'dark';
      header.classList.toggle('is-scrolled', window.scrollY > 12);
      setActive(SECTION_NAV[cur.id] ?? null);
    });
  }, [home]);

  // Mobile menu side effects
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (open && menuRef.current && !prefersReducedMotion()) {
      const a = animate($$('nav a, .btn', menuRef.current), { opacity: [0, 1], translateY: [24, 0], delay: stagger(50), duration: 600, ease: 'outExpo' });
      return () => { a.revert(); };
    }
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) { setOpen(false); btnRef.current?.focus(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  useEffect(() => () => document.body.classList.remove('menu-open'), []);

  const close = () => setOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header${home ? '' : ' is-scrolled'}`}
        data-theme={theme}
        {...(home ? { 'data-intro-header': '' } : {})}
      >
        <Link className="brand" href={home ? '#top' : '/'} aria-label={home ? 'AGEX TECH, back to top' : 'AGEX TECH home'}>
          <Logo />
        </Link>
        <nav className="nav" aria-label="Primary">
          {NAV.map(n => (
            <a key={n.id} href={`${base}#${n.id}`} className={active === n.id ? 'is-current' : undefined}>
              <span className="nav-dot" />{n.label}
            </a>
          ))}
          <Link href="/contact" className={current === 'contact' ? 'is-current' : undefined} aria-current={current === 'contact' ? 'page' : undefined}>
            <span className="nav-dot" />Contact
          </Link>
        </nav>
        <Link className="btn btn-outline nav-cta" href={ctaHref}>
          <span className="cta-long">Start your mobility business</span><span className="cta-short">Start</span>
        </Link>
        <button ref={btnRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(o => !o)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="menu-bars" aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      <div ref={menuRef} className="mobile-menu" id="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => (
            <a key={n.id} href={`${base}#${n.id}`} onClick={close}><span className="mono">0{i + 1}</span>{n.label}</a>
          ))}
          <Link href="/contact" onClick={close}><span className="mono">05</span>Contact</Link>
        </nav>
        <Link className="btn btn-solid" href={ctaHref} onClick={close}>Start your mobility business <span aria-hidden="true">→</span></Link>
      </div>
    </>
  );
}
