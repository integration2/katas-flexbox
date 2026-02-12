async function runTest(page) {
  const b2 = await page.$('.ctnFlex.B2');
  if (!b2) {
    return { pass: false, message: 'Conteneur non trouvé' };
  }
  const jc = await b2.evaluate((el) => window.getComputedStyle(el).justifyContent);
  const ai = await b2.evaluate((el) => window.getComputedStyle(el).alignItems);
  const ok = jc === 'center' && ai === 'center';
  return { pass: ok, message: 'justify/align center' };
}

module.exports = { runTest };
