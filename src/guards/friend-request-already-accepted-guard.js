const errors = require('restify-errors');

function friendRequestAlreadyAcceptedGuard(existingFriendRequestReqKey) {
  return (req, res, next) => {
    const friendRequest = req[existingFriendRequestReqKey];

    if (friendRequest && friendRequest.accepted) {
      next(
        new errors.ConflictError(
          'This friend request has already been accepted.'
        )
      );
      return;
    }

    next();
  };
}

module.exports = friendRequestAlreadyAcceptedGuard;
