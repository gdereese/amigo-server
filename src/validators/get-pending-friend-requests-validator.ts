import { Next, Request, RequestHandler, Response } from 'restify';
import * as errors from 'restify-errors';

import * as stringArrayUtils from '../validators/string-array-utils';

export function GetPendingFriendRequestsValidator(): RequestHandler {
  return (req: any, res: Response, next: Next) => {
    if (
      req.query.by &&
      !stringArrayUtils.isIn(['recipient', 'sender'], req.query.by)
    ) {
      next(new errors.BadRequestError('Invalid by value.'));
      return;
    }

    if (req.query.by && !req.query.userId) {
      next(
        new errors.BadRequestError(
          'userId is required if getting friend requests by sender or recipient.'
        )
      );
      return;
    }

    next();
  };
}
