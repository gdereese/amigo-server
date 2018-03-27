import { IDatastore } from '../../data/datastore';
import { IRepository } from '../../data/repository';
import { Friend } from '../../models/friend';
import { FriendRequest } from '../../models/friend-request';
import { InMemoryRepository } from './in-memory-repository';

export class InMemoryDatastore implements IDatastore {
  private static friendStore: InMemoryRepository<
    Friend
  > = new InMemoryRepository<Friend>();
  private static friendRequestStore: InMemoryRepository<
    FriendRequest
  > = new InMemoryRepository<FriendRequest>();

  get friends(): InMemoryRepository<Friend> {
    return InMemoryDatastore.friendStore;
  }

  get friendRequests(): InMemoryRepository<FriendRequest> {
    return InMemoryDatastore.friendRequestStore;
  }
}

export default InMemoryDatastore;
