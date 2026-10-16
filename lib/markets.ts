/** Deployment markets shown on the map and the Deployments page. */
export type Status = 'live' | 'dev' | 'plan';
export const MARKERS: Array<{ k: string; name: string; cls: Status; dir: string }> = [
  { k: 'uae', name: 'UAE', cls: 'live', dir: '' },
  { k: 'algeria', name: 'Algeria', cls: 'live', dir: 'left' },
  { k: 'egypt', name: 'Egypt', cls: 'dev', dir: 'left down' },
  { k: 'syria', name: 'Syria', cls: 'dev', dir: '' },
  { k: 'ksa', name: 'KSA', cls: 'plan', dir: 'left down' },
  { k: 'oman', name: 'Oman', cls: 'plan', dir: 'down' },
];
export const MARKETS: Array<{ name: string; cls: Status }> = [
  { name: 'United Arab Emirates', cls: 'live' },
  { name: 'Algeria', cls: 'live' },
  { name: 'Egypt', cls: 'dev' },
  { name: 'Syria', cls: 'dev' },
  { name: 'Saudi Arabia', cls: 'plan' },
  { name: 'Oman', cls: 'plan' },
];
