import { Next, Request, RequestHandler, Response } from 'restify';
import * as errors from 'restify-errors';

export function GetFriendsValidator(): RequestHandler {
  return (req: Request, res: Response, next: Next) => {
    if (
      req.query.userId &&
      req.query.friendUserId &&
      req.query.userId === req.query.friendUserId
    ) {
      next(
        new errors.BadRequestError(
          'userId and friendUserId cannot be the same value.'
        )
      );
      return;
    }

    next();
  };
}
