import { isAtRest, stepSpring, type SpringState } from './spring';

const config = { stiffness: 180, damping: 14 };

function simulate(start: SpringState, seconds: number, dt = 1 / 60) {
  let s = start;
  for (let t = 0; t < seconds; t += dt) s = stepSpring(s, config, dt);
  return s;
}

describe('stepSpring', () => {
  it('settles at the origin after being released', () => {
    const end = simulate({ x: 120, y: -80, vx: 0, vy: 0 }, 4);
    expect(isAtRest(end)).toBe(true);
  });

  it('overshoots before settling (underdamped), which is what makes it feel springy', () => {
    let s: SpringState = { x: 100, y: 0, vx: 0, vy: 0 };
    let crossedZero = false;
    for (let i = 0; i < 240; i++) {
      s = stepSpring(s, config, 1 / 60);
      if (s.x < 0) crossedZero = true;
    }
    expect(crossedZero).toBe(true);
  });

  it('stays stable after a long dropped frame', () => {
    const s = stepSpring({ x: 100, y: 0, vx: 0, vy: 0 }, config, 2);
    expect(Math.abs(s.x)).toBeLessThan(100);
  });

  it('reports rest only when both position and speed are tiny', () => {
    expect(isAtRest({ x: 0, y: 0, vx: 0, vy: 0 })).toBe(true);
    expect(isAtRest({ x: 0, y: 0, vx: 50, vy: 0 })).toBe(false);
    expect(isAtRest({ x: 30, y: 0, vx: 0, vy: 0 })).toBe(false);
  });
});
