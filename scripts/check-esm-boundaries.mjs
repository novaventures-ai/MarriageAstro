#!/usr/bin/env node
/**
 * Static guard for the ESM/CommonJS boundary in api/.
 *
 * The Vercel serverless functions crashed at cold start (500 /
 * FUNCTION_INVOCATION_FAILED) four separate times because of ESM/CJS
 * mismatches that `npm run build` (Vite, frontend-only) never exercises.
 * This script encodes the invariants that keep api/mcp.ts (ESM) and
 * api/v1/* (CommonJS, so Vercel inlines their deps) loadable.
 *
 * Runs in CI with no deploy and no secrets.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function pkgType(rel) {
  const p = join(root, rel, 'package.json');
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8')).type || 'commonjs';
}

// 1. Directory module-type markers must be exactly these.
const expect = { api: 'module', 'api/v1': 'commonjs', lib: 'commonjs', src: 'commonjs' };
for (const [dir, want] of Object.entries(expect)) {
  const got = pkgType(dir);
  if (got !== want) errors.push(`${dir}/package.json type must be "${want}" (got ${got ?? 'missing'})`);
}

// 2. api/mcp.ts (ESM) must NOT import the CommonJS v1 handlers — that produces a
//    mixed bundle that dies with "Cannot use import statement outside a module".
const mcp = readFileSync(join(root, 'api/mcp.ts'), 'utf8');
if (/from ['"]\.\/v1\/_/.test(mcp)) {
  errors.push('api/mcp.ts imports api/v1/_* directly — call the v1 endpoint over HTTP instead');
}

// 3. api/v1/* (CommonJS) must not require ESM-scope api/ helpers, and the whole
//    CommonJS bundle (api/v1 + lib + src) must not import ESM-only packages.
const esmOnlyPkgs = ['uuid']; // add any dependency whose build is ESM-only
function walk(dir) {
  const out = [];
  for (const e of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...walk(join(dir, e.name)));
    else if (/\.tsx?$/.test(e.name)) out.push(join(dir, e.name));
  }
  return out;
}
for (const rel of [...walk('api/v1'), ...walk('lib')]) {
  const src = readFileSync(join(root, rel), 'utf8');
  if (/from ['"]\.\.\/_oauth-helper/.test(src)) {
    errors.push(`${rel} imports ../_oauth-helper (ESM scope) — use the CJS copy ./_oauth-helper`);
  }
  for (const pkg of esmOnlyPkgs) {
    if (new RegExp(`from ['"]${pkg}['"]`).test(src)) {
      errors.push(`${rel} imports ESM-only package "${pkg}" — it cannot be require()d from the CommonJS bundle`);
    }
  }
}

if (errors.length) {
  console.error('✗ ESM/CJS boundary check failed:\n' + errors.map(e => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log('✓ ESM/CJS boundary check passed');
