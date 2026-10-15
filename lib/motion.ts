import { useEffect, type DependencyList } from 'react';
import { animate, createTimeline, stagger, utils } from 'animejs';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type Anim = { revert: () => unknown; pause: () => unknown; play: () => unknown };

export const NS = 'http://www.w3.org/2000/svg';

export { LOGO_PATHS } from './logo';

export const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector(s) as T;
export const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll(s)) as T[];
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function mk<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, parent?: Element | null) {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(n);
  return n;
}

/** Fill-box transform origin so SVG elements scale/rotate around their own centre. */
export const fb = { style: 'transform-box:fill-box;transform-origin:center' };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Deterministic pseudo-random, so demos look the same on every visit. */
export function seeded(seed = 7) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}

/* ------------------------------------------------------------------
   Lifecycle-safe anime.js usage in React
------------------------------------------------------------------ */
export type MotionCtx = {
  reduce: boolean;
  /** Track an animation/timeline so it is reverted on unmount. */
  track: <T extends Anim>(a: T) => T;
  animate: (targets: any, params: any) => any;
  timeline: (params?: any) => any;
  set: (targets: any, props: any) => any;
  onCleanup: (fn: () => void) => void;
  onEnter: (el: Element | null, fn: (el: Element) => void, threshold?: number) => void;
  whenVisible: (el: Element | null, show: () => void, hide: () => void, margin?: string) => void;
};

export function useAnime(setup: (ctx: MotionCtx) => void | (() => void), deps: DependencyList = []) {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const anims: Anim[] = [];
    const track = <T extends Anim>(a: T) => { if (a) anims.push(a); return a; };
    const ctx: MotionCtx = {
      reduce: prefersReducedMotion(),
      track,
      animate: (t, p) => track(animate(t, p) as any),
      timeline: p => track(createTimeline(p) as any),
      set: (t, p) => utils.set(t, p),
      onCleanup: fn => cleanups.push(fn),
      onEnter: (el, fn, threshold = 0.18) => {
        if (!el) return;
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } });
        }, { threshold, rootMargin: '0px 0px -8% 0px' });
        io.observe(el);
        cleanups.push(() => io.disconnect());
      },
      whenVisible: (el, show, hide, margin = '80px') => {
        if (!el) return;
        const io = new IntersectionObserver(([e]) => (e.isIntersecting ? show() : hide()), { rootMargin: margin });
        io.observe(el);
        cleanups.push(() => io.disconnect());
      },
    };
    const ret = setup(ctx);
    return () => {
      if (typeof ret === 'function') ret();
      cleanups.forEach(f => f());
      anims.forEach(a => { try { a.revert(); } catch { /* already gone */ } });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/* ------------------------------------------------------------------
   One shared rAF-throttled scroll/resize loop
------------------------------------------------------------------ */
type ScrollCb = () => void;
const subs = new Set<ScrollCb>();
let ticking = false;
let bound = false;
const run = () => { ticking = false; subs.forEach(cb => cb()); };
const schedule = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };

export function subscribeScroll(cb: ScrollCb) {
  if (!bound && typeof window !== 'undefined') {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    bound = true;
  }
  subs.add(cb);
  cb();
  return () => { subs.delete(cb); };
}

export function pinProgress(pin: HTMLElement) {
  const r = pin.getBoundingClientRect();
  return clamp01(-r.top / (pin.offsetHeight - window.innerHeight));
}

/* ------------------------------------------------------------------
   Dial (shared by hero + engine layers)
------------------------------------------------------------------ */
export const C = 300;
export const GRID_N = 13;
export const GRID_R = 196;
export const STEP = (GRID_R * 2) / (GRID_N - 1);
export const gp = (c: number, r: number): [number, number] => [C - GRID_R + c * STEP, C - GRID_R + r * STEP];

