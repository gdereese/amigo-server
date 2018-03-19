import { RepositoryProvider } from '../data/repository-provider';
import { Friend } from '../models/friend';

export class FriendService {
  private friends = RepositoryProvider(Friend);

  public deleteFriend(id: number): Promise<any> {
    return this.friends.delete(id);
  }

  public getFriend(id: number): Promise<Friend> {
    return this.friends.get(id);
  }

  public queryFriends(criteria: any): Promise<Friend[]> {
    return this.friends.query(criteria);
  }
}
