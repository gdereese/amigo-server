import { Friend } from '../models/friend';
import { FriendRequest } from '../models/friend-request';
import { IRepository } from './repository';

export interface IDatastore {
  friends: IRepository<Friend>;
  friendRequests: IRepository<FriendRequest>;
}
