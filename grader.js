#!/usr/bin/env node
/**
 * Auto-grader for Katas Flexbox
 * Checks computed styles for each exercise using Playwright
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const BASE_URL = pathToFileURL(path.join(process.cwd(), 'index.html')).href;

const results = [];
let passed = 0;
let failed = 0;

function log(msg) {
  console.log(msg);
}

function addResult(exercise, success, message) {
  results.push({ exercise, success, message });
  if (success) {
    passed++;
    log(`  ✓ ${exercise}: ${message}`);
  } else {
    failed++;
    log(`  ✗ ${exercise}: ${message}`);
  }
}

async function checkStyle(page, selector, property, expectedValues, exercise) {
  const el = await page.$(selector);
  if (!el) {
    addResult(exercise, false, `Élément non trouvé: ${selector}`);
    return;
  }
  const value = await el.evaluate((el, prop) => window.getComputedStyle(el)[prop], property);
  const normalized = value.trim().toLowerCase();
  const expected = Array.isArray(expectedValues) ? expectedValues : [expectedValues];
  const match = expected.some((exp) => normalized.includes(exp.toLowerCase()));
  addResult(exercise, match, `${property}: ${value} (attendu: ${expected.join(' ou ')})`);
}

async function checkFlexShorthand(page, selector, exercise, expected) {
  const el = await page.$(selector);
  if (!el) {
    addResult(exercise, false, `Élément non trouvé: ${selector}`);
    return;
  }
  const style = await el.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return { grow: s.flexGrow, shrink: s.flexShrink, basis: s.flexBasis };
  });
  const match = expected.grow === undefined || style.grow === String(expected.grow);
  const shrinkMatch = expected.shrink === undefined || style.shrink === String(expected.shrink);
  const basisMatch =
    expected.basis === undefined ||
    style.basis === expected.basis ||
    style.basis === expected.basis + 'px' ||
    (expected.basis === '0px' && (style.basis === '0px' || style.basis === '0'));
  const ok = match && shrinkMatch && basisMatch;
  addResult(exercise, ok, `flex: ${style.grow} ${style.shrink} ${style.basis} (attendu: ${JSON.stringify(expected)})`);
}

async function checkWidthRatio(page, selector, count, exercise, tolerance = 0.15) {
  const elements = await page.$$(selector);
  if (elements.length < count) {
    addResult(exercise, false, `Seulement ${elements.length} éléments trouvés`);
    return;
  }
  const widths = await Promise.all(
    elements.slice(0, count).map((el) => el.evaluate((e) => e.getBoundingClientRect().width))
  );
  const avg = widths.reduce((a, b) => a + b, 0) / count;
  const allSimilar = widths.every((w) => Math.abs(w - avg) / avg < tolerance);
  addResult(exercise, allSimilar, `Largeurs: ${widths.map((w) => Math.round(w)).join('px, ')}px (doivent être similaires)`);
}

async function runTests() {
  log('\n=== Katas Flexbox - Auto-grading ===\n');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });

    // A1: justify-content flex-end
    await checkStyle(page, '.ctnFlex.A1', 'justifyContent', 'flex-end', 'A1');

    // A2: flex-direction row-reverse
    await checkStyle(page, '.ctnFlex.A2', 'flexDirection', 'row-reverse', 'A2');

    // A3: justify-content space-between
    await checkStyle(page, '.ctnFlex.A3', 'justifyContent', 'space-between', 'A3');

    // A4: justify-content space-around
    await checkStyle(page, '.ctnFlex.A4', 'justifyContent', 'space-around', 'A4');

    // A5: flex-wrap, justify-content, align-items, items with flex-basis 80px
    const a5Container = await page.$('.ctnFlex.A5');
    if (a5Container) {
      const flexWrap = await a5Container.evaluate((el) => window.getComputedStyle(el).flexWrap);
      const justifyContent = await a5Container.evaluate((el) => window.getComputedStyle(el).justifyContent);
      const alignItems = await a5Container.evaluate((el) => window.getComputedStyle(el).alignItems);
      const a5Item = await page.$('.A5 .item');
      const itemBasis = a5Item ? await a5Item.evaluate((el) => window.getComputedStyle(el).flexBasis) : '';
      const itemMargin = a5Item ? await a5Item.evaluate((el) => window.getComputedStyle(el).marginRight) : '';
      const basisOk = parseFloat(itemBasis) >= 79;
      const ok =
        flexWrap === 'wrap' &&
        (justifyContent === 'space-between' || justifyContent === 'space-evenly') &&
        (alignItems === 'flex-start' || alignItems === 'stretch') &&
        basisOk &&
        itemMargin !== '0px';
      addResult('A5', ok, `wrap + justify + items (basis ~80px, marge)`);
    } else {
      addResult('A5', false, 'Conteneur non trouvé');
    }

    // A6: align-content flex-start
    await checkStyle(page, '.ctnFlex.A6', 'alignContent', 'flex-start', 'A6');

    // A7: align-content space-between
    await checkStyle(page, '.ctnFlex.A7', 'alignContent', 'space-between', 'A7');

    // B1: .marge has margin-right auto (computed can be "auto" or resolved pixels)
    const b1Marge = await page.$('.B1 .item.marge');
    if (b1Marge) {
      const mr = await b1Marge.evaluate((el) => window.getComputedStyle(el).marginRight);
      const ok = mr === 'auto' || parseFloat(mr) > 100;
      addResult('B1', ok, `margin-right: ${mr} (auto ou grande valeur)`);
    } else {
      addResult('B1', false, 'Élément .marge non trouvé');
    }

    // B2: justify-content center, align-items center
    const b2 = await page.$('.ctnFlex.B2');
    if (b2) {
      const jc = await b2.evaluate((el) => window.getComputedStyle(el).justifyContent);
      const ai = await b2.evaluate((el) => window.getComputedStyle(el).alignItems);
      addResult('B2', jc === 'center' && ai === 'center', `justify/align center`);
    } else {
      addResult('B2', false, 'Conteneur non trouvé');
    }

    // B3: .item has margin auto (computed can be "auto" or resolved pixels)
    const b3Item = await page.$('.B3 .item');
    if (b3Item) {
      const ml = await b3Item.evaluate((el) => window.getComputedStyle(el).marginLeft);
      const mr = await b3Item.evaluate((el) => window.getComputedStyle(el).marginRight);
      const mlOk = ml === 'auto' || parseFloat(ml) > 50;
      const mrOk = mr === 'auto' || parseFloat(mr) > 50;
      addResult('B3', mlOk && mrOk, `margin auto (left: ${ml}, right: ${mr})`);
    } else {
      addResult('B3', false, 'Item non trouvé');
    }

    // C1: flex-basis 0
    await checkFlexShorthand(page, '.C1 .item', 'C1', { grow: '0', shrink: '1', basis: '0px' });

    // C2: flex-grow 1, flex-basis 0
    await checkFlexShorthand(page, '.C2 .item', 'C2', { grow: '1', basis: '0px' });

    // C3: flex-basis auto
    await checkFlexShorthand(page, '.C3 .item', 'C3', { grow: '0', basis: 'auto' });

    // C4: flex-shrink 0
    await checkFlexShorthand(page, '.C4 .item', 'C4', { grow: '0', shrink: '0' });

    // C5: flex 0 1 0 (min content)
    await checkFlexShorthand(page, '.C5 .item', 'C5', { grow: '0', basis: '0px' });

    // C6: equal widths (~1/3 each)
    await checkWidthRatio(page, '.C6 .item', 3, 'C6');

    // C7: .deux has flex-grow 2
    await checkStyle(page, '.C7 .item.deux', 'flexGrow', '2', 'C7');

    // C8: .deux flex-grow 2, all items have min-width
    const c8Deux = await page.$('.C8 .item.deux');
    const c8Item = await page.$('.C8 .item');
    if (c8Deux && c8Item) {
      const grow = await c8Deux.evaluate((el) => window.getComputedStyle(el).flexGrow);
      const minWidth = await c8Item.evaluate((el) => window.getComputedStyle(el).minWidth);
      addResult('C8', grow === '2' && minWidth !== '0px' && minWidth !== 'auto', '.deux flex-grow 2 + min-width sur items');
    } else {
      addResult('C8', false, 'Éléments non trouvés');
    }

    // D1: second item align-self flex-end, margin-left auto and/or order
    const d1Container = await page.$('.ctnFlex.D1');
    const d1Second = await page.$('.D1 .item:nth-child(2)');
    if (d1Container && d1Second) {
      const alignSelf = await d1Second.evaluate((el) => window.getComputedStyle(el).alignSelf);
      const marginLeft = await d1Second.evaluate((el) => window.getComputedStyle(el).marginLeft);
      const order = await d1Second.evaluate((el) => window.getComputedStyle(el).order);
      const justifyContent = await d1Container.evaluate((el) => window.getComputedStyle(el).justifyContent);
      addResult('D1', alignSelf === 'flex-end' && (marginLeft === 'auto' || parseInt(order) >= 1), 'Item 2 en bas à droite');
    } else {
      addResult('D1', false, 'Éléments non trouvés');
    }

    // D2: flex-wrap, header/footer full width, main flex-grow
    const d2 = await page.$('.ctnFlex.D2');
    if (d2) {
      const flexWrap = await d2.evaluate((el) => window.getComputedStyle(el).flexWrap);
      const header = await page.$('.D2 .header');
      const main = await page.$('.D2 .main');
      const headerWidth = header ? await header.evaluate((el) => window.getComputedStyle(el).width) : '';
      const mainFlex = main ? await main.evaluate((el) => window.getComputedStyle(el).flexGrow) : '';
      const ok = flexWrap === 'wrap' && parseFloat(headerWidth) >= 400 && parseFloat(mainFlex) >= 1;
      addResult('D2', ok, 'Layout avec wrap, header/footer pleine largeur, main flex');
    } else {
      addResult('D2', false, 'Conteneur non trouvé');
    }
  } catch (err) {
    log(`\nErreur: ${err.message}`);
    log('Vérifiez que index.html et katas.css existent dans le projet.');
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }

  log('\n--- Résumé ---');
  log(`${passed} exercice(s) réussi(s) / ${results.length} total`);
  if (failed > 0) {
    log(`\nÉchecs: ${results.filter((r) => !r.success).map((r) => r.exercise).join(', ')}`);
    process.exit(1);
  }
  log('\nTous les exercices sont corrects !');
  process.exit(0);
}

runTests();
