const { checkFlexShorthand } = require('../helpers');

async function runTest(page) {
  return checkFlexShorthand(page, '.C5 .item', 'C5', { grow: '0', basis: '0px' });
}

module.exports = { runTest };
