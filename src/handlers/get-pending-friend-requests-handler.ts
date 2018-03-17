import { Next, Request, RequestHandler, Response } from 'restify';

import { FriendRequest } from '../models/friend-request';
import { FriendRequestService } from '../services/friend-request-service';

export function GetPendingFriendRequestsHandler(
  friendRequestServiceReqKey: string,
  friendRequestsReqKey: string
): RequestHandler {
  return async (req, res: Response, next: Next) => {
    const criteria = buildCriteria(req);

    const friendRequestService: FriendRequestService =
      req[friendRequestServiceReqKey];
    const friendRequests = await friendRequestService.queryFriendRequests(
      criteria
    );

    req[friendRequestsReqKey] = friendRequests;

    next();
  };
}

function buildCriteria(req: Request): any {
  const criteria: any = {
    accepted: null
  };

  if (req.query.userId) {
    if (req.query.by) {
      switch (req.query.by.toLocaleLowerCase()) {
        case 'recipient':
          criteria.recipientUserId = req.query.userId;
          break;
        case 'sender':
          criteria.senderUserId = req.query.userId;
          break;
      }
    } else {
      criteria.$or = {
        recipientUserId: req.query.userId,
        senderUserId: req.query.userId
      };
    }
  }

  return criteria;
}
