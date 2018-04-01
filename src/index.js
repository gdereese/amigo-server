#!/usr/bin/env node

const program = require('commander');
const restify = require('restify');

const amigoServer = require('./amigo-server');

program
  .option('-a, --address <a>', 'Address to listen on', '127.0.0.1')
  .option('-p, --port <n>', 'Port to listen on', parseInt)
  .parse(process.argv);

console.log();

const server = restify.createServer();

// TODO: load settings and merge with defaults
const settings = {};

amigoServer(server, settings);

server.listen(program.port, program.address, () => {
  console.log(`amigo-server listening at ${server.url} (Ctrl+C to stop)...`);
});

module.exports = amigoServer;
