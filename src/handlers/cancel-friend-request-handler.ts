import { Next, Request, RequestHandler, Response } from 'restify';

import { FriendRequest } from '../models/friend-request';
import { FriendRequestService } from '../services/friend-request-service';

export function cancelFriendRequestHandler(
  friendRequestReqKey: string,
  friendRequestServiceReqKey: string
): RequestHandler {
  return async (req, res: Response, next: Next) => {
    const friendRequest: FriendRequest = req[friendRequestReqKey];

    const friendRequestService: FriendRequestService =
      req[friendRequestServiceReqKey];
    await friendRequestService.cancelFriendRequest(friendRequest.id);

    next();
  };
}
