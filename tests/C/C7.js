const { checkStyle } = require('../helpers');

async function runTest(page) {
  return checkStyle(page, '.C7 .item.deux', 'flexGrow', '2', 'C7');
}

module.exports = { runTest };
