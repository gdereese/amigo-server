import { Next, Request, Response } from 'restify';
import * as errors from 'restify-errors';

import { FriendRequest } from '../models/friend-request';
import { SubmitFriendRequest } from '../models/submit-friend-request';

export function FriendRequestAlreadyPendingGuard(
  submitFriendRequestReqKey: string,
  existingFriendRequestReqKey: string
) {
  return (req, res: Response, next: Next) => {
    const submitRequest: SubmitFriendRequest = req[submitFriendRequestReqKey];
    const friendRequest: FriendRequest = req[existingFriendRequestReqKey];

    if (
      friendRequest &&
      submitRequest.senderUserId === friendRequest.senderUserId &&
      submitRequest.recipientUserId === friendRequest.recipientUserId
    ) {
      next(
        new errors.ConflictError(
          'A friend request from the sender to the recipient is already pending.'
        )
      );
      return;
    }

    next();
  };
}
