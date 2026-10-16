import { createElement, Fragment } from 'react';

type Line = { text: string; tone?: 'muted' | 'strong' };
type Props = {
  as?: 'h1' | 'h2' | 'h3';
  /** Single run of text… */
  text?: string;
  /** …or explicit lines, each optionally toned (muted = gray Regular, strong = Demi). */
  lines?: Line[];
  className?: string;
  id?: string;
};

const words = (t: string) =>
  t.split(' ').map((w, i, a) => (
    <Fragment key={i}>
      <span className="w"><span>{w}</span></span>
      {i < a.length - 1 ? ' ' : null}
    </Fragment>
  ));

/** Heading pre-split into clip-masked words for the anime.js word-rise reveal. */
export default function SplitHeading({ as = 'h2', text, lines, className, id }: Props) {
  const content = lines
    ? lines.map((l, i) => (
        <Fragment key={i}>
          <span className={`hl ${l.tone === 'muted' ? 'hl-muted' : 'hl-strong'}`}>{words(l.text)}</span>
          {i < lines.length - 1 ? ' ' : null}
        </Fragment>
      ))
    : words(text ?? '');
  return createElement(as, { className, id, 'data-split': '' }, content);
}
