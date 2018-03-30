const record = require('../data/record-types');

class FriendService {
  constructor(store) {
    this.store = store;
  }

  deleteFriend(id) {
    return this.store
      .delete(record.typeNames.friend, [id])
      .then(() => undefined);
  }

  getFriend(id) {
    return this.store
      .find(record.typeNames.friend, id)
      .then(result => result.payload.records[0]);
  }

  queryFriends(criteria) {
    return this.store
      .find(record.typeNames.friend, null, criteria)
      .then(result => result.payload.records);
  }
}

module.exports = FriendService;
