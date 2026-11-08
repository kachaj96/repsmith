#!/usr/bin/env node
// Runs every unit test in tests/unit and fails when any of them fails (tests/run.sh only prints them).
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'tests', 'unit');
let failed = 0;
for (const f of readdirSync(dir).filter(n => n.endsWith('.js')).sort()) {
  const r = spawnSync(process.execPath, [join(dir, f)], { encoding: 'utf8' });
  const last = (r.stdout || '').trim().split('\n').pop();
  console.log(`${r.status === 0 ? 'ok  ' : 'FAIL'} ${f}: ${last}`);
  if (r.status !== 0) { failed++; process.stdout.write(r.stdout + r.stderr); }
}
process.exit(failed ? 1 : 0);
