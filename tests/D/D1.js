async function runTest(page) {
  const d1Second = await page.$('.D1 .item:nth-child(2)');
  if (!d1Second) {
    return { pass: false, message: 'Éléments non trouvés' };
  }
  const alignSelf = await d1Second.evaluate((el) => window.getComputedStyle(el).alignSelf);
  const marginLeft = await d1Second.evaluate((el) => window.getComputedStyle(el).marginLeft);
  const order = await d1Second.evaluate((el) => window.getComputedStyle(el).order);
  const ok = alignSelf === 'flex-end' && (marginLeft === 'auto' || parseInt(order) >= 1);
  return { pass: ok, message: 'Item 2 en bas à droite' };
}

module.exports = { runTest };
