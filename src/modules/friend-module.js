const deleteFriendHandler = require('../handlers/delete-friend-handler');
const getFriendHandler = require('../handlers/get-friend-handler');
const getFriendsHandler = require('../handlers/get-friends-handler');
const noContentResponseHandler = require('../handlers/no-content-response-handler');
const okResponseHandler = require('../handlers/ok-response-handler');
const setRequestValueHandler = require('../handlers/set-request-value-handler');
const FriendService = require('../services/friend-service');
const getFriendsValidator = require('../validators/get-friends-validator');

function friendModule(server, store, routeBase) {
  // Get Friend
  server.get(`${routeBase}/:id`, [
    setRequestValueHandler('friendService', new FriendService(store)),
    getFriendHandler('id', 'friendService', 'friend'),
    okResponseHandler('friend')
  ]);

  // Get Friends
  server.get(routeBase, [
    setRequestValueHandler('friendService', new FriendService(store)),
    getFriendsValidator(),
    getFriendsHandler('friendService', 'friends'),
    okResponseHandler('friends')
  ]);

  // Delete Friend
  server.del(`${routeBase}/:id`, [
    setRequestValueHandler('friendService', new FriendService(store)),
    getFriendHandler('id', 'friendService', 'friend'),
    deleteFriendHandler('friendService', 'friend'),
    noContentResponseHandler()
  ]);
}

module.exports = friendModule;
