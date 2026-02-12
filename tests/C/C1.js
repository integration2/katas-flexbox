const { checkFlexShorthand } = require('../helpers');

async function runTest(page) {
  return checkFlexShorthand(page, '.C1 .item', 'C1', { grow: '0', shrink: '1', basis: '0px' });
}

module.exports = { runTest };
