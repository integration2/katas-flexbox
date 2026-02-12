#!/usr/bin/env node
/**
 * Run a single autograding test.
 * Usage: node tests/run.js <exerciseId>
 * Example: node tests/run.js A1
 * Exit: 0 on pass, 1 on fail
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const exerciseId = process.argv[2];
if (!exerciseId || !/^[A-D][0-9]+$/.test(exerciseId)) {
  console.error('Usage: node tests/run.js <exerciseId>');
  console.error('Example: node tests/run.js A1');
  process.exit(2);
}

const category = exerciseId[0];
const testFile = path.join(__dirname, category, `${exerciseId}.js`);

let testModule;
try {
  testModule = require(testFile);
} catch (err) {
  console.error(`Test module not found: ${testFile}`);
  process.exit(2);
}

const BASE_URL = pathToFileURL(path.join(process.cwd(), 'index.html')).href;

async function run() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    const result = await testModule.runTest(page);
    await browser.close();

    if (result.pass) {
      console.log(`✓ ${exerciseId}: ${result.message}`);
      process.exit(0);
    } else {
      console.error(`✗ ${exerciseId}: ${result.message}`);
      process.exit(1);
    }
  } catch (err) {
    if (browser) await browser.close();
    console.error(`Erreur ${exerciseId}: ${err.message}`);
    process.exit(1);
  }
}

run();
