#!/usr/bin/env node
// Copies the web app (the same files GitHub Pages serves) into www/ for Capacitor. No bundling, no changes to the files.
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'www');
const FILES = ['index.html', 'app.css', 'app.js', 'bodymap.js', 'plans.js', 'blocks.js', 'gear.js', 'hevy.js', 'coach.js', 'runs.js', 'sw.js', 'manifest.webmanifest'];
const DIRS = ['data', 'icons', 'fonts'];
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of FILES) { if (!existsSync(join(root, f))) throw new Error(`missing ${f}`); cpSync(join(root, f), join(out, f)); }
for (const d of DIRS) cpSync(join(root, d), join(out, d), { recursive: true });
console.log(`www/ ready: ${FILES.length} files, ${DIRS.join(', ')}`);
