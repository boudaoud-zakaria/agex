import Link from 'next/link';
import { Logo } from '@/components/LogoSprite';
import { LINKEDIN_URL } from '@/lib/site';

const LINKS = [
  { href: '/#engine', label: 'Engine' },
  { href: '/#solutions', label: 'Solutions' },
  { href: '/#deployments', label: 'Deployments' },
  { href: '/#about', label: 'About' },
];

export default function SiteFooter({ compact = false }: { compact?: boolean }) {
  const year = new Date().getFullYear();
  const base = (
    <div className="foot-base mono" style={compact ? { marginTop: 0, borderTop: 0, paddingTop: 0 } : undefined}>
      <span>© {year} AGEX TECH. All rights reserved.</span>
      <span className="foot-legal"><Link href="/legal#privacy">Privacy</Link><Link href="/legal#terms">Terms</Link></span>
    </div>
  );
  return (
    <footer className="site-footer" data-theme="dark" data-label="09 / Contact">
      <div className="wrap">
        {!compact && (
          <div className="foot-grid">
            <div className="foot-brand">
              <Logo label="AGEX" />
              <p className="mono">AGEX TECH · Intelligent Mobility Engine</p>
            </div>
            <ul className="foot-links mono">
              {LINKS.map(l => (
                <li key={l.href}><a href={l.href}><span className="d" />{l.label}<span className="a" aria-hidden="true">→</span></a></li>
              ))}
              <li><Link href="/contact"><span className="d" />Contact<span className="a" aria-hidden="true">→</span></Link></li>
              <li><a href={LINKEDIN_URL} rel="noopener" target="_blank"><span className="d" />LinkedIn<span className="a" aria-hidden="true">↗</span></a></li>
            </ul>
          </div>
        )}
        {base}
      </div>
    </footer>
  );
}
