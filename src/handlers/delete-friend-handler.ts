import { Next, Request, RequestHandler, Response } from 'restify';

import { Friend } from '../models/friend';
import { FriendService } from '../services/friend-service';

export function deleteFriendHandler(
  friendServiceReqKey: string,
  friendReqKey: string
): RequestHandler {
  return async (req: any, res: Response, next: Next) => {
    const friend: Friend = req[friendReqKey];

    const friendService: FriendService = req[friendServiceReqKey];
    await friendService.deleteFriend(friend.id);

    next();
  };
}
