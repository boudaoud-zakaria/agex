'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { Logo } from '@/components/LogoSprite';
import { $$, prefersReducedMotion, subscribeScroll } from '@/lib/motion';
import { NAV, type NavKey } from '@/lib/site';

type Props = {
  /** Home page: plays the intro and highlights the in-view section. */
  home?: boolean;
  /** Header colour follows the section underneath (pages with alternating light/dark bands). */
  adaptive?: boolean;
  theme?: 'dark' | 'light';
  current?: NavKey;
  ctaHref?: string;
  ctaLabel?: string;
};

// Home sections that map onto a nav item
const SECTION_NAV: Record<string, NavKey> = { deployments: 'deployments', engine: 'engine', layers: 'engine', platform: 'engine', solutions: 'solutions' };

export default function SiteHeader({ home = false, adaptive = home, theme = 'dark', current, ctaHref = '/contact', ctaLabel = 'Start your mobility business' }: Props) {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<NavKey | null>(current ?? null);

  useEffect(() => {
    const header = headerRef.current;
    if (!adaptive || !header) return;
    const themed = $$('main > section[data-theme], .site-footer');
    return subscribeScroll(() => {
      const hh = header.offsetHeight / 2;
      let cur = themed[0];
      for (const s of themed) { const r = s.getBoundingClientRect(); if (r.top <= hh && r.bottom > hh) { cur = s; break; } }
      if (!cur) return;
      header.dataset.theme = cur.dataset.theme || 'dark';
      header.classList.toggle('is-scrolled', window.scrollY > 12);
      if (home) setActive(SECTION_NAV[cur.id] ?? null);
    });
  }, [adaptive, home]);

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
  const href = (h: string) => (home && h.startsWith('/#') ? h.slice(1) : h);

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header${adaptive ? '' : ' is-scrolled'}`}
        data-theme={theme}
        {...(home ? { 'data-intro-header': '' } : {})}
      >
        <Link className="brand" href={home ? '#top' : '/'} aria-label={home ? 'AGEX TECH, back to top' : 'AGEX TECH home'}>
          <Logo />
        </Link>
        <nav className="nav" aria-label="Primary">
          {NAV.map(n => (
            <Link key={n.key} href={href(n.href)} className={active === n.key ? 'is-current' : undefined} aria-current={current === n.key ? 'page' : undefined}>
              <span className="nav-dot" />{n.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-outline nav-cta" href={ctaHref}>
          <span className="cta-long">{ctaLabel}</span><span className="cta-short">Start</span>
        </Link>
        <button ref={btnRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(o => !o)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className="menu-bars" aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      <div ref={menuRef} className="mobile-menu" id="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => (
            <Link key={n.key} href={href(n.href)} onClick={close}><span className="label">0{i + 1}</span>{n.label}</Link>
          ))}
        </nav>
        <Link className="btn btn-solid" href={ctaHref} onClick={close}>{ctaLabel} <span aria-hidden="true">→</span></Link>
      </div>
    </>
  );
}
