import { Friend } from '../models/friend';
import { FriendRequest } from '../models/friend-request';
import { MemoryStore } from './memory-store';
import { IRepository } from './repository';

const repositories: any = {};
repositories[Friend.toString()] = new MemoryStore<Friend>();
repositories[FriendRequest.toString()] = new MemoryStore<FriendRequest>();

export function RepositoryProvider(type: new () => any): IRepository {
  return repositories[type.toString()];
}
