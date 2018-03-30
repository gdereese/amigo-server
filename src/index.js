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

server.listen(process.address, process.port, () => {
  console.log(
    `amigo-server listening on ${server.address().address}:${
      server.address().port
    } (Ctrl+C to stop)...`
  );
});

module.exports = amigoServer;
