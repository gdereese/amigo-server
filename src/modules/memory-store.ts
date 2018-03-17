import { Friend } from '../models/friend';
import { FriendRequest } from '../models/friend-request';

export class MemoryStore {
  public static friends: Friend[] = [];
  public static friendRequests: FriendRequest[] = [];
}
