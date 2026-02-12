async function runTest(page) {
  const a5Container = await page.$('.ctnFlex.A5');
  if (!a5Container) {
    return { pass: false, message: 'Conteneur non trouvé' };
  }
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
  return { pass: ok, message: 'wrap + justify + items (basis ~80px, marge)' };
}

module.exports = { runTest };
