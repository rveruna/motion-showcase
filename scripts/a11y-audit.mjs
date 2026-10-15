// Runs axe-core (WCAG 2.0 to 2.2, A and AA rules) in a real browser against the built page, in light and
// dark, phone and desktop, reduced motion, after replaying the animations and with the scroll-reveal cards
// revealed. Animations are left to finish first: axe measures contrast on what is painted, so a half-faded
// element would be a false failure. Fails on any violation.
// Usage: npm run a11y-audit   (builds first)
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', 'dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  const target = fs.existsSync(file) && fs.statSync(file).isFile() ? file : path.join(root, 'index.html');
  res.writeHead(200, { 'content-type': types[path.extname(target)] ?? 'application/octet-stream' });
  fs.createReadStream(target).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}/`;

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const desktop = { viewport: { width: 1280, height: 900 } };
const phone = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true };

const revealCards = async (page) => {
  await page.locator('.stage--scroll').evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await page.waitForTimeout(900);
};

const scenarios = [
  { name: 'desktop, light', ctx: { ...desktop, colorScheme: 'light' } },
  { name: 'desktop, dark', ctx: { ...desktop, colorScheme: 'dark' } },
  { name: 'phone, light', ctx: { ...phone, colorScheme: 'light' } },
  { name: 'phone, dark', ctx: { ...phone, colorScheme: 'dark' } },
  { name: 'desktop, reduced motion', ctx: { ...desktop, reducedMotion: 'reduce' } },
  {
    name: 'desktop, animations replayed',
    ctx: desktop,
    setup: async (page) => {
      for (const b of await page.getByRole('button', { name: 'Replay' }).all()) await b.click();
      await page.waitForTimeout(1500);
    },
  },
  {
    name: 'desktop, light, scroll-reveal cards shown',
    ctx: { ...desktop, colorScheme: 'light' },
    setup: revealCards,
  },
  {
    name: 'phone, dark, scroll-reveal cards shown',
    ctx: { ...phone, colorScheme: 'dark' },
    setup: revealCards,
  },
];

const browser = await chromium.launch();
let violations = 0;

for (const s of scenarios) {
  const context = await browser.newContext(s.ctx);
  const page = await context.newPage();
  await page.goto(base);
  await page.waitForSelector('h1');
  await page.waitForTimeout(1500); // let entrance animations finish
  await s.setup?.(page);
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  violations += results.violations.length;
  console.log(`${results.violations.length === 0 ? 'PASS' : 'FAIL'}  ${s.name}`);
  for (const v of results.violations) {
    console.log(
      `   - ${v.id}: ${v.help} [${v.impact}] (${v.nodes.length} element${v.nodes.length === 1 ? '' : 's'})`,
    );
    for (const n of v.nodes.slice(0, 3)) console.log(`       ${n.target.join(' ')}`);
  }
  await context.close();
}

await browser.close();
server.close();
console.log(`\n${violations} violations across ${scenarios.length} scenarios`);
process.exit(violations === 0 ? 0 : 1);
