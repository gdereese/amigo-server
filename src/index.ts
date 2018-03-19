import * as program from 'commander';

import { AmigoServer } from './amigo-server';

program
  .option('-p, --port <n>', 'Port to listen on', parseInt)
  .parse(process.argv);

console.log();

if (!program.port) {
  console.error('ERROR: No listen port was specified.');
  console.log();

  process.exit(1);
}

const server = new AmigoServer();
server.start(program.port, '127.0.0.1', () => {
  console.log(
    `amigo-server listening on ${server.server.address().address}:${
      server.server.address().port
    } (Ctrl+C to stop)...`
  );
});

export { AmigoServer };
