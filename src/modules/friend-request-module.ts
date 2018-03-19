import { Next, Request, Response, Server } from 'restify';

import { FriendRequestAlreadyAcceptedGuard } from '../guards/friend-request-already-accepted-guard';
import { FriendRequestAlreadyPendingGuard } from '../guards/friend-request-already-pending-guard';
import { FriendRequestSameSenderAndRecipientGuard } from '../guards/friend-request-same-sender-and-recipient-guard';
import { AcceptFriendRequestHandler } from '../handlers/accept-friend-request-handler';
import { CancelFriendRequestHandler } from '../handlers/cancel-friend-request-handler';
import { FindFriendRequestBySenderAndRecipientHandler } from '../handlers/find-friend-request-by-sender-and-recipient-handler';
import { GetFriendRequestHandler } from '../handlers/get-friend-request-handler';
import { GetPendingFriendRequestsHandler } from '../handlers/get-pending-friend-requests-handler';
import { NoContentResponseHandler } from '../handlers/no-content-response-handler';
import { OkResponseHandler } from '../handlers/ok-response-handler';
import { RejectFriendRequestHandler } from '../handlers/reject-friend-request-handler';
import { SetRequestValueHandler } from '../handlers/set-request-value-handler';
import { SubmitFriendRequestHandler } from '../handlers/submit-friend-request-handler';
import { FriendRequest } from '../models/friend-request';
import { FriendRequestService } from '../services/friend-request-service';
import { GetPendingFriendRequestsValidator } from '../validators/get-pending-friend-requests-validator';

export function register(server: Server, routeBase: string) {
  // Submit Friend Request
  server.post(routeBase, [
    SetRequestValueHandler('friendRequestService', new FriendRequestService()),
    FindFriendRequestBySenderAndRecipientHandler(
      'body',
      'friendRequestService',
      'friendRequest'
    ),
    FriendRequestSameSenderAndRecipientGuard('body'),
    FriendRequestAlreadyPendingGuard('body', 'friendRequest'),
    FriendRequestAlreadyAcceptedGuard('friendRequest'),
    SubmitFriendRequestHandler('body', 'friendRequestService', 'friendRequest'),
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
    SetRequestValueHandler('friendRequestService', new FriendRequestService()),
    GetFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
    FriendRequestAlreadyAcceptedGuard('friendRequest'),
    AcceptFriendRequestHandler(
      'friendRequest',
      'friendRequestService',
      'friends'
    ),
    OkResponseHandler('friends')
  ]);

  // Reject Friend Request
  server.post(`${routeBase}/:id/reject`, [
    SetRequestValueHandler('friendRequestService', new FriendRequestService()),
    GetFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
    FriendRequestAlreadyAcceptedGuard('friendRequest'),
    RejectFriendRequestHandler('friendRequest', 'friendRequestService'),
    NoContentResponseHandler()
  ]);

  // Cancel Friend Request
  server.post(`${routeBase}/:id/cancel`, [
    SetRequestValueHandler('friendRequestService', new FriendRequestService()),
    GetFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
    FriendRequestAlreadyAcceptedGuard('friendRequest'),
    CancelFriendRequestHandler('friendRequest', 'friendRequestService'),
    NoContentResponseHandler()
  ]);

  // Get Friend Request
  server.get(
    {
      name: 'get-friend-request',
      path: `${routeBase}/:id`
    },
    [
      SetRequestValueHandler(
        'friendRequestService',
        new FriendRequestService()
      ),
      GetFriendRequestHandler('id', 'friendRequestService', 'friendRequest'),
      OkResponseHandler('friendRequest')
    ]
  );

  // Get Pending Friend Requests
  server.get(routeBase, [
    SetRequestValueHandler('friendRequestService', new FriendRequestService()),
    GetPendingFriendRequestsValidator(),
    GetPendingFriendRequestsHandler('friendRequestService', 'friendRequests'),
    OkResponseHandler('friendRequests')
  ]);
}
