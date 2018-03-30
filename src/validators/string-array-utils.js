const _ = require('lodash');

function isIn(strings, value) {
  return _.some(
    strings,
    s => (s || '').toLocaleLowerCase() === (value || '').toLocaleLowerCase()
  );
}

module.exports = {
  isIn
};
