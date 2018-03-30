function rejectFriendRequestHandler(
  friendRequestReqKey,
  friendRequestServiceReqKey
) {
  return (req, res, next) => {
    const friendRequest = req[friendRequestReqKey];

    const friendRequestService = req[friendRequestServiceReqKey];
    friendRequestService.rejectFriendRequest(friendRequest.id).then(next);
  };
}

module.exports = rejectFriendRequestHandler;
