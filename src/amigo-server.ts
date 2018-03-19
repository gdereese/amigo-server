import * as restify from 'restify';
import { Server } from 'restify';

import * as FriendModule from './modules/friend-module';
import * as FriendRequestModule from './modules/friend-request-module';

export class AmigoServer {
  public server: Server;

  constructor() {
    this.server = restify.createServer();

    // register global pre-module handlers
    this.server.use(restify.plugins.queryParser());
    this.server.use(restify.plugins.bodyParser());

    // register modules
    FriendModule.register(this.server, '/friend');
    FriendRequestModule.register(this.server, '/request');
  }

  public start(port: number, address?: string, done?: () => void) {
    this.server.listen(port, address, done);
  }

  public stop(done?: () => void) {
    this.server.close(done);
  }
}
