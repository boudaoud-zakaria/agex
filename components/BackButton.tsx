'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { canGoBack } from '@/lib/nav-history';

type Props = {
  /** Where to go when there is no previous AGEX page in this tab (direct visit, link from another site). */
  fallback: string;
  label?: string;
  className?: string;
};

/** Returns to the previous page on the site, keeping its scroll position. */
export default function BackButton({ fallback, label = 'Back', className }: Props) {
  const router = useRouter();
  return (
    <Link
      className={className ? `back-link ${className}` : 'back-link'}
      href={fallback}
      onClick={e => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!canGoBack() || window.history.length < 2) return; // nothing to go back to: follow the link
        e.preventDefault();
        router.back();
      }}
    >
      <span aria-hidden="true">←</span> {label}
    </Link>
  );
}
