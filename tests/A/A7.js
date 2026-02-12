const { checkStyle } = require('../helpers');

async function runTest(page) {
  return checkStyle(page, '.ctnFlex.A7', 'alignContent', 'space-between', 'A7');
}

module.exports = { runTest };
