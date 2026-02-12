async function runTest(page) {
  const b1Marge = await page.$('.B1 .item.marge');
  if (!b1Marge) {
    return { pass: false, message: 'Élément .marge non trouvé' };
  }
  const mr = await b1Marge.evaluate((el) => window.getComputedStyle(el).marginRight);
  const ok = mr === 'auto' || parseFloat(mr) > 100;
  return { pass: ok, message: `margin-right: ${mr} (auto ou grande valeur)` };
}

module.exports = { runTest };
