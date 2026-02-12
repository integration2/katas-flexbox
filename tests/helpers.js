/**
 * Shared test helpers for Katas Flexbox autograding
 */

async function checkStyle(page, selector, property, expectedValues, exercise) {
  const el = await page.$(selector);
  if (!el) {
    return { pass: false, message: `Élément non trouvé: ${selector}` };
  }
  const value = await el.evaluate((el, prop) => window.getComputedStyle(el)[prop], property);
  const normalized = value.trim().toLowerCase();
  const expected = Array.isArray(expectedValues) ? expectedValues : [expectedValues];
  const match = expected.some((exp) => normalized.includes(exp.toLowerCase()));
  return { pass: match, message: `${property}: ${value} (attendu: ${expected.join(' ou ')})` };
}

async function checkFlexShorthand(page, selector, exercise, expected) {
  const el = await page.$(selector);
  if (!el) {
    return { pass: false, message: `Élément non trouvé: ${selector}` };
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
  return { pass: ok, message: `flex: ${style.grow} ${style.shrink} ${style.basis} (attendu: ${JSON.stringify(expected)})` };
}

async function checkWidthRatio(page, selector, count, exercise, tolerance = 0.15) {
  const elements = await page.$$(selector);
  if (elements.length < count) {
    return { pass: false, message: `Seulement ${elements.length} éléments trouvés` };
  }
  const widths = await Promise.all(
    elements.slice(0, count).map((el) => el.evaluate((e) => e.getBoundingClientRect().width))
  );
  const avg = widths.reduce((a, b) => a + b, 0) / count;
  const allSimilar = widths.every((w) => Math.abs(w - avg) / avg < tolerance);
  return { pass: allSimilar, message: `Largeurs: ${widths.map((w) => Math.round(w)).join('px, ')}px (doivent être similaires)` };
}

module.exports = { checkStyle, checkFlexShorthand, checkWidthRatio };
