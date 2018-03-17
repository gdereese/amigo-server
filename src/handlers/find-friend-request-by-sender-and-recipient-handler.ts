import { Next, Request, RequestHandler, Response } from 'restify';

import { SubmitFriendRequest } from '../models/submit-friend-request';
import { FriendRequestService } from '../services/friend-request-service';

export function FindFriendRequestBySenderAndRecipientHandler(
  submitFriendRequestReqKey: string,
  friendRequestServiceReqKey: string,
  friendRequestReqKey: string
): RequestHandler {
  return async (req: any, res: Response, next: Next) => {
    const submitRequest: SubmitFriendRequest = req[submitFriendRequestReqKey];

    const friendRequestService: FriendRequestService =
      req[friendRequestServiceReqKey];
    const friendRequest = await req.friendRequestService.getFriendRequestBySenderAndRecipient(
      submitRequest.senderUserId,
      submitRequest.recipientUserId
    );

    req[friendRequestReqKey] = friendRequest;

    next();
  };
}
