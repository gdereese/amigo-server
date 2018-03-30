const errors = require('restify-errors');

const stringArrayUtils = require('../validators/string-array-utils');

function getPendingFriendRequestsValidator() {
  return (req, res, next) => {
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

module.exports = getPendingFriendRequestsValidator;
