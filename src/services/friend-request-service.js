const moment = require('moment');

const record = require('../../src/data/record-types');

class FriendRequestService {
  constructor(store) {
    this.store = store;
  }

  acceptFriendRequest(id) {
    const now = moment().toDate();

    return this.store
      .update(record.typeNames.friendRequest, {
        id,
        replace: {
          accepted: now
        }
      })
      .then(result => {
        const friendRequest = result.payload.records[0];
        const findMutualFriendRequest = this.store.find(
          record.typeNames.friendRequest,
          {
            match: {
              recipientUserId: friendRequest.senderUserId,
              senderUserId: friendRequest.recipientUserId
            }
          }
        );

        return Promise.all([friendRequest, findMutualFriendRequest]);
      })
      .then(stuff => {
        const friendRequest = stuff[0];
        const mutualFriendRequest = stuff[1].payload.records[0];

        let updateMutualFriendRequest = null;
        if (mutualFriendRequest) {
          updateMutualFriendRequest = this.store.update(
            record.typeNames.friendRequest,
            {
              id: mutualFriendRequest.id,
              replace: {
                accepted: now
              }
            }
          );
        }

        return Promise.all([friendRequest, updateMutualFriendRequest]);
      })
      .then(stuff => {
        const friendRequest = stuff[0];

        const senderFriend = {
          created: now,
          friendUserId: friendRequest.recipientUserId,
          userId: friendRequest.senderUserId
        };

        const recipientFriend = {
          created: now,
          friendUserId: friendRequest.senderUserId,
          userId: friendRequest.recipientUserId
        };

        return this.store.create(record.typeNames.friend, [
          senderFriend,
          recipientFriend
        ]);
      })
      .then(result => {
        return {
          senderFriend: result.payload.records[0],
          recipientFriend: result.payload.records[1]
        };
      });
  }

  cancelFriendRequest(id) {
    return this.store
      .delete(record.typeNames.friendRequest, [id])
      .then(() => undefined);
  }

  getFriendRequest(id) {
    return this.store
      .find(record.typeNames.friendRequest, id)
      .then(result => result.payload.records[0]);
  }

  getFriendRequestBySenderAndRecipient(senderUserId, recipientUserId) {
    return this.store
      .find(record.typeNames.friendRequest, null, {
        match: {
          recipientUserId,
          senderUserId
        }
      })
      .then(result => result.payload.records[0]);
  }

  queryFriendRequests(criteria) {
    return this.store
      .find(record.typeNames.friendRequest, null, criteria)
      .then(result => {
        return result.payload.records;
      });
  }

  rejectFriendRequest(id) {
    return this.store
      .delete(record.typeNames.friendRequest, [id])
      .then(() => undefined);
  }

  submitRequest(request) {
    const friendRequest = {
      accepted: null,
      recipientUserId: request.recipientUserId,
      senderUserId: request.senderUserId
    };

    return this.store
      .create(record.typeNames.friendRequest, friendRequest)
      .then(result => result.payload.records[0]);
  }
}

module.exports = FriendRequestService;
