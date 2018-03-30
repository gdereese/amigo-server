const errors = require('restify-errors');

function friendRequestSameSenderAndRecipientGuard(submitFriendRequestReqKey) {
  return (req, res, next) => {
    const submitRequest = req[submitFriendRequestReqKey];

    if (submitRequest.recipientUserId === submitRequest.senderUserId) {
      next(
        new errors.BadRequestError(
          'The sender and recipient of a friend request cannot be the same user.'
        )
      );
      return;
    }

    next();
  };
}

module.exports = friendRequestSameSenderAndRecipientGuard;
