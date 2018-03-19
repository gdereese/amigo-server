import * as moment from 'moment';

import { RepositoryProvider } from '../data/repository-provider';
import { Friend } from '../models/friend';
import { FriendRequest } from '../models/friend-request';
import { SubmitFriendRequest } from '../models/submit-friend-request';

export class FriendRequestService {
  private friends = RepositoryProvider(Friend);
  private friendRequests = RepositoryProvider(FriendRequest);

  public async acceptFriendRequest(id: number): Promise<any> {
    const friendRequest = await this.friendRequests.get(id);
    const now = moment().toDate();

    // mark friend request as accepted
    friendRequest.accepted = now;
    await this.friendRequests.update(friendRequest);

    // mark any similar request from the recipient end as accepted
    const mutualFriendRequest = (await this.friendRequests.query({
      recipientUserId: friendRequest.senderUserId,
      senderUserId: friendRequest.recipientUserId
    }))[0];
    if (mutualFriendRequest) {
      mutualFriendRequest.accepted = now;
      await this.friendRequests.update(mutualFriendRequest);
    }

    // create new friend for sender
    const senderFriend = {
      created: now,
      friendUserId: friendRequest.recipientUserId,
      id: null,
      userId: friendRequest.senderUserId
    };
    await this.friends.create(senderFriend);

    // create new friend for recipient
    const recipientFriend = {
      created: now,
      friendUserId: friendRequest.senderUserId,
      id: null,
      userId: friendRequest.recipientUserId
    };
    await this.friends.create(recipientFriend);

    return Promise.resolve({ senderFriend, recipientFriend });
  }

  public cancelFriendRequest(id: number): Promise<any> {
    return this.friendRequests.delete(id);
  }

  public getFriendRequest(id: number): Promise<FriendRequest> {
    return this.friendRequests.get(id);
  }

  public async getFriendRequestBySenderAndRecipient(
    senderUserId: string,
    recipientUserId: string
  ): Promise<FriendRequest> {
    const friendRequest = (await this.friendRequests.query({
      recipientUserId,
      senderUserId
    }))[0];

    return Promise.resolve(friendRequest);
  }

  public queryFriendRequests(criteria: any): Promise<FriendRequest[]> {
    return this.friendRequests.query(criteria);
  }

  public rejectFriendRequest(id: number): Promise<any> {
    return this.friendRequests.delete(id);
  }

  public submitRequest(request: SubmitFriendRequest): Promise<FriendRequest> {
    const friendRequest: FriendRequest = {
      accepted: null,
      id: null,
      recipientUserId: request.recipientUserId,
      senderUserId: request.senderUserId
    };

    return this.friendRequests.create(friendRequest);
  }
}
