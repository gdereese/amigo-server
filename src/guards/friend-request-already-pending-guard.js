const errors = require('restify-errors');

function friendRequestAlreadyPendingGuard(
  submitFriendRequestReqKey,
  existingFriendRequestReqKey
) {
  return (req, res, next) => {
    const submitRequest = req[submitFriendRequestReqKey];
    const friendRequest = req[existingFriendRequestReqKey];

    if (
      friendRequest &&
      submitRequest.senderUserId === friendRequest.senderUserId &&
      submitRequest.recipientUserId === friendRequest.recipientUserId
    ) {
      next(
        new errors.ConflictError(
          'A friend request from the sender to the recipient is already pending.'
        )
      );
      return;
    }

    next();
  };
}

module.exports = friendRequestAlreadyPendingGuard;
