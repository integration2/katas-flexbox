const { checkFlexShorthand } = require('../helpers');

async function runTest(page) {
  return checkFlexShorthand(page, '.C4 .item', 'C4', { grow: '0', shrink: '0' });
}

module.exports = { runTest };
