import { Server } from 'restify';

import { deleteFriendHandler } from '../handlers/delete-friend-handler';
import { getFriendHandler } from '../handlers/get-friend-handler';
import { getFriendsHandler } from '../handlers/get-friends-handler';
import { noContentResponseHandler } from '../handlers/no-content-response-handler';
import { okResponseHandler } from '../handlers/ok-response-handler';
import { setRequestValueHandler } from '../handlers/set-request-value-handler';
import { FriendService } from '../services/friend-service';
import { getFriendsValidator } from '../validators/get-friends-validator';

export function register(server: Server, routeBase: string) {
  // Get Friend
  server.get(`${routeBase}/:id`, [
    setRequestValueHandler('friendService', new FriendService()),
    getFriendHandler('id', 'friendService', 'friend'),
    okResponseHandler('friend')
  ]);

  // Get Friends
  server.get(routeBase, [
    setRequestValueHandler('friendService', new FriendService()),
    getFriendsValidator(),
    getFriendsHandler('friendService', 'friends'),
    okResponseHandler('friends')
  ]);

  // Delete Friend
  server.del(`${routeBase}/:id`, [
    setRequestValueHandler('friendService', new FriendService()),
    getFriendHandler('id', 'friendService', 'friend'),
    deleteFriendHandler('friendService', 'friend'),
    noContentResponseHandler()
  ]);
}
