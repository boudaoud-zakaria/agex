import { LOGO_PATHS } from '@/lib/logo';

/** Inline SVG symbol for the AGEX wordmark; reference with <Logo /> or <use href="#agex-logo" />. */
export default function LogoSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="agex-logo" viewBox="0 0 1841 254">
        {LOGO_PATHS.map(d => <path key={d} d={d} />)}
      </symbol>
    </svg>
  );
}

export function Logo({ className = 'logo', label }: { className?: string; label?: string }) {
  return (
    <svg className={className} viewBox="0 0 1841 254" aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined}>
      <use href="#agex-logo" />
    </svg>
  );
}
