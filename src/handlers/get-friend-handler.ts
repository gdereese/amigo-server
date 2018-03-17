import { Next, Request, RequestHandler, Response } from 'restify';
import * as errors from 'restify-errors';
import { FriendService } from '../services/friend-service';

export function GetFriendHandler(
  idParamsKey: string,
  friendServiceReqKey: string,
  friendReqKey: string
): RequestHandler {
  return async (req, res: Response, next: Next) => {
    const friendService: FriendService = req[friendServiceReqKey];
    const friend = await friendService.getFriend(
      Number(req.params[idParamsKey])
    );

    if (!friend) {
      next(new errors.NotFoundError());
      return;
    }

    req[friendReqKey] = friend;

    next();
  };
}
