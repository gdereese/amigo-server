import { Next, Request, RequestHandler, Response } from 'restify';

import { FriendRequest } from '../models/friend-request';
import { FriendRequestService } from '../services/friend-request-service';

export function acceptFriendRequestHandler(
  friendRequestReqKey: string,
  friendRequestServiceReqKey: string,
  friendsReqKey: string
): RequestHandler {
  return async (req, res: Response, next: Next) => {
    const friendRequest: FriendRequest = req[friendRequestReqKey];

    const friendRequestService: FriendRequestService =
      req[friendRequestServiceReqKey];
    const friends = await friendRequestService.acceptFriendRequest(
      friendRequest.id
    );

    req[friendsReqKey] = friends;

    next();
  };
}
