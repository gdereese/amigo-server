import { Next, Request, Response, Server } from 'restify';

import { friendRequestAlreadyAcceptedGuard } from '../guards/friend-request-already-accepted-guard';
import { friendRequestAlreadyPendingGuard } from '../guards/friend-request-already-pending-guard';
import { friendRequestSameSenderAndRecipientGuard } from '../guards/friend-request-same-sender-and-recipient-guard';
import { acceptFriendRequestHandler } from '../handlers/accept-friend-request-handler';
import { cancelFriendRequestHandler } from '../handlers/cancel-friend-request-handler';
import { findFriendRequestBySenderAndRecipientHandler } from '../handlers/find-friend-request-by-sender-and-recipient-handler';
import { getFriendRequestHandler } from '../handlers/get-friend-request-handler';
import { getPendingFriendRequestsHandler } from '../handlers/get-pending-friend-requests-handler';
import { noContentResponseHandler } from '../handlers/no-content-response-handler';
import { okResponseHandler } from '../handlers/ok-response-handler';
import { rejectFriendRequestHandler } from '../handlers/reject-friend-request-handler';
import { setRequestValueHandler } from '../handlers/set-request-value-handler';
import { submitFriendRequestHandler } from '../handlers/submit-friend-request-handler';
import { FriendRequest } from '../models/friend-request';
import { FriendRequestService } from '../services/friend-request-service';
import { getPendingFriendRequestsValidator } from '../validators/get-pending-friend-requests-validator';

export function register(server: Server, routeBase: string) {
  // Submit Friend Request
  server.post(routeBase, [
    setRequestValueHandler('friendRequestService', new FriendRequestService()),
    findFriendRequestBySenderAndRecipientHandler(
      'body',
      'friendRequestService',
      'friendRequest'
    ),
    friendRequestSameSenderAndRecipientGuard('body'),
    friendRequestAlreadyPendingGuard('body', 'friendRequest'),
    friendRequestAlreadyAcceptedGuard('friendRequest'),
    submitFriendRequestHandler('body', 'friendRequestService', 'friendRequest'),
    (req: any, res: Response, next: Next) => {
      const friendRequest: FriendRequest = req.friendRequest;

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
    setRequestValueHandler('friendRequestService', new FriendRequestService()),
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
    setRequestValueHandler('friendRequestService', new FriendRequestService()),
    getFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
    friendRequestAlreadyAcceptedGuard('friendRequest'),
    rejectFriendRequestHandler('friendRequest', 'friendRequestService'),
    noContentResponseHandler()
  ]);

  // Cancel Friend Request
  server.post(`${routeBase}/:id/cancel`, [
    setRequestValueHandler('friendRequestService', new FriendRequestService()),
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
        new FriendRequestService()
      ),
      getFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
      okResponseHandler('friendRequest')
    ]
  );

  // Get Pending Friend Requests
  server.get(routeBase, [
    setRequestValueHandler('friendRequestService', new FriendRequestService()),
    getPendingFriendRequestsValidator(),
    getPendingFriendRequestsHandler('friendRequestService', 'friendRequests'),
    okResponseHandler('friendRequests')
  ]);
}
