import { Next, Request, RequestHandler, Response } from 'restify';

import { FriendService } from '../services/friend-service';

export function GetFriendsHandler(
  friendServiceReqKey: string,
  friendsReqKey: string
): RequestHandler {
  return async (req, res: Response, next: Next) => {
    const criteria = buildCriteria(req);

    const friendService: FriendService = req[friendServiceReqKey];
    const friends = await friendService.queryFriends(criteria);

    req[friendsReqKey] = friends;

    next();
  };
}

function buildCriteria(req: Request): any {
  const criteria: any = {};

  if (req.query.friendUserId) {
    criteria.friendUserId = req.query.friendUserId;
  }

  if (req.query.userId) {
    criteria.userId = req.query.userId;
  }

  return criteria;
}
