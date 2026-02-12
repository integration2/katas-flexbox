const { checkStyle } = require('../helpers');

async function runTest(page) {
  return checkStyle(page, '.ctnFlex.A6', 'alignContent', 'flex-start', 'A6');
}

module.exports = { runTest };
