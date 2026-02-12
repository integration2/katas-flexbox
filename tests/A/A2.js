const { checkStyle } = require('../helpers');

async function runTest(page) {
  return checkStyle(page, '.ctnFlex.A2', 'flexDirection', 'row-reverse', 'A2');
}

module.exports = { runTest };
