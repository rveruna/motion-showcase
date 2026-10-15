import type { ReactNode } from 'react';
import { DrawPath } from './demos/DrawPath';
import { ScrollReveal } from './demos/ScrollReveal';
import { SpringCard } from './demos/SpringCard';
import { StaggerList } from './demos/StaggerList';
import { useReducedMotion } from './hooks/useReducedMotion';

function Demo({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <section className="demo">
      <h2>{title}</h2>
      <p className="note">{note}</p>
      {children}
    </section>
  );
}

export default function App() {
  const reduced = useReducedMotion();
  return (
    <main>
      <header>
        <h1>Motion Showcase</h1>
        <p className="lede">
          Four small interface animations in React and TypeScript. No animation library: CSS, the Web
          platform, and about 40 lines of spring physics.
        </p>
        <p className="status" role="status">
          {reduced
            ? 'Reduced motion is on, so these are shown without movement.'
            : 'Tip: turn on “Reduce motion” in your OS settings and these will calm down.'}
        </p>
      </header>
      <div className="grid">
        <Demo title="Spring drag" note="Pointer events plus a damped spring integrated per frame.">
          <SpringCard />
        </Demo>
        <Demo title="Staggered entrance" note="One CSS keyframe, delayed per row.">
          <StaggerList />
        </Demo>
        <Demo title="Path drawing" note="SVG stroke-dashoffset, with no JS measuring.">
          <DrawPath />
        </Demo>
        <Demo title="Scroll reveal" note="IntersectionObserver, opacity and transform only.">
          <ScrollReveal />
        </Demo>
      </div>
      <footer>
        <a href="https://github.com/rveruna/motion-showcase">Source on GitHub</a>
      </footer>
    </main>
  );
}
