const { checkFlexShorthand } = require('../helpers');

async function runTest(page) {
  return checkFlexShorthand(page, '.C2 .item', 'C2', { grow: '1', basis: '0px' });
}

module.exports = { runTest };
