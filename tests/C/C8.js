async function runTest(page) {
  const c8Deux = await page.$('.C8 .item.deux');
  const c8Item = await page.$('.C8 .item');
  if (!c8Deux || !c8Item) {
    return { pass: false, message: 'Éléments non trouvés' };
  }
  const grow = await c8Deux.evaluate((el) => window.getComputedStyle(el).flexGrow);
  const minWidth = await c8Item.evaluate((el) => window.getComputedStyle(el).minWidth);
  const ok = grow === '2' && minWidth !== '0px' && minWidth !== 'auto';
  return { pass: ok, message: '.deux flex-grow 2 + min-width sur items' };
}

module.exports = { runTest };
