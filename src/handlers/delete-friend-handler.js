function deleteFriendHandler(friendServiceReqKey, friendReqKey) {
  return (req, res, next) => {
    const friend = req[friendReqKey];

    const friendService = req[friendServiceReqKey];
    friendService.deleteFriend(friend.id).then(next);
  };
}

module.exports = deleteFriendHandler;
