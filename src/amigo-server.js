const restify = require('restify');

const configProvider = require('./configuration/config-provider');
const datastoreProvider = require('./data/datastore-provider');
const friendModule = require('./modules/friend-module');
const friendRequestModule = require('./modules/friend-request-module');

function amigoServer(server, config) {
  configProvider.setConfig(config);

  // register global pre-module handlers
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());

  const store = config.store || datastoreProvider();

  // register modules
  friendModule(server, store, '/friend');
  friendRequestModule(server, store, '/request');
}

module.exports = amigoServer;
