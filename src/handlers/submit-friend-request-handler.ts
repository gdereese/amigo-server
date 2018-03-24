import { Next, Request, RequestHandler, Response, Router } from 'restify';

import { FriendRequest } from '../models/friend-request';
import { SubmitFriendRequest } from '../models/submit-friend-request';
import { FriendRequestService } from '../services/friend-request-service';

export function submitFriendRequestHandler(
  submitFriendRequestReqKey: string,
  friendRequestServiceReqKey: string,
  friendRequestReqKey: string
): RequestHandler {
  return async (req, res: Response, next: Next) => {
    const submitRequest: SubmitFriendRequest = req[submitFriendRequestReqKey];

    const friendRequestService: FriendRequestService =
      req[friendRequestServiceReqKey];
    const friendRequest = await friendRequestService.submitRequest(
      submitRequest
    );

    req[friendRequestReqKey] = friendRequest;

    next();
  };
}
