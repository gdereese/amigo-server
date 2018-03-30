function getFriendsHandler(friendServiceReqKey, friendsReqKey) {
  return (req, res, next) => {
    const criteria = buildCriteria(req);

    const friendService = req[friendServiceReqKey];
    friendService
      .queryFriends(criteria)
      .then(friends => {
        req[friendsReqKey] = friends;
      })
      .then(next);
  };
}

function buildCriteria(req) {
  const criteria = {
    match: {}
  };

  if (req.query.friendUserId) {
    criteria.match.friendUserId = req.query.friendUserId;
  }

  if (req.query.userId) {
    criteria.match.userId = req.query.userId;
  }

  return criteria;
}

module.exports = getFriendsHandler;
