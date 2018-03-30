function getPendingFriendRequestsHandler(
  friendRequestServiceReqKey,
  friendRequestsReqKey
) {
  return (req, res, next) => {
    const criteria = buildCriteria(req);

    const friendRequestService = req[friendRequestServiceReqKey];
    friendRequestService
      .queryFriendRequests(criteria)
      .then(friendRequests => {
        req[friendRequestsReqKey] = friendRequests;
      })
      .then(next);
  };
}

function buildCriteria(req) {
  const criteria = {
    match: {
      accepted: null
    }
  };

  if (req.query.userId) {
    if (req.query.by) {
      switch (req.query.by.toLocaleLowerCase()) {
        case 'recipient':
          criteria.match.recipientUserId = req.query.userId;
          break;
        case 'sender':
          criteria.match.senderUserId = req.query.userId;
          break;
      }
    } else {
      criteria.or = {
        recipientUserId: req.query.userId,
        senderUserId: req.query.userId
      };
    }
  }

  return criteria;
}

module.exports = getPendingFriendRequestsHandler;
