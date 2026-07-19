// One-off setup script: creates the Kit custom fields and tags this project depends on.
// Usage: KIT_API_KEY=xxx node scripts/setup-kit.mjs
// (or put KIT_API_KEY=xxx in a .env file in this folder or the repo root)

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function loadDotEnvIfNeeded() {
  if (process.env.KIT_API_KEY) return;
  for (const path of [join(process.cwd(), '.env'), join(process.cwd(), '..', '.env')]) {
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
    }
  }
}

loadDotEnvIfNeeded();

const KIT_API_KEY = process.env.KIT_API_KEY;
if (!KIT_API_KEY) {
  console.error('KIT_API_KEY not set. Set it in the environment or in a .env file, then re-run.');
  process.exit(1);
}

const KIT_API_BASE = 'https://api.kit.com/v4';

async function kitFetch(path, options = {}) {
  const res = await fetch(`${KIT_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': KIT_API_KEY,
      ...(options.headers || {})
    }
  });
  return res;
}

const TAGS = [
  'track:come-home-to-yourself',
  'track:regional-business-leader',
  'track:design-led-practitioner',
  'track:design-led-leader',
  'stage:diagnostic-complete',
  'stage:nurture-active',
  'stage:program-interested',
  'stage:program-purchased',
  'stage:coming-soon'
];

// first_name is a built-in Kit subscriber attribute, not a custom field — skipped deliberately.
const CUSTOM_FIELDS = [
  { label: 'Why Statement', note: 'their Why Statement / Business Why Statement text' },
  { label: 'Next Move', note: 'the one action they named' },
  { label: 'Business Name', note: 'Maffra form' },
  { label: 'Day Goal', note: 'Maffra form — what they want the day to fix/figure out' },
  { label: 'Accessibility Notes', note: 'Maffra form — dietary/accessibility notes' },
  { label: 'Named Pattern', note: 'for the Design-Led diagnostics later' }
];

async function ensureTags() {
  const listRes = await kitFetch('/tags');
  if (!listRes.ok) throw new Error(`Failed to list tags: ${listRes.status} ${await listRes.text()}`);
  const existing = new Set((await listRes.json()).tags.map(t => t.name));

  for (const name of TAGS) {
    if (existing.has(name)) {
      console.log(`  tag exists:   ${name}`);
      continue;
    }
    const createRes = await kitFetch('/tags', { method: 'POST', body: JSON.stringify({ name }) });
    if (!createRes.ok) {
      console.error(`  tag FAILED:   ${name} (${createRes.status} ${await createRes.text()})`);
      continue;
    }
    console.log(`  tag created:  ${name}`);
  }
}

async function ensureCustomFields() {
  const listRes = await kitFetch('/custom_fields');
  if (!listRes.ok) throw new Error(`Failed to list custom fields: ${listRes.status} ${await listRes.text()}`);
  const existing = new Set((await listRes.json()).custom_fields.map(f => f.label.toLowerCase()));

  for (const { label, note } of CUSTOM_FIELDS) {
    if (existing.has(label.toLowerCase())) {
      console.log(`  field exists: ${label}`);
      continue;
    }
    const createRes = await kitFetch('/custom_fields', { method: 'POST', body: JSON.stringify({ label }) });
    if (!createRes.ok) {
      console.error(`  field FAILED: ${label} (${createRes.status} ${await createRes.text()})`);
      continue;
    }
    const created = await createRes.json();
    console.log(`  field created:${' '}${label} → key "${created.custom_field.name}" (${note})`);
  }
}

console.log('Custom fields:');
await ensureCustomFields();
console.log('\nTags:');
await ensureTags();
console.log('\nDone. first_name was skipped — it\'s a built-in Kit attribute, not a custom field.');
