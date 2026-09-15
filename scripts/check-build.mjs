import { access, readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const root = new URL('../dist/client/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
  .map((match) => match[1]).filter((path) => !/^(?:https?:|mailto:|tel:)/.test(path));
assert.ok(assets.some((path) => path.endsWith('.js')), 'Expected bundled JavaScript');
assert.ok(assets.some((path) => path.endsWith('.css')), 'Expected bundled CSS');
for (const path of assets) await access(new URL(path.replace(/^\//, ''), root));
console.log('Build verified: page assets exist.');
