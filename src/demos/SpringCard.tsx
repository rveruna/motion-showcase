import { useEffect, useRef, type PointerEvent } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { isAtRest, stepSpring, type SpringState } from '@/hooks/spring';

const SPRING = { stiffness: 180, damping: 14 };

/** A card you can drag anywhere. On release it springs back, overshooting like a real spring. */
export function SpringCard() {
  const reduced = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const state = useRef<SpringState>({ x: 0, y: 0, vx: 0, vy: 0 });
  const drag = useRef<{ startX: number; startY: number; lastT: number } | null>(null);
  const raf = useRef(0);

  const paint = () => {
    const { x, y } = state.current;
    card.current?.style.setProperty('transform', `translate(${x}px, ${y}px) rotate(${x / 18}deg)`);
  };

  const release = () => {
    if (reduced) {
      state.current = { x: 0, y: 0, vx: 0, vy: 0 };
      paint();
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      state.current = stepSpring(state.current, SPRING, (now - last) / 1000);
      last = now;
      if (isAtRest(state.current)) {
        state.current = { x: 0, y: 0, vx: 0, vy: 0 };
        paint();
        return;
      }
      paint();
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    cancelAnimationFrame(raf.current);
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX - state.current.x,
      startY: e.clientY - state.current.y,
      lastT: performance.now(),
    };
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const nx = e.clientX - d.startX;
    const ny = e.clientY - d.startY;
    const dt = Math.max((now - d.lastT) / 1000, 1 / 240);
    state.current = {
      x: nx,
      y: ny,
      vx: (nx - state.current.x) / dt,
      vy: (ny - state.current.y) / dt,
    };
    d.lastT = now;
    paint();
  };

  const onUp = () => {
    if (!drag.current) return;
    drag.current = null;
    release();
  };

  return (
    <div className="stage stage--drag">
      <div
        ref={card}
        className="drag-card"
        role="img"
        aria-label="Draggable card. Drag it with a mouse or finger and let go to see it spring back."
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <span aria-hidden="true">Drag me</span>
      </div>
    </div>
  );
}
