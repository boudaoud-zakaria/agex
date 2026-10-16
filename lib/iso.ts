import { mk } from '@/lib/motion';

/** 2:1 dimetric projection: local ground (u, v) and height z → screen point. */
export type Pt = [number, number];
export type Proj = (u: number, v: number, z?: number) => Pt;
export const iso = (ox: number, oy: number): Proj => (u, v, z = 0) => [ox + u - v, oy + 0.5 * u + 0.5 * v - z];

const pts = (a: Pt[]) => a.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

/** Extruded box (building / vehicle body). Returns the group so it can be animated. */
export function box(parent: Element, P: Proj, u: number, v: number, w: number, d: number, h: number, cls = 'bx') {
  const g = mk('g', { class: cls, style: 'transform-box:fill-box;transform-origin:50% 100%' }, parent);
  const u0 = u - w / 2, u1 = u + w / 2, v0 = v - d / 2, v1 = v + d / 2;
  mk('polygon', { class: 'bx-l', points: pts([P(u0, v1), P(u1, v1), P(u1, v1, h), P(u0, v1, h)]) }, g);
  mk('polygon', { class: 'bx-r', points: pts([P(u1, v1), P(u1, v0), P(u1, v0, h), P(u1, v1, h)]) }, g);
  mk('polygon', { class: 'bx-t', points: pts([P(u0, v0, h), P(u1, v0, h), P(u1, v1, h), P(u0, v1, h)]) }, g);
  return g;
}

/** Square plate (platform / engine layer) with thickness. */
export function plate(parent: Element, P: Proj, half: number, thick: number, cls = 'pl') {
  const g = mk('g', { class: cls }, parent);
  const tl = P(-half, -half), tr = P(half, -half), br = P(half, half), bl = P(-half, half);
  const dn = (p: Pt): Pt => [p[0], p[1] + thick];
  const left = mk('polygon', { class: 'pl-l', points: pts([bl, br, dn(br), dn(bl)]) }, g);
  const right = mk('polygon', { class: 'pl-r', points: pts([br, tr, dn(tr), dn(br)]) }, g);
  const top = mk('polygon', { class: 'pl-t', points: pts([tl, tr, br, bl]) }, g);
  return { g, top, left, right, outline: [top, left, right] };
}

/** Rounded rectangle loop in local ground space, projected → closed path (for roads & motion paths). */
export function loop(P: Proj, u0: number, v0: number, u1: number, v1: number, r = 14, z = 0) {
  const out: Pt[] = [];
  const arc = (cu: number, cv: number, a0: number) => {
    for (let i = 0; i <= 6; i++) { const a = a0 + (i / 6) * (Math.PI / 2); out.push(P(cu + Math.cos(a) * r, cv + Math.sin(a) * r, z)); }
  };
  arc(u1 - r, v0 + r, -Math.PI / 2);
  arc(u1 - r, v1 - r, 0);
  arc(u0 + r, v1 - r, Math.PI / 2);
  arc(u0 + r, v0 + r, Math.PI);
  return 'M' + out.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L') + ' Z';
}

/** Polyline in local ground space with softened corners, projected → open path. */
export function road(P: Proj, path: Array<[number, number]>, r = 12, z = 0) {
  const out: Pt[] = [P(path[0][0], path[0][1], z)];
  for (let i = 1; i < path.length - 1; i++) {
    const [a, b, c] = [path[i - 1], path[i], path[i + 1]];
    const l1 = Math.hypot(a[0] - b[0], a[1] - b[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1]);
    const k1 = Math.min(r, l1 / 2) / l1, k2 = Math.min(r, l2 / 2) / l2;
    const s: [number, number] = [b[0] + (a[0] - b[0]) * k1, b[1] + (a[1] - b[1]) * k1];
    const e: [number, number] = [b[0] + (c[0] - b[0]) * k2, b[1] + (c[1] - b[1]) * k2];
    for (let t = 0; t <= 1.001; t += 0.2) {
      const u = (1 - t) * (1 - t) * s[0] + 2 * (1 - t) * t * b[0] + t * t * e[0];
      const v = (1 - t) * (1 - t) * s[1] + 2 * (1 - t) * t * b[1] + t * t * e[1];
      out.push(P(u, v, z));
    }
  }
  const l = path[path.length - 1];
  out.push(P(l[0], l[1], z));
  return 'M' + out.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L');
}

/** Map pin standing on the ground. */
export function pin(parent: Element, P: Proj, u: number, v: number, h = 22, cls = 'pin') {
  const g = mk('g', { class: cls }, parent);
  const [x, y] = P(u, v);
  mk('ellipse', { class: 'pin-shadow', cx: x, cy: y, rx: 6, ry: 3 }, g);
  mk('line', { class: 'pin-stem', x1: x, y1: y, x2: x, y2: y - h }, g);
  mk('circle', { class: 'pin-head', cx: x, cy: y - h - 5, r: 5.5 }, g);
  return g;
}
