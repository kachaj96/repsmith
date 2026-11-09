// Repsmith brand geometry: the single source for every logo asset (icons/, favicon, launcher icons, in-app mark, start screen).
// Traced from the approved reference (three slanted bars crossed by a diagonal, white on a copper tile) and rebuilt from real geometry:
// four capsules (round-capped strokes). Same tile, radius, timeline and construction as Runsmith. Coordinates are on a 1024 tile;
// the reference is mapped onto it by (x - cx) * K + 512.
export const BRAND = {
  name: 'Repsmith',
  tile: '#9C421D',          // copper of the approved logo (the UI accent in app.css stays as it is)
  radius: 229,              // 22.4 % of the tile, as in Runsmith
  glyphColor: '#FFFFFF',
};
const K = 0.947, CX = 626.5, CY = 631.5;
const m = (x, y) => `${+((x - CX) * K + 512).toFixed(1)} ${+((y - CY) * K + 512).toFixed(1)}`;
const r = v => +(v * K).toFixed(1);

// three bars lean 15 degrees; the diagonal rises to the right at about 14 degrees
// (fitted to the reference by least squares on the white pixels: IoU 0.977)
const BAR_TOP = [523.5, 704.2, 886.7], BAR_BOT = [396, 580.7, 763.2], BAR_Y = [399, 864.5];
const BAR_W = r(98.5), DIAG_W = r(85);
const DIAG = [[275, 730.5], [977, 557.5]];

/** Parts of the symbol in the order they appear on the start screen: the bars one by one, the diagonal last. */
export const PARTS = [
  ...BAR_TOP.map((x, i) => ({ id: `bar${i + 1}`, kind: 'stroke', w: BAR_W, d: `M${m(x, BAR_Y[0])}L${m(BAR_BOT[i], BAR_Y[1])}` })),
  { id: 'diag', kind: 'stroke', w: DIAG_W, d: `M${m(...DIAG[0])}L${m(...DIAG[1])}` },
];
/** Bounding box of the symbol on the tile (x0, y0, x1, y1). */
const [bx0, by0] = m(DIAG[0][0] - 43, 349.5).split(' ').map(Number); const [bx1, by1] = m(DIAG[1][0] + 43, 914).split(' ').map(Number);
export const BBOX = [bx0, by0, bx1, by1];

export const partMarkup = (p, color = BRAND.glyphColor, extra = '') =>
  p.kind === 'fill' ? `<path ${extra}fill="${color}" d="${p.d}"/>` : `<path ${extra}fill="none" stroke="${color}" stroke-width="${p.w}" stroke-linecap="round" d="${p.d}"/>`;
export const glyphMarkup = (color = BRAND.glyphColor) => PARTS.map(p => partMarkup(p, color)).join('');

/** The glyph fitted into the adaptive-icon safe zone: its bounding circle gets the given diameter (fraction of the 108 dp canvas), centred. */
export function safeGlyph(color = BRAND.glyphColor, diameter = 0.6) {
  const w = BBOX[2] - BBOX[0], h = BBOX[3] - BBOX[1], diag = Math.hypot(w, h);
  const s = (1024 * diameter) / diag;
  const cx = (BBOX[0] + BBOX[2]) / 2, cy = (BBOX[1] + BBOX[3]) / 2;
  return `<g transform="translate(512 512) scale(${+s.toFixed(4)}) translate(${-+cx.toFixed(1)} ${-+cy.toFixed(1)})">${glyphMarkup(color)}</g>`;
}

const open = (extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"${extra}>`;
export const svgs = {
  logo: () => `${open(' role="img" aria-label="Repsmith"')}<rect width="1024" height="1024" rx="${BRAND.radius}" fill="${BRAND.tile}"/>${glyphMarkup()}</svg>\n`,
  glyph: () => `${open()}${glyphMarkup()}</svg>\n`,
  mono: () => `${open()}${glyphMarkup('#000000')}</svg>\n`,
  mark: () => `${open()}${glyphMarkup(BRAND.tile)}</svg>\n`,
  foreground: () => `${open()}${safeGlyph()}</svg>\n`,
  monochrome: () => `${open()}${safeGlyph('#000000')}</svg>\n`,
  background: () => `${open()}<rect width="1024" height="1024" fill="${BRAND.tile}"/></svg>\n`,
  round: () => `${open()}<circle cx="512" cy="512" r="512" fill="${BRAND.tile}"/>${safeGlyph(BRAND.glyphColor, 0.62)}</svg>\n`,
  /** Web app maskable icon: a full-bleed tile, the symbol inside the 80 % safe area. */
  maskable: () => `${open()}<rect width="1024" height="1024" fill="${BRAND.tile}"/>${safeGlyph(BRAND.glyphColor, 0.72)}</svg>\n`,
};

/* ---- Start screen: same timeline as Runsmith. Each part is revealed by a thick stroke drawn along its own axis. ---- */
const along = (a, b, over = 70) => {   // a line a->b (reference coords) extended by `over` at both ends
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  return `M${m(a[0] - ux * over, a[1] - uy * over)}L${m(b[0] + ux * over, b[1] + uy * over)}`;
};
const REVEAL = {
  ...Object.fromEntries(BAR_TOP.map((x, i) => [`bar${i + 1}`, [{ d: along([x, BAR_Y[0]], [BAR_BOT[i], BAR_Y[1]]), w: r(140), delay: 300 + i * 130, dur: 300 }]])),
  diag: [{ d: along(DIAG[0], DIAG[1]), w: r(140), delay: 760, dur: 280 }],
};
export const TIMELINE = { tile: 420, symbolStart: 300, symbolEnd: 1040, wordmark: [940, 300], holdUntil: 1600, fade: 260 };

export function splashSvg() {
  const masks = PARTS.map(p => `<mask id="sp-m-${p.id}" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024">${REVEAL[p.id].map(v =>
    `<path class="sp-rv" pathLength="1" fill="none" stroke="#fff" stroke-width="${v.w}" style="--d:${v.delay}ms;--t:${v.dur}ms" d="${v.d}"/>`).join('')}</mask>`).join('');
  const body = PARTS.map(p => `<g mask="url(#sp-m-${p.id})">${partMarkup(p)}</g>`).join('');
  return `<svg class="sp-tile" viewBox="0 0 1024 1024" aria-hidden="true" focusable="false"><defs>${masks}</defs><rect width="1024" height="1024" rx="${BRAND.radius}" fill="${BRAND.tile}"/>${body}</svg>`;
}
