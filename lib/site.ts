export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://agextech.com').replace(/\/$/, '');
export const SITE_NAME = 'AGEX TECH';
export const SITE_TITLE = 'AGEX TECH | Intelligent Mobility Engine';
export const SITE_DESCRIPTION =
  'AGEX TECH is the technology engine behind modern mobility. Launch, operate and scale ride-hailing, delivery and fleet businesses under your own brand.';

export const LEGAL_NAME = 'AGEX TECH PTE. LTD.';
export const TAGLINE = 'The intelligent mobility engine for ambitious operators and markets.';

export const HQ = {
  label: 'Singapore (HQ)',
  lines: ['6 Battery Road, #17-06', 'Six Battery Road', 'Singapore 049909'],
  street: '6 Battery Road, #17-06, Six Battery Road',
  postalCode: '049909',
  country: 'SG',
};

export const GLOBAL_PRESENCE = ['Singapore (HQ)', 'Canada', 'Korea', 'Algeria', 'Saudi Arabia', 'Qatar', 'UAE'];

// TODO(launch): replace with AGEX's real profile URLs
export const SOCIALS = [
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { key: 'x', label: 'X', href: 'https://x.com/' },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
  { key: 'medium', label: 'Medium', href: 'https://medium.com/' },
] as const;

export const NAV = [
  { key: 'engine', label: 'Engine', href: '/#engine' },
  { key: 'solutions', label: 'Solutions', href: '/#solutions' },
  { key: 'deployments', label: 'Deployments', href: '/#deployments' },
  { key: 'about', label: 'About', href: '/about' },
  { key: 'contact', label: 'Contact', href: '/contact' },
] as const;
export type NavKey = (typeof NAV)[number]['key'];
