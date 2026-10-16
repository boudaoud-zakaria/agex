import Link from 'next/link';
import Icon from '@/components/Icon';
import { Logo } from '@/components/LogoSprite';
import SplitHeading from '@/components/SplitHeading';
import LightRoads from '@/components/visuals/LightRoads';
import { GLOBAL_PRESENCE, HQ, LEGAL_NAME, SOCIALS, TAGLINE } from '@/lib/site';

const SOLUTIONS = [
  { href: '/solutions/ride-hailing', label: 'Ride-hailing' },
  { href: '/solutions/delivery', label: 'Delivery' },
  { href: '/solutions/fleet', label: 'Fleet management' },
  { href: '/contact?building=Multiple%20services', label: 'Multiple services' },
  { href: '/#engine', label: 'Technology platform' },
];
const COMPANY = [
  { href: '/#engine', label: 'Engine' },
  { href: '/#how', label: 'How it works' },
  { href: '/about', label: 'About' },
  { href: '/contact?topic=careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteFooter({ cta = true }: { cta?: boolean }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer" data-theme="dark" data-label="Contact">
      {cta && (
        <div className="foot-cta">
          <LightRoads variant="band" className="foot-cta-roads" />
          <div className="wrap foot-cta-inner">
            <div>
              <SplitHeading className="foot-cta-title" lines={[{ text: 'Ready to build', tone: 'muted' }, { text: 'a mobility business?' }]} />
              <p className="foot-cta-sub reveal">Let’s explore your market and opportunity.</p>
            </div>
            <Link className="btn btn-solid btn-lg reveal" href="/contact">Start your mobility business <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      )}
      <div className="wrap">
        <div className="foot-cols">
          <div className="foot-brand">
            <Logo label="AGEX" />
            <p>{TAGLINE}</p>
            <ul className="foot-social" aria-label="Social media">
              {SOCIALS.map(s => (
                <li key={s.key}><a href={s.href} target="_blank" rel="noopener" aria-label={s.label}><Icon name={s.key} size={18} /></a></li>
              ))}
            </ul>
          </div>
          <nav className="foot-col" aria-label="Solutions">
            <p className="label">Solutions</p>
            <ul>{SOLUTIONS.map(l => <li key={l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </nav>
          <nav className="foot-col" aria-label="Company">
            <p className="label">Company</p>
            <ul>{COMPANY.map(l => <li key={l.label}><Link href={l.href}>{l.label}</Link></li>)}</ul>
          </nav>
          <div className="foot-col foot-hq">
            <p className="label">Headquarters</p>
            <address>
              <Icon name="pin" size={18} />
              <span><b>{HQ.label}</b>{HQ.lines.map(l => <span key={l}>{l}</span>)}</span>
            </address>
          </div>
          <div className="foot-col foot-presence">
            <p className="label">Global presence</p>
            <ul>{GLOBAL_PRESENCE.map(c => <li key={c}><Icon name="pin" size={16} />{c}</li>)}</ul>
          </div>
        </div>
        <div className="foot-base">
          <span>© {year} {LEGAL_NAME} All rights reserved.</span>
          <span className="foot-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/privacy#cookies">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
