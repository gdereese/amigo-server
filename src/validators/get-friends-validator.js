const errors = require('restify-errors');

function getFriendsValidator() {
  return (req, res, next) => {
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

module.exports = getFriendsValidator;
