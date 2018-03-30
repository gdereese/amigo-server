function findFriendRequestBySenderAndRecipientHandler(
  submitFriendRequestReqKey,
  friendRequestServiceReqKey,
  friendRequestReqKey
) {
  return (req, res, next) => {
    const submitRequest = req[submitFriendRequestReqKey];

    const friendRequestService = req[friendRequestServiceReqKey];
    friendRequestService
      .getFriendRequestBySenderAndRecipient(
        submitRequest.senderUserId,
        submitRequest.recipientUserId
      )
      .then(friendRequest => {
        req[friendRequestReqKey] = friendRequest;
      })
      .then(next);
  };
}

module.exports = findFriendRequestBySenderAndRecipientHandler;
