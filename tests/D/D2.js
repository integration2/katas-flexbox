async function runTest(page) {
  const d2 = await page.$('.ctnFlex.D2');
  if (!d2) {
    return { pass: false, message: 'Conteneur non trouvé' };
  }
  const flexWrap = await d2.evaluate((el) => window.getComputedStyle(el).flexWrap);
  const header = await page.$('.D2 .header');
  const main = await page.$('.D2 .main');
  const headerWidth = header ? await header.evaluate((el) => window.getComputedStyle(el).width) : '';
  const mainFlex = main ? await main.evaluate((el) => window.getComputedStyle(el).flexGrow) : '';
  const ok = flexWrap === 'wrap' && parseFloat(headerWidth) >= 400 && parseFloat(mainFlex) >= 1;
  return { pass: ok, message: 'Layout avec wrap, header/footer pleine largeur, main flex' };
}

module.exports = { runTest };
