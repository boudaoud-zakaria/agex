/** Deployment markets shown on the map and the Deployments page. */
export type Status = 'live' | 'dev' | 'plan';
export const MARKERS: Array<{ k: string; name: string; sub: string; cls: Status; dir: string }> = [
  { k: 'uae', name: 'UAE', sub: 'YAY · Live', cls: 'live', dir: '' },
  { k: 'algeria', name: 'Algeria', sub: 'WahGo · Live', cls: 'live', dir: 'left' },
  { k: 'egypt', name: 'Egypt', sub: 'Developing', cls: 'dev', dir: 'left down' },
  { k: 'syria', name: 'Syria', sub: 'Pre-launch', cls: 'dev', dir: '' },
  { k: 'ksa', name: 'KSA', sub: 'In discussion', cls: 'plan', dir: 'left down' },
  { k: 'oman', name: 'Oman', sub: 'In discussion', cls: 'plan', dir: 'down' },
];
export const MARKETS: Array<{ name: string; meta: string; cls: Status }> = [
  { name: 'United Arab Emirates', meta: 'YAY · Live · Owned operations', cls: 'live' },
  { name: 'Algeria', meta: 'WahGo · Live · Engine-as-a-service', cls: 'live' },
  { name: 'Egypt', meta: 'Developing · License acquired, partners in place', cls: 'dev' },
  { name: 'Syria', meta: 'Pre-launch · License acquired, partners in place', cls: 'dev' },
  { name: 'Saudi Arabia', meta: 'Partner discussions underway', cls: 'plan' },
  { name: 'Oman', meta: 'Partner discussions underway', cls: 'plan' },
];
