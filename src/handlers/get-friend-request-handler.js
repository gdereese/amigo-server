const errors = require('restify-errors');

function getFriendRequestHandler(
  idParamsKey,
  friendRequestServiceReqKey,
  friendRequestReqKey
) {
  return (req, res, next) => {
    const friendRequestService = req[friendRequestServiceReqKey];
    friendRequestService
      .getFriendRequest(req.params[idParamsKey])
      .then(friendRequest => {
        if (!friendRequest) {
          next(new errors.NotFoundError());
          return;
        }

        req[friendRequestReqKey] = friendRequest;

        next();
      });
  };
}

module.exports = getFriendRequestHandler;
