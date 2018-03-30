function submitFriendRequestHandler(
  submitFriendRequestReqKey,
  friendRequestServiceReqKey,
  friendRequestReqKey
) {
  return (req, res, next) => {
    const submitRequest = req[submitFriendRequestReqKey];

    const friendRequestService = req[friendRequestServiceReqKey];
    friendRequestService
      .submitRequest(submitRequest)
      .then(friendRequest => {
        req[friendRequestReqKey] = friendRequest;
      })
      .then(next);
  };
}

module.exports = submitFriendRequestHandler;
