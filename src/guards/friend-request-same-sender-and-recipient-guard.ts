import { Next, Request, Response } from 'restify';
import * as errors from 'restify-errors';

import { SubmitFriendRequest } from '../models/submit-friend-request';

export function FriendRequestSameSenderAndRecipientGuard(
  submitFriendRequestReqKey: string
) {
  return (req, res: Response, next: Next) => {
    const submitRequest: SubmitFriendRequest = req[submitFriendRequestReqKey];

    if (submitRequest.recipientUserId === submitRequest.senderUserId) {
      next(
        new errors.BadRequestError(
          'The sender and recipient of a friend request cannot be the same user.'
        )
      );
      return;
    }

    next();
  };
}
