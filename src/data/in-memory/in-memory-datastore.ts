import { Friend } from '../../models/friend';
import { FriendRequest } from '../../models/friend-request';
import { IDatastore } from '../datastore';
import { IRepository } from '../repository';
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
