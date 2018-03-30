const errors = require('restify-errors');

function getFriendHandler(idParamsKey, friendServiceReqKey, friendReqKey) {
  return (req, res, next) => {
    const friendService = req[friendServiceReqKey];
    friendService.getFriend(Number(req.params[idParamsKey])).then(friend => {
      if (!friend) {
        next(new errors.NotFoundError());
        return;
      }

      req[friendReqKey] = friend;

      next();
    });
  };
}

module.exports = getFriendHandler;
