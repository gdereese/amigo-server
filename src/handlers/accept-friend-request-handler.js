function acceptFriendRequestHandler(
  friendRequestReqKey,
  friendRequestServiceReqKey,
  friendsReqKey
) {
  return (req, res, next) => {
    const friendRequest = req[friendRequestReqKey];

    const friendRequestService = req[friendRequestServiceReqKey];
    friendRequestService
      .acceptFriendRequest(friendRequest.id)
      .then(friends => {
        req[friendsReqKey] = friends;
      })
      .then(next);
  };
}

module.exports = acceptFriendRequestHandler;
