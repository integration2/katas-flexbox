const { checkWidthRatio } = require('../helpers');

async function runTest(page) {
  return checkWidthRatio(page, '.C6 .item', 3, 'C6');
}

module.exports = { runTest };
