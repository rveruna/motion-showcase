# Motion Showcase

[![CI](https://github.com/rveruna/motion-showcase/actions/workflows/ci.yml/badge.svg)](https://github.com/rveruna/motion-showcase/actions/workflows/ci.yml)

**[Live demo](https://rveruna.github.io/motion-showcase/)**

Four small interface animations in React and TypeScript, built without an animation library.

| Demo | How it works |
| --- | --- |
| Spring drag | Pointer events, plus a damped spring (`src/hooks/spring.ts`) integrated every frame. Release velocity carries into the spring, so it overshoots. |
| Staggered entrance | One CSS keyframe with a per-row `animation-delay`. React only re-keys the list to replay it. |
| Path drawing | SVG `stroke-dashoffset` with `pathLength="1"`, so nothing is measured in JavaScript. |
| Scroll reveal | `IntersectionObserver` that unobserves after the first reveal. Only `opacity` and `transform` animate. |

## Decisions worth a look

- **Reduced motion is respected.** CSS turns the keyframes off, and the spring snaps back instead of bouncing when `prefers-reduced-motion` is set. The page reads the setting live with `useSyncExternalStore`.
- **Compositor-friendly properties only.** No animating `top`, `left`, `width` or `height`, so there is no layout work per frame.
- **Physics is a pure function.** `stepSpring` has no DOM in it and is unit-tested: it settles, it overshoots, and it stays stable after a dropped frame.
- **Accessible by default.** Visible focus rings, 44px touch targets, a keyboard-reachable scroll region, and a dark theme that follows the OS.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm test
npm run lint
npm run format
```

## Not done

- The drag demo is pointer-only. A keyboard user can't move the card, and its label says so rather than pretending otherwise.
- No visual regression tests. Motion is checked by eye and by the unit tests on the maths.
