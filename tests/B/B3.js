async function runTest(page) {
  const b3Item = await page.$('.B3 .item');
  if (!b3Item) {
    return { pass: false, message: 'Item non trouvé' };
  }
  const ml = await b3Item.evaluate((el) => window.getComputedStyle(el).marginLeft);
  const mr = await b3Item.evaluate((el) => window.getComputedStyle(el).marginRight);
  const mlOk = ml === 'auto' || parseFloat(ml) > 50;
  const mrOk = mr === 'auto' || parseFloat(mr) > 50;
  const ok = mlOk && mrOk;
  return { pass: ok, message: `margin auto (left: ${ml}, right: ${mr})` };
}

module.exports = { runTest };
