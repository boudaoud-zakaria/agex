import { createElement, Fragment } from 'react';

type Props = { as?: 'h1' | 'h2' | 'h3'; text: string; className?: string; id?: string };

/** Heading pre-split into clip-masked words for the anime.js word-rise reveal. */
export default function SplitHeading({ as = 'h2', text, className, id }: Props) {
  const words = text.split(' ');
  return createElement(
    as,
    { className, id, 'data-split': '' },
    words.map((w, i) => (
      <Fragment key={i}>
        <span className="w"><span>{w}</span></span>
        {i < words.length - 1 ? ' ' : null}
      </Fragment>
    )),
  );
}
