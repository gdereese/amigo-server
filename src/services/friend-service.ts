import { datastoreProvider } from '../data/datastore-provider';
import { Friend } from '../models/friend';

export class FriendService {
  private datastore = datastoreProvider();

  public deleteFriend(id: number): Promise<any> {
    return this.datastore.friends.delete(id);
  }

  public getFriend(id: number): Promise<Friend> {
    return this.datastore.friends.get(id);
  }

  public queryFriends(criteria: any): Promise<Friend[]> {
    return this.datastore.friends.query(criteria);
  }
}
