'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordVisit } from '@/lib/nav-history';

/** Records each page visited in this tab (used by BackButton). */
export default function RouteTrail() {
  const pathname = usePathname();
  useEffect(() => { recordVisit(pathname); }, [pathname]);
  return null;
}
