const fortune = require('fortune');

const configProvider = require('../configuration/config-provider');
const record = require('../../src/data/record-types');

function datastoreProvider() {
  const config = configProvider.getConfig();

  let options = {};

  if (config && config.datastore) {
    options.adapter = [];

    const adapterClass = config.datastore.module
      ? require(config.datastore.module)
      : null;
    options.adapter.push(adapterClass);

    options.adapter.push(config.datastore.options);
  }

  const store = fortune(record.types, options);

  return store;
}

module.exports = datastoreProvider;
