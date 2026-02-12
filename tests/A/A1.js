const { checkStyle } = require('../helpers');

async function runTest(page) {
  return checkStyle(page, '.ctnFlex.A1', 'justifyContent', 'flex-end', 'A1');
}

module.exports = { runTest };
