export interface SpringState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
}

const REST_DISTANCE = 0.1;
const REST_SPEED = 0.1;

/**
 * One step of a damped spring pulling (x, y) toward (0, 0), integrated with semi-implicit Euler.
 * `dt` is in seconds and is clamped so a dropped frame cannot make the spring explode.
 */
export function stepSpring(s: SpringState, { stiffness, damping }: SpringConfig, dt: number): SpringState {
  const h = Math.min(dt, 1 / 30);
  const vx = s.vx + (-stiffness * s.x - damping * s.vx) * h;
  const vy = s.vy + (-stiffness * s.y - damping * s.vy) * h;
  return { x: s.x + vx * h, y: s.y + vy * h, vx, vy };
}

export function isAtRest(s: SpringState): boolean {
  return (
    Math.abs(s.x) < REST_DISTANCE &&
    Math.abs(s.y) < REST_DISTANCE &&
    Math.abs(s.vx) < REST_SPEED &&
    Math.abs(s.vy) < REST_SPEED
  );
}