export const arcD = (r: number, a0: number, a1: number) => {
  const p = (a: number) => [C + r * Math.cos((a * Math.PI) / 180), C + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

export function roundedPath(pts: Array<[number, number]>, r = 12) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const l1 = Math.hypot(x0 - x1, y0 - y1), l2 = Math.hypot(x2 - x1, y2 - y1);
    const k1 = Math.min(r, l1 / 2) / l1, k2 = Math.min(r, l2 / 2) / l2;
    d += ` L${x1 + (x0 - x1) * k1} ${y1 + (y0 - y1) * k1} Q${x1} ${y1} ${x1 + (x2 - x1) * k2} ${y1 + (y2 - y1) * k2}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l[0]} ${l[1]}`;
}

export type Dial = {
  svg: SVGSVGElement;
  arcs: SVGGElement;
  ticks: SVGLineElement[];
  dots: SVGCircleElement[];
  stage: SVGGElement;
  prog: SVGCircleElement | null;
  idle: Anim[];
};

export function buildDial(host: HTMLElement, ctx: MotionCtx, { progress = false } = {}): Dial {
  host.innerHTML = '';
  const s = mk('svg', { viewBox: '0 0 600 600' }, host);
  const arcs = mk('g', { style: 'transform-origin:300px 300px' }, s);
  ([[-88, -32, 1], [-27, 33, 0.3], [38, 96, 0.55], [101, 148, 0.18], [153, 212, 0.75], [217, 267, 0.3]] as const)
    .forEach(([a0, a1, o]) => mk('path', { class: 'arc', d: arcD(288, a0, a1), 'stroke-width': 3, opacity: o }, arcs));
  let prog: SVGCircleElement | null = null;
  if (progress) {
    const circ = 2 * Math.PI * 296;
    prog = mk('circle', { class: 'ring', cx: C, cy: C, r: 296, 'stroke-width': 2, opacity: 0.9, transform: 'rotate(-90 300 300)', 'stroke-dasharray': circ, 'stroke-dashoffset': circ }, s);
  }
  const tickG = mk('g', {}, s);
  const ticks: SVGLineElement[] = [];
  for (let i = 0; i < 180; i++) {
    const a = (i / 180) * Math.PI * 2, major = i % 5 === 0, r0 = major ? 255 : 262, r1 = 272;
    ticks.push(mk('line', {
      class: 'tick' + (major ? ' major' : ''),
      x1: (C + Math.cos(a) * r0).toFixed(2), y1: (C + Math.sin(a) * r0).toFixed(2),
      x2: (C + Math.cos(a) * r1).toFixed(2), y2: (C + Math.sin(a) * r1).toFixed(2),
    }, tickG));
  }
  mk('circle', { class: 'ring', cx: C, cy: C, r: 244, opacity: 0.14, 'stroke-width': 1 }, s);
  mk('circle', { class: 'ring', cx: C, cy: C, r: 226, opacity: 0.045, 'stroke-width': 20 }, s);
  mk('path', { class: 'arc', d: arcD(226, -168, -112), 'stroke-width': 14, opacity: 0.1, 'stroke-linecap': 'round' }, s);
  const dotG = mk('g', {}, s);
  const dots: SVGCircleElement[] = [];
  for (let r = 0; r < GRID_N; r++) for (let c = 0; c < GRID_N; c++) {
    const [x, y] = gp(c, r);
    if (Math.hypot(x - C, y - C) <= GRID_R + 1) {
      dots.push(mk('circle', { class: 'gdot', cx: x, cy: y, r: 1.4, opacity: 0.28, ...fb }, dotG));
    }
  }
  const stage = mk('g', {}, s);
  const idle: Anim[] = [];
  if (!ctx.reduce) {
    idle.push(ctx.animate(arcs, { rotate: 360, duration: 90000, loop: true, ease: 'linear', autoplay: false }));
    idle.push(ctx.animate(ticks, { opacity: [0.2, 0.85, 0.2], duration: 1400, delay: stagger(14), loop: true, ease: 'inOutSine', autoplay: false }));
  }
  ctx.onCleanup(() => { host.innerHTML = ''; });
  return { svg: s, arcs, ticks, dots, stage, prog, idle };
}
