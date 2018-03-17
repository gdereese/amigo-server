import { Server } from 'restify';

import { DeleteFriendHandler } from '../handlers/delete-friend-handler';
import { GetFriendHandler } from '../handlers/get-friend-handler';
import { GetFriendsHandler } from '../handlers/get-friends-handler';
import { NoContentResponseHandler } from '../handlers/no-content-response-handler';
import { OkResponseHandler } from '../handlers/ok-response-handler';
import { SetRequestValueHandler } from '../handlers/set-request-value-handler';
import { FriendService } from '../services/friend-service';
import { GetFriendsValidator } from '../validators/get-friends-validator';

export function register(server: Server, routeBase: string) {
  // Get Friend
  server.get(`${routeBase}/:id`, [
    SetRequestValueHandler('friendService', new FriendService()),
    GetFriendHandler('id', 'friendService', 'friend'),
    OkResponseHandler('friend')
  ]);

  // Get Friends
  server.get(routeBase, [
    SetRequestValueHandler('friendService', new FriendService()),
    GetFriendsValidator(),
    GetFriendsHandler('friendService', 'friends'),
    OkResponseHandler('friends')
  ]);

  // Delete Friend
  server.del(`${routeBase}/:id`, [
    SetRequestValueHandler('friendService', new FriendService()),
    GetFriendHandler('id', 'friendService', 'friend'),
    DeleteFriendHandler('friendService', 'friend'),
    NoContentResponseHandler()
  ]);
}
