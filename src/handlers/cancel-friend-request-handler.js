function cancelFriendRequestHandler(
  friendRequestReqKey,
  friendRequestServiceReqKey
) {
  return (req, res, next) => {
    const friendRequest = req[friendRequestReqKey];

    const friendRequestService = req[friendRequestServiceReqKey];
    friendRequestService.cancelFriendRequest(friendRequest.id).then(next);
  };
}

module.exports = cancelFriendRequestHandler;
