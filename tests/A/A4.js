const { checkStyle } = require('../helpers');

async function runTest(page) {
  return checkStyle(page, '.ctnFlex.A4', 'justifyContent', 'space-around', 'A4');
}

module.exports = { runTest };
