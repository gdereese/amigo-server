import * as _ from 'lodash';
import * as lodashQuery from 'lodash-query';

import { Friend } from '../models/friend';
import { MemoryStore } from '../modules/memory-store';

const query = lodashQuery(_, false);

export class FriendService {
  public deleteFriend(id: number): Promise<any> {
    _.remove(MemoryStore.friends, { id });

    return Promise.resolve();
  }

  public getFriend(id: number): Promise<Friend> {
    return Promise.resolve(_.find(MemoryStore.friends, { id }));
  }

  public queryFriends(criteria: any): Promise<Friend[]> {
    return query(MemoryStore.friends, criteria);
  }
}
