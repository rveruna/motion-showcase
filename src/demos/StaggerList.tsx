import { useState } from 'react';

const ITEMS = ['Design tokens', 'Focus states', 'Reduced motion', 'Contrast checks', 'Keyboard paths'];

/** Each row slides in 70ms after the one before it. Pure CSS; React only re-keys the list to replay it. */
export function StaggerList() {
  const [run, setRun] = useState(0);
  return (
    <div className="stage">
      <ul className="stagger" key={run}>
        {ITEMS.map((label, i) => (
          <li key={label} style={{ animationDelay: `${i * 70}ms` }}>
            {label}
          </li>
        ))}
      </ul>
      <button type="button" className="replay" onClick={() => setRun((n) => n + 1)}>
        Replay
      </button>
    </div>
  );
}
