import { Next, Request, RequestHandler, Response } from 'restify';
import * as errors from 'restify-errors';

import { FriendRequest } from '../models/friend-request';

export function friendRequestAlreadyAcceptedGuard(
  existingFriendRequestReqKey: string
): RequestHandler {
  return (req, res: Response, next: Next) => {
    const friendRequest: FriendRequest = req[existingFriendRequestReqKey];

    if (friendRequest && friendRequest.accepted) {
      next(
        new errors.ConflictError(
          'This friend request has already been accepted.'
        )
      );
      return;
    }

    next();
  };
}
