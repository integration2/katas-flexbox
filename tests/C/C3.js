const { checkFlexShorthand } = require('../helpers');

async function runTest(page) {
  return checkFlexShorthand(page, '.C3 .item', 'C3', { grow: '0', basis: 'auto' });
}

module.exports = { runTest };
