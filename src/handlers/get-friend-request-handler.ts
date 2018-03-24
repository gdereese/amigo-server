import { Next, Request, RequestHandler, Response } from 'restify';
import * as errors from 'restify-errors';

import { FriendRequestService } from '../services/friend-request-service';

export function getFriendRequestHandler(
  idParamsKey: string,
  friendRequestServiceReqKey: string,
  friendRequestReqKey: string
): RequestHandler {
  return async (req, res: Response, next: Next) => {
    const friendRequestService: FriendRequestService =
      req[friendRequestServiceReqKey];
    const friendRequest = await friendRequestService.getFriendRequest(
      Number(req.params[idParamsKey])
    );

    if (!friendRequest) {
      next(new errors.NotFoundError());
      return;
    }

    req[friendRequestReqKey] = friendRequest;

    next();
  };
}
