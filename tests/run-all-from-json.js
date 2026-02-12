#!/usr/bin/env node
/**
 * Run all tests from autograding.json.
 * Used by the workflow to execute each test and report results.
 */

const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const autogradingPath = path.join(__dirname, '../.github/classroom/autograding.json');
const config = JSON.parse(fs.readFileSync(autogradingPath, 'utf-8'));

let passed = 0;
let failed = 0;
const failures = [];

for (const test of config.tests) {
  const match = test.run.match(/node tests\/run\.js ([A-D][0-9]+)/);
  const exerciseId = match ? match[1] : null;

  if (!exerciseId) {
    console.error(`Skipping ${test.name}: could not extract exercise ID from run command`);
    failed++;
    failures.push(test.name);
    continue;
  }

  process.stdout.write(`Running ${test.name}... `);

  const result = spawnSync('node', ['tests/run.js', exerciseId], {
    encoding: 'utf-8',
    stdio: ['inherit', 'pipe', 'pipe']
  });

  if (result.status === 0) {
    passed++;
    console.log('✓');
  } else {
    failed++;
    failures.push(test.name);
    console.log('✗');
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

console.log(`\n--- Résumé ---`);
console.log(`${passed} réussi(s) / ${config.tests.length} total`);
if (failed > 0) {
  console.log(`Échecs: ${failures.join(', ')}`);
  process.exit(1);
}
process.exit(0);
