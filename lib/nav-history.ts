// Tab-scoped trail of AGEX pages, so a "Back" button can return to the previous page
// on this site, and fall back to a fixed route when the visitor arrived from elsewhere.
const KEY = 'agex.trail';
let trail: string[] | null = null;

const read = (): string[] => {
  try { const v = JSON.parse(sessionStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; }
};
const write = (t: string[]) => {
  try { sessionStorage.setItem(KEY, JSON.stringify(t.slice(-30))); } catch {}
};

export function recordVisit(path: string) {
  if (!trail) {
    // First page of this document: a fresh landing from outside the site starts a new trail;
    // reloads, history moves and full-page links from this site keep the stored one.
    const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined;
    const fromSite = document.referrer.startsWith(`${location.origin}/`);
    trail = nav?.type === 'navigate' && !fromSite ? [] : read();
  }
  const t = trail;
  if (t[t.length - 1] === path) return;   // reload, or a hash-only change
  if (t[t.length - 2] === path) t.pop();  // went back
  else t.push(path);
  write(t);
}

export const canGoBack = () => (trail?.length ?? 0) > 1;
