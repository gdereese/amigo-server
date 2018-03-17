import * as _ from 'lodash';
import * as lodashQuery from 'lodash-query';
import * as moment from 'moment';

import { Friend } from '../models/friend';
import { FriendRequest } from '../models/friend-request';
import { SubmitFriendRequest } from '../models/submit-friend-request';
import { MemoryStore } from '../modules/memory-store';

const query = lodashQuery(_, false);

export class FriendRequestService {
  public acceptFriendRequest(id: number): Promise<any> {
    const friendRequest = _.find(MemoryStore.friendRequests, { id });
    const now = moment().toDate();

    // mark friend request as accepted
    friendRequest.accepted = now;

    // mark any similar request from the recipient end as accepted
    const mutualFriendRequest = _.find(MemoryStore.friendRequests, {
      recipientUserId: friendRequest.senderUserId,
      senderUserId: friendRequest.recipientUserId
    });
    if (mutualFriendRequest) {
      mutualFriendRequest.accepted = now;
    }

    // create new friend for sender
    const senderFriend = {
      created: now,
      friendUserId: friendRequest.recipientUserId,
      id: this.nextId(MemoryStore.friends),
      userId: friendRequest.senderUserId
    };
    MemoryStore.friends.push(senderFriend);

    // create new friend for recipient
    const recipientFriend = {
      created: now,
      friendUserId: friendRequest.senderUserId,
      id: this.nextId(MemoryStore.friends),
      userId: friendRequest.recipientUserId
    };
    MemoryStore.friends.push(recipientFriend);

    return Promise.resolve({ senderFriend, recipientFriend });
  }

  public cancelFriendRequest(id: number): Promise<any> {
    _.remove(MemoryStore.friendRequests, { id });

    return Promise.resolve();
  }

  public getFriendRequest(id: number): Promise<FriendRequest> {
    return Promise.resolve(_.find(MemoryStore.friendRequests, { id }));
  }

  public getFriendRequestBySenderAndRecipient(
    senderUserId: string,
    recipientUserId: string
  ): Promise<FriendRequest> {
    return Promise.resolve(
      _.find(MemoryStore.friendRequests, {
        recipientUserId,
        senderUserId
      })
    );
  }

  public queryFriendRequests(criteria: any): Promise<FriendRequest[]> {
    return Promise.resolve(query(MemoryStore.friendRequests, criteria));
  }

  public rejectFriendRequest(id: number): Promise<any> {
    _.remove(MemoryStore.friendRequests, { id });

    return Promise.resolve();
  }

  public submitRequest(request: SubmitFriendRequest): Promise<FriendRequest> {
    const friendRequest: FriendRequest = {
      accepted: null,
      id: this.nextId(MemoryStore.friendRequests),
      recipientUserId: request.recipientUserId,
      senderUserId: request.senderUserId
    };
    MemoryStore.friendRequests.push(friendRequest);

    return Promise.resolve(friendRequest);
  }

  private nextId(collection: any, propertyName: string = 'id'): number {
    const itemWithMax = _.maxBy(collection, propertyName);
    if (!itemWithMax) {
      return 1;
    }

    return itemWithMax[propertyName] + 1;
  }
}
