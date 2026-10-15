'use client';

import { useEffect } from 'react';

/** Tells the boot script in <head> that the app hydrated, so it keeps the motion-ready .js class. */
export default function ReadyFlag() {
  useEffect(() => {
    (window as unknown as { __agexReady?: boolean }).__agexReady = true;
  }, []);
  return null;
}
