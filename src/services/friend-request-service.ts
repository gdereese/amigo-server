import * as moment from 'moment';

import { DatastoreProvider } from '../data/datastore-provider';
import { Friend } from '../models/friend';
import { FriendRequest } from '../models/friend-request';
import { SubmitFriendRequest } from '../models/submit-friend-request';

export class FriendRequestService {
  private datastore = DatastoreProvider();

  public async acceptFriendRequest(id: number): Promise<any> {
    const friendRequest = await this.datastore.friendRequests.get(id);
    const now = moment().toDate();

    // mark friend request as accepted
    friendRequest.accepted = now;
    await this.datastore.friendRequests.update(friendRequest);

    // mark any similar request from the recipient end as accepted
    const mutualFriendRequest = (await this.datastore.friendRequests.query({
      recipientUserId: friendRequest.senderUserId,
      senderUserId: friendRequest.recipientUserId
    }))[0];
    if (mutualFriendRequest) {
      mutualFriendRequest.accepted = now;
      await this.datastore.friendRequests.update(mutualFriendRequest);
    }

    // create new friend for sender
    const senderFriend = {
      created: now,
      friendUserId: friendRequest.recipientUserId,
      id: null,
      userId: friendRequest.senderUserId
    };
    await this.datastore.friends.create(senderFriend);

    // create new friend for recipient
    const recipientFriend = {
      created: now,
      friendUserId: friendRequest.senderUserId,
      id: null,
      userId: friendRequest.recipientUserId
    };
    await this.datastore.friends.create(recipientFriend);

    return Promise.resolve({ senderFriend, recipientFriend });
  }

  public cancelFriendRequest(id: number): Promise<any> {
    return this.datastore.friendRequests.delete(id);
  }

  public getFriendRequest(id: number): Promise<FriendRequest> {
    return this.datastore.friendRequests.get(id);
  }

  public async getFriendRequestBySenderAndRecipient(
    senderUserId: string,
    recipientUserId: string
  ): Promise<FriendRequest> {
    const friendRequest = (await this.datastore.friendRequests.query({
      recipientUserId,
      senderUserId
    }))[0];

    return Promise.resolve(friendRequest);
  }

  public queryFriendRequests(criteria: any): Promise<FriendRequest[]> {
    return this.datastore.friendRequests.query(criteria);
  }

  public rejectFriendRequest(id: number): Promise<any> {
    return this.datastore.friendRequests.delete(id);
  }

  public submitRequest(request: SubmitFriendRequest): Promise<FriendRequest> {
    const friendRequest: FriendRequest = {
      accepted: null,
      id: null,
      recipientUserId: request.recipientUserId,
      senderUserId: request.senderUserId
    };

    return this.datastore.friendRequests.create(friendRequest);
  }
}
