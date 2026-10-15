import { useEffect, useRef, useState } from 'react';

const CARDS = [
  { title: 'Observe once', body: 'An IntersectionObserver adds a class the first time a card enters view.' },
  {
    title: 'Then let go',
    body: 'It unobserves straight after, so scrolling costs nothing once cards are shown.',
  },
  {
    title: 'No layout jank',
    body: 'Only opacity and transform animate, so the browser can run it on the GPU.',
  },
];

function RevealCard({ title, body }: { title: string; body: string }) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className={`reveal${shown ? ' reveal--shown' : ''}`}>
      <h3>{title}</h3>
      <p>{body}</p>
    </article>
  );
}

export function ScrollReveal() {
  return (
    // Focusable on purpose: a scrollable region must be reachable by keyboard so arrow keys can scroll it.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className="stage stage--scroll" tabIndex={0} role="region" aria-label="Scrollable list of cards">
      <p className="hint">Scroll inside this box ↓</p>
      <div className="spacer" aria-hidden="true" />
      {CARDS.map((c) => (
        <RevealCard key={c.title} {...c} />
      ))}
    </div>
  );
}
