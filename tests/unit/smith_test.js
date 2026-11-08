/* Smith Design System v1: Repsmith's own tokens must equal the family reference (smith-design-system-v1/smith-tokens-v1.css). */
const fs = require('fs'), path = require('path'); const A = p => path.join(__dirname, '../..', p);
let P = 0, F = 0; const ok = (c, m) => { if (c) P++; else { F++; console.log('FAIL', m); } };
const ref = fs.readFileSync(A('smith-design-system-v1/smith-tokens-v1.css'), 'utf8'), css = fs.readFileSync(A('app.css'), 'utf8');
const vars = (src, sel, prefix) => { const i = src.indexOf(sel); if (i < 0) throw new Error('no block ' + sel); const body = src.slice(src.indexOf('{', i) + 1, src.indexOf('}', i)); return Object.fromEntries([...body.matchAll(new RegExp(`--${prefix}([\\w-]+):\\s*([^;]+);`, 'g'))].map(m => [m[1], m[2].trim()])); };
const norm = v => v.toLowerCase().replace(/\s+/g, '');
const light = { ...vars(ref, ':root,', 'smith-'), ...vars(ref, '[data-smith-product="repsmith"] {', 'smith-') };
const dark = { ...light, ...vars(ref, '[data-smith-theme="dark"] {', 'smith-'), ...vars(ref, '[data-smith-product="repsmith"][data-smith-theme="dark"]', 'smith-') };
const own = { light: vars(css, ':root {\n  --bg', ''), dark: { ...vars(css, ':root {\n  --bg', ''), ...vars(css, '@media (prefers-color-scheme: dark) {\n  :root {', '') } };
const MAP = { bg: 'bg', surface: 'surface', 'surface-muted': 'field', 'surface-elevated': 'raised', text: 'text', 'text-secondary': 'muted', 'border-subtle': 'line', 'border-strong': 'edge', positive: 'ok', 'positive-soft': 'ok-soft', danger: 'error', 'danger-soft': 'error-soft', warning: 'warn', 'warning-soft': 'warn-soft', glass: 'glass', scrim: 'scrim', shadow: 'shadow', accent: 'accent', 'accent-soft': 'accent-soft', 'on-accent': 'on-accent' };
for (const [theme, want] of [['light', light], ['dark', dark]]) for (const [s, o] of Object.entries(MAP)) {
  ok(want[s] !== undefined, `--smith-${s} in the reference`);
  ok(own[theme][o] !== undefined && norm(own[theme][o]) === norm(want[s]), `${theme} --${o} = ${own[theme][o]}, reference --smith-${s} = ${want[s]}`);
  ok(css.includes(`--smith-${s}: var(--${o})`), `alias --smith-${s} -> --${o}`);
}
ok(fs.readFileSync(A('index.html'), 'utf8').includes('data-smith-product="repsmith"'), 'page names the product');
console.log(`smith tests: ${P} pass, ${F} fail`); process.exit(F ? 1 : 0);
