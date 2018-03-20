import * as restify from 'restify';
import { Server } from 'restify';

import * as configuration from './configuration/configuration';
import { ListenerSettings } from './configuration/listener-settings';
import { Settings } from './configuration/settings';
import * as FriendModule from './modules/friend-module';
import * as FriendRequestModule from './modules/friend-request-module';

export class AmigoServer {
  private server: Server;
  private settings: Settings;

  constructor(settings: Settings = {}) {
    configuration.mergeSettings(settings);
    this.settings = configuration.getSettings();

    this.server = restify.createServer();

    // register global pre-module handlers
    this.server.use(restify.plugins.queryParser());
    this.server.use(restify.plugins.bodyParser());

    // register modules
    FriendModule.register(this.server, '/friend');
    FriendRequestModule.register(this.server, '/request');
  }

  public start(done?: (address: string, port: number) => void) {
    const listenerSettings: ListenerSettings = this.settings.listener || {};

    this.server.listen(
      listenerSettings.port || 0,
      listenerSettings.address || '127.0.0.1',
      () => {
        done(this.server.address().address, this.server.address().port);
      }
    );
  }

  public stop(done?: () => void) {
    this.server.close(done);
  }
}
