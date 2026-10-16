'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import { prefersReducedMotion } from '@/lib/motion';

type Mode = 'off' | 'intro' | 'replay';
const SEEN_KEY = 'agex.filmSeen';
export const FILM_OPEN_EVENT = 'agex:film-open';
export const INTRO_DONE_EVENT = 'agex:intro-done';

/**
 * AGEX brand film.
 * - First desktop visit: plays once as a full-screen cinematic intro (muted autoplay), with "Skip intro →"
 *   and a thin progress line, then fades into the hero. The decision is made pre-paint in app/layout.tsx
 *   (html.intro-pending) so the hero never flashes behind it.
 * - Any time: "Watch the AGEX film" (hero) replays it in an overlay, with sound.
 */
export default function FilmPlayer() {
  const [mode, setMode] = useState<Mode>('off');
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const actionRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closing = useRef(false);

  // Decide initial mode + listen for replay requests
  useEffect(() => {
    if (document.documentElement.classList.contains('intro-pending')) setMode('intro');
    const open = () => { returnFocus.current = document.activeElement as HTMLElement; closing.current = false; setMode('replay'); };
    window.addEventListener(FILM_OPEN_EVENT, open);
    return () => window.removeEventListener(FILM_OPEN_EVENT, open);
  }, []);

  const finish = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const v = videoRef.current, root = rootRef.current;
    const wasIntro = document.documentElement.classList.contains('intro-pending');
    try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable */ }
    if (wasIntro) {
      // let the hero start its intro while the film fades away
      (window as unknown as { __agexIntroDone?: boolean }).__agexIntroDone = true;
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    }
    const done = () => {
      document.documentElement.classList.remove('intro-pending');
      v?.pause();
      setMode('off');
      returnFocus.current?.focus?.();
    };
    if (!root || prefersReducedMotion()) { done(); return; }
    animate(root, { opacity: [1, 0], duration: 800, ease: 'outQuad', onComplete: () => { root.style.opacity = ''; done(); } });
  }, []);

  // Start playback whenever the overlay opens
  useEffect(() => {
    if (mode === 'off') return;
    const v = videoRef.current, bar = barRef.current;
    if (!v) return;
    let raf = 0;
    const tick = () => {
      if (bar && v.duration) bar.style.transform = `scaleX(${Math.min(1, v.currentTime / v.duration)})`;
      raf = requestAnimationFrame(tick);
    };
    v.muted = mode === 'intro';
    v.preload = 'auto';
    v.currentTime = 0;
    setPaused(false);
    setMuted(v.muted);
    const p = v.play();
    if (p) p.catch(() => {
      if (mode === 'intro') { finish(); return; }
      // sound blocked by the browser: fall back to muted playback with a sound toggle
      v.muted = true; setMuted(true);
      v.play().catch(() => setPaused(true));
    });
    raf = requestAnimationFrame(tick);
    const onEnd = () => finish();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
      if (e.key === 'Tab' && rootRef.current) { // keep focus inside the dialog
        const els = Array.from(rootRef.current.querySelectorAll<HTMLElement>('button'));
        const i = els.indexOf(document.activeElement as HTMLElement);
        e.preventDefault();
        els[(i + (e.shiftKey ? -1 : 1) + els.length) % els.length]?.focus();
      }
    };
    v.addEventListener('ended', onEnd);
    document.addEventListener('keydown', onKey);
    document.body.classList.add('film-open');
    actionRef.current?.focus({ preventScroll: true });
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener('ended', onEnd);
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('film-open');
    };
  }, [mode, finish]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => undefined);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v || mode !== 'replay') return;
    if (v.paused) { v.play().catch(() => undefined); setPaused(false); } else { v.pause(); setPaused(true); }
  };

  return (
    <div ref={rootRef} className={`film${mode !== 'off' ? ' is-open' : ''} film-${mode}`} role="dialog" aria-modal="true" aria-label="AGEX brand film">
      <video
        ref={videoRef}
        className="film-video"
        src="/media/agex-film.mp4"
        poster={mode === 'replay' ? '/media/agex-film-poster.jpg' : undefined}
        playsInline
        preload="none"
        onClick={togglePlay}
        aria-label="AGEX brand film, 10 seconds"
      />
      {mode === 'replay' && paused && (
        <button type="button" className="film-resume" onClick={togglePlay} aria-label="Play film">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5L8 5.5Z" /></svg>
        </button>
      )}
      <button ref={actionRef} type="button" className="film-action" onClick={finish}>
        {mode === 'replay' ? <>Close <span aria-hidden="true">✕</span></> : <>Skip intro <span aria-hidden="true">→</span></>}
      </button>
      {mode === 'replay' && (
        <button type="button" className="film-sound" onClick={toggleSound} aria-pressed={!muted}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4v-5Z" />
            {muted ? <path d="m16 9.5 5 5m0-5-5 5" /> : <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />}
          </svg>
          {muted ? 'Sound on' : 'Sound off'}
        </button>
      )}
      <span className="film-progress" aria-hidden="true"><span ref={barRef} /></span>
    </div>
  );
}
