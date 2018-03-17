import * as restify from 'restify';
import { Server } from 'restify';

import * as FriendModule from './modules/friend-module';
import * as FriendRequestModule from './modules/friend-request-module';

export class AmigoServer {
  private server: Server;

  constructor() {
    this.server = restify.createServer();

    // register global pre-module handlers
    this.server.use(restify.plugins.queryParser());
    this.server.use(restify.plugins.bodyParser());

    // register modules
    FriendModule.register(this.server, '/friend');
    FriendRequestModule.register(this.server, '/request');
  }

  public start(port: number) {
    this.server.listen(port, () =>
      console.log(`amigo-server listening on port ${port} (Ctrl+C to stop)...`)
    );
  }

  public stop() {
    this.server.removeAllListeners();
  }
}
