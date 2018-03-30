const friendRequestAlreadyAcceptedGuard = require('../guards/friend-request-already-accepted-guard');
const friendRequestAlreadyPendingGuard = require('../guards/friend-request-already-pending-guard');
const friendRequestSameSenderAndRecipientGuard = require('../guards/friend-request-same-sender-and-recipient-guard');
const acceptFriendRequestHandler = require('../handlers/accept-friend-request-handler');
const cancelFriendRequestHandler = require('../handlers/cancel-friend-request-handler');
const findFriendRequestBySenderAndRecipientHandler = require('../handlers/find-friend-request-by-sender-and-recipient-handler');
const getFriendRequestHandler = require('../handlers/get-friend-request-handler');
const getPendingFriendRequestsHandler = require('../handlers/get-pending-friend-requests-handler');
const noContentResponseHandler = require('../handlers/no-content-response-handler');
const okResponseHandler = require('../handlers/ok-response-handler');
const rejectFriendRequestHandler = require('../handlers/reject-friend-request-handler');
const setRequestValueHandler = require('../handlers/set-request-value-handler');
const submitFriendRequestHandler = require('../handlers/submit-friend-request-handler');
const FriendRequestService = require('../services/friend-request-service');
const getPendingFriendRequestsValidator = require('../validators/get-pending-friend-requests-validator');

function friendRequestModule(server, store, routeBase) {
  // Submit Friend Request
  server.post(routeBase, [
    setRequestValueHandler(
      'friendRequestService',
      new FriendRequestService(store)
    ),
    findFriendRequestBySenderAndRecipientHandler(
      'body',
      'friendRequestService',
      'friendRequest'
    ),
    friendRequestSameSenderAndRecipientGuard('body'),
    friendRequestAlreadyPendingGuard('body', 'friendRequest'),
    friendRequestAlreadyAcceptedGuard('friendRequest'),
    submitFriendRequestHandler('body', 'friendRequestService', 'friendRequest'),
    (req, res, next) => {
      const friendRequest = req.friendRequest;

      res.header(
        'Location',
        server.router.render('get-friend-request', { id: friendRequest.id })
      );
      res.send(201, friendRequest);

      next();
    }
  ]);

  // Accept Friend Request
  server.post(`${routeBase}/:id/accept`, [
    setRequestValueHandler(
      'friendRequestService',
      new FriendRequestService(store)
    ),
    getFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
    friendRequestAlreadyAcceptedGuard('friendRequest'),
    acceptFriendRequestHandler(
      'friendRequest',
      'friendRequestService',
      'friends'
    ),
    okResponseHandler('friends')
  ]);

  // Reject Friend Request
  server.post(`${routeBase}/:id/reject`, [
    setRequestValueHandler(
      'friendRequestService',
      new FriendRequestService(store)
    ),
    getFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
    friendRequestAlreadyAcceptedGuard('friendRequest'),
    rejectFriendRequestHandler('friendRequest', 'friendRequestService'),
    noContentResponseHandler()
  ]);

  // Cancel Friend Request
  server.post(`${routeBase}/:id/cancel`, [
    setRequestValueHandler(
      'friendRequestService',
      new FriendRequestService(store)
    ),
    getFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
    friendRequestAlreadyAcceptedGuard('friendRequest'),
    cancelFriendRequestHandler('friendRequest', 'friendRequestService'),
    noContentResponseHandler()
  ]);

  // Get Friend Request
  server.get(
    {
      name: 'get-friend-request',
      path: `${routeBase}/:id`
    },
    [
      setRequestValueHandler(
        'friendRequestService',
        new FriendRequestService(store)
      ),
      getFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
      okResponseHandler('friendRequest')
    ]
  );

  // Get Pending Friend Requests
  server.get(routeBase, [
    setRequestValueHandler(
      'friendRequestService',
      new FriendRequestService(store)
    ),
    getPendingFriendRequestsValidator(),
    getPendingFriendRequestsHandler('friendRequestService', 'friendRequests'),
    okResponseHandler('friendRequests')
  ]);
}

module.exports = friendRequestModule;
