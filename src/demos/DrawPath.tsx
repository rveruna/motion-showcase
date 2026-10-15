import { useState } from 'react';

/** A circle and a tick drawn on with stroke-dashoffset. `pathLength="1"` means no measuring in JS. */
export function DrawPath() {
  const [run, setRun] = useState(0);
  return (
    <div className="stage">
      <svg
        key={run}
        className="draw"
        viewBox="0 0 120 120"
        role="img"
        aria-label="A circle drawing itself, then a tick"
      >
        <circle className="draw__circle" cx="60" cy="60" r="48" pathLength="1" />
        <path className="draw__tick" d="M38 62 L54 78 L84 44" pathLength="1" />
      </svg>
      <button type="button" className="replay" onClick={() => setRun((n) => n + 1)}>
        Replay
      </button>
    </div>
  );
}
