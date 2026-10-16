import type { ReactNode } from 'react';

/** Minimal outline icon set (24px grid, 1.5 stroke, currentColor). */
const P: Record<string, ReactNode> = {
  car: <><path d="M4 15.5v-3.1c0-.6.2-1.1.5-1.6L6.4 7.4A2 2 0 0 1 8.1 6.4h7.8a2 2 0 0 1 1.7 1l1.9 3.4c.3.5.5 1 .5 1.6v3.1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z" /><path d="M7 16.5V18.5M17 16.5V18.5M4.6 11h14.8M7 13.6h1.6M15.4 13.6H17" /></>,
  box: <><path d="M12 2.8 20.2 7.4v9.2L12 21.2l-8.2-4.6V7.4L12 2.8Z" /><path d="M3.8 7.4 12 12l8.2-4.6M12 12v9.2M7.9 5.1l8.2 4.6" /></>,
  truck: <><path d="M2.5 6.5h11v9.5h-11zM13.5 9.5h3.8l3.2 3.6V16h-7" /><circle cx="6.5" cy="17.5" r="1.7" /><circle cx="17" cy="17.5" r="1.7" /></>,
  layers: <><path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" /><path d="m3 12 9 4.5 9-4.5M3 16l9 4.5 9-4.5" /></>,
  globe: <><circle cx="12" cy="12" r="8.8" /><path d="M3.2 12h17.6M12 3.2c2.4 2.4 3.6 5.3 3.6 8.8s-1.2 6.4-3.6 8.8c-2.4-2.4-3.6-5.3-3.6-8.8S9.6 5.6 12 3.2Z" /></>,
  network: <><circle cx="12" cy="5.5" r="2.3" /><circle cx="5.5" cy="18" r="2.3" /><circle cx="18.5" cy="18" r="2.3" /><path d="M10.9 7.5 6.6 16M13.1 7.5l4.3 8.5M7.8 18h8.4" /></>,
  growth: <><path d="M4 20.5v-4M9 20.5v-7M14 20.5v-5M19 20.5v-10" /><path d="M14.5 4.5h5v5M19.5 4.5l-7 7" /></>,
  phone: <><rect x="6.5" y="2.8" width="11" height="18.4" rx="2.4" /><path d="M10.5 18h3" /></>,
  monitor: <><rect x="2.8" y="4" width="18.4" height="12.5" rx="1.6" /><path d="M8 20.5h8M12 16.5v4" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" /><circle cx="12" cy="12" r="6.4" /></>,
  users: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19.5c.4-3.3 2.8-5.3 6-5.3s5.6 2 6 5.3" /><path d="M15.5 5.6a3 3 0 0 1 0 5.8M17.5 14.6c1.9.7 3.2 2.4 3.5 4.9" /></>,
  building: <><path d="M4.5 21V4.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V21M14.5 9.5h4a1 1 0 0 1 1 1V21M3 21h18" /><path d="M8 7.5h3M8 11h3M8 14.5h3M17 13v.01M17 16.5v.01" /></>,
  shield: <><path d="M12 3 4.8 5.8v5.6c0 4.4 3 8.1 7.2 9.6 4.2-1.5 7.2-5.2 7.2-9.6V5.8L12 3Z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></>,
  plug: <><circle cx="12" cy="12" r="2.6" /><circle cx="5" cy="5.5" r="2" /><circle cx="19" cy="5.5" r="2" /><circle cx="12" cy="20" r="2" /><path d="M6.6 6.8 10 10.2M17.4 6.8 14 10.2M12 14.6V18" /></>,
  chat: <><path d="M4 5.5a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.8V16h0A1.5 1.5 0 0 1 4 14.5v-9Z" /><path d="M8 8.5h8M8 11.8h5" /></>,
  bars: <><path d="M4 20.5h16M6.5 17V12M10.5 17V7M14.5 17v-6M18.5 17V9" /></>,
  database: <><ellipse cx="12" cy="6" rx="7" ry="2.8" /><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" /></>,
  calculator: <><rect x="5" y="2.8" width="14" height="18.4" rx="2" /><path d="M8.5 6.5h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01" /></>,
  store: <><path d="M4 9.5V20h16V9.5M3 9.5l1.6-5h14.8l1.6 5c0 1.4-1.1 2.5-2.5 2.5S16 10.9 16 9.5c0 1.4-1.1 2.5-2.5 2.5S11 10.9 11 9.5M3 9.5C3 10.9 4.1 12 5.5 12S8 10.9 8 9.5c0 1.4 1.1 2.5 2.5 2.5" /><path d="M10 20v-4.5h4V20" /></>,
  target: <><circle cx="12" cy="12" r="8.6" /><circle cx="12" cy="12" r="4.6" /><circle cx="12" cy="12" r=".9" /><path d="m15.5 8.5 4.8-4.8M17.5 3.5v3h3" /></>,
  diamond: <><path d="M7 4h10l4 5-9 11L3 9l4-5Z" /><path d="M3 9h18M9.5 4 8 9l4 11 4-11-1.5-5" /></>,
  check: <><circle cx="12" cy="12" r="8.8" /><path d="m8.2 12.2 2.6 2.6 5-5.3" /></>,
  pin: <><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" /><circle cx="12" cy="10" r="2.4" /></>,
  link: <><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>,
  bag: <><path d="M5 8h14l-1 12.5H6L5 8Z" /><path d="M9 10.5V6.5a3 3 0 0 1 6 0v4" /></>,
  home: <><path d="M3.5 11 12 4l8.5 7M5.5 9.5V20h13V9.5" /><path d="M10 20v-5h4v5" /></>,
  utensils: <><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M16.5 21V3c-2 1.5-3 4-3 7.5V13h3" /></>,
  route: <><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="6" r="2.2" /><path d="M8.2 18h7.3a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7h7.3" /></>,
  clock: <><circle cx="12" cy="12" r="8.8" /><path d="M12 7v5l3.2 2" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  wallet: <><path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" /><rect x="4" y="8" width="16.5" height="11" rx="2" /><path d="M16.5 13.5h.01" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  linkedin: <><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V16M8 7.8v.01M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.4-2.6s2.1.9 2.1 2.6V16" /></>,
  x: <path d="M5 4.5h3.8L19 19.5h-3.8L5 4.5ZM18.5 4.5l-5.8 6.6M11.3 12.9l-5.8 6.6" />,
  youtube: <><rect x="2.8" y="5.5" width="18.4" height="13" rx="3.4" /><path d="m10.3 9.4 4.6 2.6-4.6 2.6V9.4Z" /></>,
  medium: <><ellipse cx="7.5" cy="12" rx="4.5" ry="5" /><ellipse cx="15.8" cy="12" rx="2.2" ry="4.7" /><path d="M20.5 7.6v8.8" /></>,
};

export type IconName = keyof typeof P;

export const iconPaths = (name: string) => P[name] ?? null;

export default function Icon({ name, size = 24, className }: { name: IconName | string; size?: number; className?: string }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name] ?? null}
    </svg>
  );
}
