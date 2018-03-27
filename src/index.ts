#!/usr/bin/env node

import * as program from 'commander';

import { AmigoServer } from './amigo-server';
import { ListenerSettings } from './configuration/listener-settings';
import { Settings } from './configuration/settings';

program
  .option('-p, --port <n>', 'Port to listen on', parseInt)
  .parse(process.argv);

console.log();

const server = new AmigoServer({
  datastoreModule: './stores//in-memory/in-memory-datastore',
  listener: {
    port: program.port
  }
});

server.start((address: string, port: number) => {
  console.log(
    `amigo-server listening on ${address}:${port} (Ctrl+C to stop)...`
  );
});

export { AmigoServer };
