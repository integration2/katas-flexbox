const { checkStyle } = require('../helpers');

async function runTest(page) {
  return checkStyle(page, '.ctnFlex.A3', 'justifyContent', 'space-between', 'A3');
}

module.exports = { runTest };
